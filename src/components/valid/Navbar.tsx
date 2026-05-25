import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const links = [
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Coba AI", href: "#coba-ai" },
  { label: "Kontak", href: "#kontak" },
];

export function Navbar() {
  const [shrunk, setShrunk] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 60) setShrunk(true);
      else setShrunk(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark") || 
      localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 sm:px-6">
      <nav
        className={`pointer-events-auto mt-4 sm:mt-6 flex items-center justify-between transition-all duration-500 ease-out ${
          shrunk
            ? "w-full max-w-3xl rounded-[2rem] bg-[var(--card-bg)]/40 backdrop-blur-xl border border-[var(--border-color)]/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-5 py-2.5"
            : "w-full max-w-7xl rounded-2xl bg-transparent px-2 py-4"
        }`}
      >
        {/* LOGO */}
        <a href="#top" className="flex items-center gap-2 pl-2">
          <img src="/logo.png" alt="VALID Logo" className={`object-contain transition-all ${shrunk ? 'h-[32px] sm:h-[40px]' : 'h-[44px] sm:h-[56px]'}`} />
        </a>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                shrunk ? "text-slate-700 dark:text-slate-300" : "text-slate-800 dark:text-slate-200"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA & MOBILE MENU */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              const html = document.documentElement;
              const isDarkNow = html.classList.toggle("dark");
              setIsDark(isDarkNow);
              localStorage.setItem("theme", isDarkNow ? "dark" : "light");
            }}
            className="p-2 sm:p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors mr-1 cursor-pointer flex items-center justify-center pointer-events-auto"
            style={{ color: "var(--navy)" }}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-300 stroke-[2]" />
            ) : (
              <Moon className="w-5 h-5 text-slate-800 stroke-[2]" />
            )}
          </button>

          <a
            href="/login"
            className={`hidden sm:inline-flex items-center justify-center rounded-full font-bold transition-all hover:scale-105 active:scale-95 bg-slate-900 dark:bg-white text-white dark:text-slate-900 ${
              shrunk ? "px-5 py-2 text-sm" : "px-6 py-2.5 text-sm"
            }`}
          >
            Masuk
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-white"
            aria-label="Menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className="block h-0.5 bg-current rounded-full" />
              <span className="block h-0.5 bg-current w-3/4 rounded-full" />
            </div>
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="pointer-events-auto absolute top-24 left-4 right-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-xl md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100/50"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/login"
            onClick={() => setOpen(false)}
            className="block mt-2 px-4 py-3.5 rounded-xl font-bold text-white text-center"
            style={{ background: "var(--navy)" }}
          >
            Masuk
          </a>
        </div>
      )}
    </header>
  );
}