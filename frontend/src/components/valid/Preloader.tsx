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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg-a)] transition-colors duration-500"
    >
      <div className="pre-brand">
        <img
          src="/logo.png"
          alt="VALID Logo"
          className="w-[60vw] md:w-[400px] h-auto object-contain drop-shadow-xl"
        />
      </div>
      <div className="pre-count mt-6 flex items-center gap-4 text-slate-500 dark:text-slate-400 font-body text-sm tracking-[0.3em] uppercase">
        <span className="h-px w-12 bg-slate-300 dark:bg-slate-700" />
        Memuat {count.toString().padStart(3, "0")}
        <span className="h-px w-12 bg-slate-300 dark:bg-slate-700" />
      </div>
      <div className="absolute bottom-10 left-0 right-0 mx-auto h-[4px] w-[40vw] max-w-md overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full bg-blue-600 dark:bg-blue-400"
          style={{
            width: `${count}%`,
            transition: "width 60ms linear",
          }}
        />
      </div>
    </div>
  );
}
