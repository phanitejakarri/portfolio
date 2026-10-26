# Phani Teja Karri — Portfolio (React + Vite)

Plain React (Vite + TypeScript + React Router + Tailwind CSS). No Next.js.

## Pages
- `/` Home: variable-font name that reacts to the cursor, a split-flap "currently" line, selected work with a
  sticky preview, about + stats, experience teaser, postcard call-to-action
- `/work` project index: featured cards, then every project in a filterable list with a cursor-following preview
- `/work/deck` 3D deck of project screenshots (scroll, swipe or arrow keys); click the front card for the case study
- `/work/<slug>` case study with an interactive architecture diagram (gitdiagram-style; every box links to its file on GitHub)
- `/experience` timeline chart (hover a bar to find its entry), work / community / education, recognition, toolkit
- `/contact` flip-and-write postcard that opens a pre-filled Gmail draft

Animation uses anime.js (`animejs` v4): page transitions (`components/Transition.tsx`), text reveals,
the work deck, timeline bars and accordions. Smooth scrolling is lenis.

## Run locally
```
npm install
npm run dev
```

## Build
```
npm run build
```
Outputs static files to `dist/` — deployable to Vercel, Netlify, GitHub Pages, or any static host.

## Editing content
All resume content lives in `src/lib/data.ts`. Edit that file to update
projects, skills, experience, education, achievements, or contact info.

## Projects
Each project in `src/lib/data.ts` has:
- `photos`: screenshots in `public/projects/` (leave empty and the architecture diagram becomes the cover)
- `repos`: leave empty for projects that only have a live site (no public repo)
- `featured: true` to show it on the home page and in the featured grid
- `repos`: GitHub repo names (the first one is used for the "Open in GitDiagram" link)
- GitDiagram: `src/gitdiagrams/<repo>.mmd` holds the Mermaid diagram for the primary repo, registered in
  `src/gitdiagrams/index.ts`. To refresh one from gitdiagram.com, generate it on the site, then copy the
  Mermaid code (Export → Mermaid) into the file and set `generated: true`.
- `diagram`: its interactive architecture map, defined in `src/lib/diagrams.ts`. Boxes sit on a 960-wide canvas
  (`x`, `y`, optional `w`), `path` is the file the box opens on GitHub, and `kind` sets the colour.
