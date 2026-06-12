// HALAMAN: C:\laragon\www\valid-react\src\components\valid\PublicExplore.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { Search, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { portfolioApi } from '../../lib/api';

export function PublicExplore() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const res = await portfolioApi.getPublicPortfolios();
        const list = res.portfolios || res.data || res || [];
        setPortfolios(list);
      } catch (err) {
        console.error("Gagal memuat portofolio publik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, []);

  const displayedPortfolios = portfolios
    .filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const matchesTitle = item.title?.toLowerCase().includes(q);
      const matchesVocation = item.vocationField?.toLowerCase().includes(q);
      const matchesSkills = (item.tags || []).some((s: string) => s.toLowerCase().includes(q));
      return matchesTitle || matchesVocation || matchesSkills;
    })
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 4);

  return (
    <section id="jelajah" className="w-full bg-[var(--bg-a)] py-20 md:py-32 relative text-[var(--text-color)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block border-2 border-slate-900 rounded-full px-4 py-1 mb-4 text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_#0f172a] bg-white text-slate-900 dark:border-white dark:shadow-[2px_2px_0px_white] dark:bg-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-body)' }}>
            Eksplorasi
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter" style={{ fontFamily: 'var(--font-impact)' }}>
            Jelajah Portofolio
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
            Temukan dan lihat karya dari ribuan pencari kerja lainnya yang telah diverifikasi oleh AI dan Profesional.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-16">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari skill (contoh: AutoCAD, React, Copywriting)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-16 pr-6 rounded-full border-4 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-lg font-medium shadow-[6px_6px_0px_var(--shadow-color)]"
            />
          </div>
          <button 
            onClick={() => {
              const hasUser = !!localStorage.getItem("valid_user");
              if (hasUser) {
                navigate({ to: '/dashboard/explore' });
              } else {
                navigate({ to: '/login' });
              }
            }}
            className="h-16 px-10 rounded-full bg-yellow-400 text-slate-900 border-4 border-slate-900 font-black text-lg uppercase tracking-widest shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#0f172a] transition-all whitespace-nowrap"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Cari Portofolio
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-500 font-bold">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span>Memuat karya terverifikasi...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && displayedPortfolios.length === 0 && (
          <div className="text-center py-12 border-4 border-dashed border-[var(--border-color)] rounded-[2rem] bg-[var(--card-bg)] shadow-[8px_8px_0px_var(--shadow-color)]">
            <p className="text-[var(--text-color)] font-black text-xl tracking-tight uppercase" style={{ fontFamily: 'var(--font-impact)' }}>
              Tidak Ada Portofolio Ditemukan
            </p>
          </div>
        )}

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!loading && displayedPortfolios.map((item, idx) => {
            const ownerName = item.userDisplayName || 'Kandidat Valid';
            const initial = ownerName.charAt(0).toUpperCase();
            const profileSlug = encodeURIComponent(ownerName.toLowerCase().trim().replace(/\s+/g, "-"));
            const scoreAI = item.verifiedScore || 0;
            const tags = item.tags || item.skills || [];
            const likesCount = item.likes?.length || 0;
            
            const avatarColors = ['bg-blue-400', 'bg-pink-400', 'bg-green-400', 'bg-yellow-400'];
            const avatarBg = avatarColors[idx % avatarColors.length];

            return (
              <div key={item.portfolioId || idx} className="bg-[var(--card-bg)] rounded-[2rem] p-6 md:p-8 border-4 border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_var(--shadow-color)] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-6 mb-6">
                    {/* Avatar and Score */}
                    <div className="flex flex-col items-center gap-3 shrink-0">
                      <div className={`w-20 h-20 rounded-full border-4 border-[var(--border-color)] ${avatarBg} flex items-center justify-center shadow-[4px_4px_0px_var(--shadow-color)]`}>
                        <span className="text-4xl font-black text-slate-900" style={{ fontFamily: 'var(--font-impact)' }}>{initial}</span>
                      </div>
                      <div className="bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-xl px-4 py-1 text-center shadow-[2px_2px_0px_var(--shadow-color)]">
                        <div className="text-xl font-black text-blue-600" style={{ fontFamily: 'var(--font-impact)' }}>{scoreAI > 0 ? scoreAI : '-'}</div>
                        <div className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Skor AI</div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-black uppercase text-[var(--text-color)] tracking-tight mb-1" style={{ fontFamily: 'var(--font-impact)' }}>{ownerName}</h3>
                      <p className="text-sm font-bold text-[var(--text-muted)] mb-4">{item.vocationField || 'Kandidat Umum'}</p>
                      
                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 3).map((skill: string, sIdx: number) => (
                          <span key={sIdx} className="inline-flex items-center gap-1 px-3 py-1 bg-transparent border-2 border-blue-200 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Project Highlight */}
                  <div className="border-2 border-dashed border-blue-300 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-5 mb-6 relative">
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Proyek Unggulan</div>
                    <div className="text-lg font-bold text-[var(--text-color)] line-clamp-1">{item.title}</div>
                    {item.description && (
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 font-medium">{item.description}</p>
                    )}
                  </div>
                </div>

                <div>
                  {/* Likes Count */}
                  <div className="flex items-center gap-2 mb-4 text-xs font-bold text-blue-600">
                    <span>👍 {likesCount} Suka</span>
                  </div>

                  {/* Action */}
                  <button 
                    onClick={() => navigate({ to: `/p/${profileSlug}` })}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl py-4 font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform shadow-[4px_4px_0px_var(--shadow-color)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Lihat Profil <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
