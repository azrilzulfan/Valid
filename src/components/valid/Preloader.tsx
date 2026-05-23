import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(obj.v)),
      onComplete: () => {
        const tl = gsap.timeline({
          onComplete: () => {
            onDone();
          },
        });
        tl.to(".pre-count", { y: -40, opacity: 0, duration: 0.5, ease: "power3.in" })
          .to(".pre-brand", { y: -20, opacity: 0, duration: 0.6, ease: "power3.in" }, "<0.05")
          .to(rootRef.current, {
            yPercent: -100,
            duration: 1,
            ease: "expo.inOut",
          });
      },
    });
    return () => {
      tween.kill();
    };
  }, [onDone]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "var(--navy-deep)" }}
    >
      <div className="pre-brand font-display text-[15vw] md:text-[11rem] leading-none text-white">
        VAL<span style={{ color: "var(--soft-blue)" }}>I</span>D
      </div>
      <div className="pre-count mt-6 flex items-center gap-4 text-white/70 font-body text-sm tracking-[0.3em] uppercase">
        <span className="h-px w-12 bg-white/30" />
        Memuat {count.toString().padStart(3, "0")}
        <span className="h-px w-12 bg-white/30" />
      </div>
      <div className="absolute bottom-10 left-0 right-0 mx-auto h-[2px] w-[40vw] max-w-md overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full"
          style={{
            width: `${count}%`,
            background: "linear-gradient(90deg, var(--soft-blue), white)",
            transition: "width 60ms linear",
          }}
        />
      </div>
    </div>
  );
}