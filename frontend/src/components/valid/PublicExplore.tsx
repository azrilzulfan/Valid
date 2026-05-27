import { Search, CheckCircle2, ChevronRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const PUBLIC_PORTFOLIOS = [
  {
    initial: "A",
    name: "AHMAD FAUZI",
    role: "Junior Web Developer",
    score: 82,
    skills: ["React", "Tailwind CSS", "Node.js"],
    project: "Sistem Manajemen Apotek",
    color: "bg-blue-400",
  },
  {
    initial: "S",
    name: "SITI NURHALIZA",
    role: "Graphic Designer & Illustrator",
    score: 88,
    skills: ["Adobe Illustrator", "UI/UX", "Photoshop"],
    project: "Redesign Aplikasi M-Banking",
    color: "bg-pink-400",
  },
  {
    initial: "B",
    name: "BAGAS PRATAMA",
    role: "Teknisi Jaringan & Cloud",
    score: 75,
    skills: ["Cisco", "AWS", "Linux"],
    project: "Setup Infrastruktur Startup",
    color: "bg-green-400",
  },
  {
    initial: "D",
    name: "DINDA KIRANA",
    role: "Content Creator & Copywriter",
    score: 91,
    skills: ["Copywriting", "SEO", "Tiktok Ads"],
    project: "Campaign Promosi Halal 2026",
    color: "bg-yellow-400",
  },
];

export function PublicExplore() {
  const navigate = useNavigate();

  return (
    <section
      id="jelajah"
      className="w-full bg-[var(--bg-b)] py-20 md:py-32 relative text-[var(--text-color)]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12">
          <div
            className="inline-block border-2 border-slate-900 rounded-full px-4 py-1 mb-4 text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_#0f172a] bg-white text-slate-900 dark:border-white dark:shadow-[2px_2px_0px_white] dark:bg-slate-900 dark:text-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Eksplorasi
          </div>
          <h2
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter"
            style={{ fontFamily: "var(--font-impact)" }}
          >
            Jelajah Portofolio
          </h2>
          <p
            className="text-slate-600 dark:text-slate-400 font-medium max-w-2xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Temukan dan lihat karya dari ribuan pencari kerja lainnya yang telah diverifikasi oleh
            AI dan Profesional.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-16">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              placeholder="Cari skill (contoh: AutoCAD, React, Copywriting)..."
              className="w-full h-16 pl-16 pr-6 rounded-full border-4 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-lg font-medium shadow-[6px_6px_0px_var(--shadow-color)]"
            />
          </div>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="h-16 px-10 rounded-full bg-yellow-400 text-slate-900 border-4 border-slate-900 font-black text-lg uppercase tracking-widest shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#0f172a] transition-all whitespace-nowrap"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Cari Portofolio
          </button>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PUBLIC_PORTFOLIOS.map((item, idx) => (
            <div
              key={idx}
              className="bg-[var(--card-bg)] rounded-[2rem] p-6 md:p-8 border-4 border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_var(--shadow-color)] transition-all"
            >
              <div className="flex items-start gap-6 mb-6">
                {/* Avatar and Score */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div
                    className={`w-20 h-20 rounded-full border-4 border-[var(--border-color)] ${item.color} flex items-center justify-center shadow-[4px_4px_0px_var(--shadow-color)]`}
                  >
                    <span
                      className="text-4xl font-black text-slate-900"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      {item.initial}
                    </span>
                  </div>
                  <div className="bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-xl px-4 py-1 text-center shadow-[2px_2px_0px_var(--shadow-color)]">
                    <div
                      className="text-xl font-black text-blue-600"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      {item.score}
                    </div>
                    <div className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      Skor AI
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3
                    className="text-2xl font-black uppercase text-[var(--text-color)] tracking-tight mb-1"
                    style={{ fontFamily: "var(--font-impact)" }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-sm font-bold text-[var(--text-muted)] mb-4">{item.role}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-transparent border-2 border-blue-200 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project Highlight */}
              <div className="border-2 border-dashed border-blue-300 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-5 mb-6 relative">
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">
                  Proyek Unggulan
                </div>
                <div className="text-lg font-bold text-[var(--text-color)]">{item.project}</div>
              </div>

              {/* Action */}
              <button
                onClick={() => navigate({ to: "/login" })}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl py-4 font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform shadow-[4px_4px_0px_var(--shadow-color)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Lihat Profil <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
