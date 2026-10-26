import VariableName from "@/components/VariableName";
import { TLink } from "@/components/Transition";

export default function NotFound() {
  return (
    <section className="min-h-[100svh] flex flex-col justify-center px-5 md:px-10 pt-20 pb-10">
      <div className="label text-mute">(Error 404)</div>
      <VariableName lines={["404"]} className="text-[clamp(8rem,34vw,30rem)] leading-[0.8] tracking-[-0.03em] my-6 select-none" />
      <div className="flex flex-wrap items-end justify-between gap-6">
        <p className="text-[clamp(1.4rem,3vw,2.4rem)] leading-tight max-w-[22ch]">
          This page wandered off. <span className="font-serif italic text-saffron">Let&apos;s get you back.</span>
        </p>
        <TLink to="/" className="rounded-full bg-saffron text-night font-semibold px-6 py-3">Back home →</TLink>
      </div>
    </section>
  );
}
