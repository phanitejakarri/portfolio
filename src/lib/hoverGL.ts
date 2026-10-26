// A WebGL image plane that trails the cursor. It bends against the direction of travel,
// splits RGB with speed, and dissolves between projects with a noise mask.
// Plain WebGL1, no dependencies. Returns null when WebGL isn't available.

const VERT = `
attribute vec2 aPos;
uniform vec2 uVel;
uniform vec2 uInner;
uniform float uScale;
varying vec2 vUv;
void main() {
  vUv = aPos;
  vec2 p = (aPos - 0.5) * uInner * uScale;
  // the plane lags behind the cursor: middle of each edge bows the opposite way
  p.x -= sin(aPos.y * 3.14159) * uVel.x * 0.09;
  p.y += sin(aPos.x * 3.14159) * uVel.y * 0.09;
  gl_Position = vec4(p.x * 2.0, -p.y * 2.0, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uCoverA;
uniform vec2 uCoverB;
uniform float uMix;
uniform vec2 uVel;
uniform float uAlpha;
uniform float uAspect;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
vec2 cover(vec2 uv, vec2 s) { return vec2((uv.x - 0.5) * s.x + 0.5, uv.y * s.y); }
vec3 rgb(sampler2D t, vec2 uv, vec2 s, float shift) {
  return vec3(
    texture2D(t, cover(uv + vec2(shift, 0.0), s)).r,
    texture2D(t, cover(uv, s)).g,
    texture2D(t, cover(uv - vec2(shift, 0.0), s)).b
  );
}
void main() {
  float n = noise(vUv * 5.0) * 0.6 + noise(vUv * 14.0) * 0.4;
  float m = smoothstep(n * 0.55, n * 0.55 + 0.45, uMix);
  float shift = clamp(length(uVel), 0.0, 1.0) * 0.012;
  vec2 d = vec2(n - 0.5) * 0.12;
  vec3 a = rgb(uA, vUv + d * m, uCoverA, shift);
  vec3 b = rgb(uB, vUv - d * (1.0 - m), uCoverB, shift);
  vec3 col = mix(a, b, m);

  // rounded corners
  vec2 q = abs(vUv - 0.5) * vec2(uAspect, 1.0);
  vec2 hs = vec2(0.5 * uAspect, 0.5) - 0.045;
  float dist = length(max(q - hs, 0.0)) - 0.045;
  float edge = 1.0 - smoothstep(0.0, 0.004, dist);
  gl_FragColor = vec4(col, edge * uAlpha);
}`;

type Tex = { tex: WebGLTexture; w: number; h: number };

export type HoverGL = { show: (src: string | null) => void; destroy: () => void };

export function createHoverGL(canvas: HTMLCanvasElement, size = { w: 400, h: 250 }, pad = 90): HoverGL | null {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true });
  if (!gl) return null;

  const cw = size.w + pad * 2;
  const ch = size.h + pad * 2;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = cw * dpr;
  canvas.height = ch * dpr;
  canvas.style.width = `${cw}px`;
  canvas.style.height = `${ch}px`;
  gl.viewport(0, 0, canvas.width, canvas.height);

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("hoverGL:", gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  // a subdivided plane so the vertex bend is smooth
  const N = 24;
  const verts: number[] = [];
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const [x0, x1, y0, y1] = [x / N, (x + 1) / N, y / N, (y + 1) / N];
      verts.push(x0, y0, x1, y0, x0, y1, x0, y1, x1, y0, x1, y1);
    }
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = {
    vel: U("uVel"), inner: U("uInner"), scale: U("uScale"), a: U("uA"), b: U("uB"),
    coverA: U("uCoverA"), coverB: U("uCoverB"), mix: U("uMix"), alpha: U("uAlpha"), aspect: U("uAspect"),
  };
  gl.uniform2f(u.inner, size.w / cw, size.h / ch);
  gl.uniform1f(u.aspect, size.w / size.h);
  gl.uniform1i(u.a, 0);
  gl.uniform1i(u.b, 1);

  const blank = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, blank);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([18, 18, 18, 255]));

  const cache = new Map<string, Promise<Tex>>();
  const load = (src: string) => {
    if (!cache.has(src))
      cache.set(
        src,
        new Promise<Tex>((res, rej) => {
          const img = new Image();
          img.onload = () => {
            const tex = gl.createTexture()!;
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            res({ tex, w: img.naturalWidth, h: img.naturalHeight });
          };
          img.onerror = rej;
          img.src = src;
        })
      );
    return cache.get(src)!;
  };
  // fill the plane, anchored to the top of the screenshot
  const coverOf = (t: Tex | null): [number, number] => {
    if (!t) return [1, 1];
    const ia = t.w / t.h, qa = size.w / size.h;
    return ia > qa ? [qa / ia, 1] : [1, ia / qa];
  };

  let A: Tex | null = null, B: Tex | null = null;
  let mix = 0, mixTarget = 0, alpha = 0, alphaTarget = 0;
  let mx = 0, my = 0, px = 0, py = 0, vx = 0, vy = 0, raf = 0, token = 0;

  const onMove = (e: MouseEvent) => {
    mx = e.clientX;
    my = e.clientY;
  };
  window.addEventListener("mousemove", onMove);

  const frame = () => {
    const nx = px + (mx - px) * 0.14;
    const ny = py + (my - py) * 0.14;
    vx += ((nx - px) / 30 - vx) * 0.2;
    vy += ((ny - py) / 30 - vy) * 0.2;
    px = nx;
    py = ny;
    // plane's top-left sits just right of and above the cursor
    canvas.style.transform = `translate(${px + 36 + size.w / 2 - cw / 2}px, ${py - size.h * 0.55 + size.h / 2 - ch / 2}px)`;

    alpha += (alphaTarget - alpha) * 0.12;
    mix += (mixTarget - mix) * 0.08;
    if (mixTarget === 1 && mix > 0.995) {
      A = B;
      mix = 0;
      mixTarget = 0;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (alpha > 0.003) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, A?.tex ?? blank);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, (mixTarget ? B : A)?.tex ?? blank);
      gl.uniform2f(u.coverA, ...coverOf(A));
      gl.uniform2f(u.coverB, ...coverOf(mixTarget ? B : A));
      gl.uniform1f(u.mix, mix);
      gl.uniform2f(u.vel, Math.max(-1.5, Math.min(1.5, vx)), Math.max(-1.5, Math.min(1.5, vy)));
      gl.uniform1f(u.alpha, alpha);
      gl.uniform1f(u.scale, 0.8 + 0.2 * alpha);
      gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return {
    show(src) {
      const t = ++token;
      if (!src) {
        alphaTarget = 0;
        return;
      }
      load(src).then((tex) => {
        if (t !== token) return;
        alphaTarget = 1;
        if (!A || alpha < 0.05) {
          // appearing from nothing: no dissolve, just fade in
          A = tex;
          B = null;
          mix = 0;
          mixTarget = 0;
        } else if (tex !== A) {
          if (mixTarget === 1 && B) A = mix > 0.5 ? B : A;
          B = tex;
          mix = 0;
          mixTarget = 1;
        }
      });
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      // the canvas (and its context) may be reused by a remount, so only clear it
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
  };
}
