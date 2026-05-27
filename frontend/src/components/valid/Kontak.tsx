import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Kontak() {
  const [sent, setSent] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-contact-text", {
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(formRef.current, {
        y: 50,
        rotation: 1,
        duration: 1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="kontak"
      className="relative py-32 px-6 bg-[var(--bg-a)] text-[var(--text-color)] transition-colors duration-500 overflow-hidden"
    >
      {/* Soft Premium Gradient Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] mix-blend-screen animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section title badge */}
        <div className="animate-contact-text inline-flex px-4 py-2 bg-yellow-300 rounded-full border-2 border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] transform -rotate-1 mb-8 transition-all duration-350">
          <span
            className="text-xs font-black uppercase text-slate-900 tracking-widest"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Kontak
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col items-start">
            <h2
              className="animate-contact-text text-[3.5rem] sm:text-[4.5rem] lg:text-[6rem] font-black uppercase leading-[0.85] tracking-tighter"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              Ada yang mau
              <br />
              <span className="text-yellow-500 dark:text-yellow-300">ditanyain?</span>
            </h2>
            <p className="animate-contact-text mt-8 text-lg md:text-xl text-[var(--text-muted)] max-w-md font-semibold leading-relaxed font-body">
              Kalau kamu penasaran gimana VALID jalan, tinggal hubungi aja. Kita siap bantu jelasin.
            </p>

            <div className="animate-contact-text mt-12 space-y-4 w-full max-w-md">
              <InfoRow icon={Mail} label="Email" value="halo@valid.id" />
              <InfoRow icon={Phone} label="Telepon" value="+62 811 2345 6789" />
              <InfoRow icon={MapPin} label="Kantor" value="Jakarta Selatan, Indonesia" />
              <InfoRow icon={Clock} label="Jam Kerja" value="Senin - Jumat, 09.00 - 18.00" />
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setTimeout(() => setSent(false), 3000);
            }}
            className="bg-[var(--card-bg)] border-[3.5px] border-[var(--border-color)] rounded-[2rem] p-8 sm:p-10 shadow-[8px_8px_0px_var(--shadow-color)] relative overflow-hidden group transition-all duration-500 hover:shadow-[4px_4px_0px_var(--shadow-color)]"
          >
            {/* Subtle glow border */}
            <div className="absolute inset-0 border border-white/5 rounded-[2rem] pointer-events-none" />

            <Field label="Nama" type="text" placeholder="Nama lengkap kamu" />
            <Field label="Email" type="email" placeholder="kamu@email.com" />
            <Field label="Peran" type="text" placeholder="Pekerja vokasi, industri, lembaga" />

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider font-black text-[var(--text-muted)] mb-2">
                Pesan
              </label>
              <textarea
                rows={4}
                required
                placeholder="Ceritain yang mau kamu tanyain"
                className="w-full bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-3 rounded-2xl py-4 font-black uppercase text-sm tracking-wider text-white transition-all duration-300 border-2 border-slate-900 shadow-[4px_4px_0px_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000]"
              style={{ background: "linear-gradient(135deg, var(--primary), #1d4ed8)" }}
            >
              {sent ? "Terkirim" : "Kirim Pesan"}
              <span className="font-black">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, type, placeholder }: { label: string; type: string; placeholder: string }) {
  return (
    <div className="mb-6">
      <label className="block text-xs uppercase tracking-wider font-black text-[var(--text-muted)] mb-2">
        {label}
      </label>
      <input
        type={type}
        required
        placeholder={placeholder}
        className="w-full bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
      />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-5 p-4 bg-[var(--card-bg)] border-[2px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-2xl hover:border-slate-400 dark:hover:border-slate-700 transition-colors duration-300 group">
      <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500 dark:text-blue-400 group-hover:bg-yellow-300 group-hover:text-slate-900 transition-all duration-300">
        <Icon className="w-5 h-5 stroke-[2]" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-0.5">
          {label}
        </div>
        <div className="text-[var(--text-color)] font-semibold text-base sm:text-lg">{value}</div>
      </div>
    </div>
  );
}
