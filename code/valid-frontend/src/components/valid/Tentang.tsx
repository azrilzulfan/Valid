// HALAMAN: C:\laragon\www\valid-react\src\components\valid\Tentang.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { useEffect, useState } from 'react';
import { dashboardApi } from '../../lib/api';
import { ShieldCheck, Zap, Award, Target } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Tentang() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    dashboardApi.getStats()
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to load stats:", err));
  }, []);
  return (
    <div className="min-h-screen bg-[var(--bg-b)] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 text-[var(--text-color)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header Section */}
          <div className="mb-24 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-block bg-yellow-400 text-slate-900 font-bold px-4 py-2 rounded-full mb-6 border-[2px] border-slate-900 shadow-[4px_4px_0px_#0f172a] transform -rotate-2">
                TENTANG VALID
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase leading-[0.9] tracking-tighter mb-6" style={{ fontFamily: 'var(--font-impact)' }}>
                Membongkar <span className="text-blue-600 relative inline-block">Kepalsuan.<span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 -z-10 transform -rotate-1"></span></span><br/>
                Memvalidasi Kemampuan.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
                Kami membangun VALID bukan sekadar untuk menjadi platform portofolio biasa. Kami lahir dari rasa frustrasi melihat betapa mudahnya klaim keahlian palsu mengelabui proses rekrutmen. Sudah saatnya skill nyata mendapatkan tempat yang layak.
              </p>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-blue-600 rounded-[2rem] transform rotate-3 translate-x-2 translate-y-2 border-[3px] border-slate-900"></div>
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 md:p-12 border-[3px] border-slate-900 relative shadow-[8px_8px_0px_#0f172a]">
                <h3 className="text-2xl font-black mb-4" style={{ fontFamily: 'var(--font-impact)' }}>VISI KITA BERSAMA</h3>
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-6">
                  Menciptakan ekosistem profesional di mana kejujuran adalah mata uang utama, dan kompetensi dibuktikan dengan data, bukan retorika.
                </p>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full border-[2px] border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#0f172a]">
                    <Target className="w-6 h-6 text-slate-900" />
                  </div>
                  <div className="w-12 h-12 bg-blue-400 rounded-full border-[2px] border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#0f172a]">
                    <Award className="w-6 h-6 text-slate-900" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values / Stats alternative */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
              {
                title: stats ? `${stats.totalVerified || "12.000+"}` : "12.000+",
                subtitle: "Klaim Diverifikasi",
                desc: "Kami terus menganalisis dan memvalidasi portofolio dengan ketelitian tinggi.",
                color: "bg-blue-100",
                textColor: "text-blue-600"
              },
              {
                title: stats ? `${stats.aiAccuracy || "94"}%` : "94%",
                subtitle: "Akurasi Deteksi AI",
                desc: "Sistem kami mampu membedakan karya otentik dari template bajakan.",
                color: "bg-yellow-100",
                textColor: "text-yellow-600"
              },
              {
                title: "Gratis",
                subtitle: "Untuk Pencari Kerja",
                desc: "Akses tanpa batas untuk membuktikan kemampuan aslimu ke dunia.",
                color: "bg-blue-600",
                textColor: "text-white"
              }
            ].map((stat, i) => (
              <div key={i} className={`${stat.color} rounded-[2rem] p-8 border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] transform transition-transform hover:-translate-y-2`}>
                <h4 className={`text-5xl font-black mb-2 ${stat.textColor === 'text-white' ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'var(--font-impact)' }}>{stat.title}</h4>
                <div className={`text-sm font-bold uppercase tracking-widest mb-4 ${stat.textColor === 'text-white' ? 'text-blue-200' : 'text-slate-500'}`}>{stat.subtitle}</div>
                <p className={`font-medium ${stat.textColor === 'text-white' ? 'text-blue-100' : 'text-slate-700'}`}>
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Pillars */}
          <div className="bg-[var(--card-bg)] rounded-[3rem] border-[4px] border-[var(--border-color)] p-8 md:p-16 shadow-[12px_12px_0px_var(--shadow-color)]">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-16 uppercase tracking-tighter" style={{ fontFamily: 'var(--font-impact)' }}>Pilar Kepercayaan VALID</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex gap-6">
                <div className="shrink-0 w-16 h-16 bg-blue-600 rounded-2xl border-[3px] border-slate-900 flex items-center justify-center shadow-[4px_4px_0px_#0f172a] transform -rotate-3">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3 uppercase" style={{ fontFamily: 'var(--font-impact)' }}>Transparansi Penuh</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Setiap nilai dan verifikasi yang diberikan memiliki jejak analisis yang jelas. Tidak ada blackbox, semua terbuka agar kamu mengerti di mana kelebihan dan kekuranganmu.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="shrink-0 w-16 h-16 bg-yellow-400 rounded-2xl border-[3px] border-slate-900 flex items-center justify-center shadow-[4px_4px_0px_#0f172a] transform rotate-3">
                  <Zap className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3 uppercase" style={{ fontFamily: 'var(--font-impact)' }}>Kecepatan Objektif</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Dalam hitungan detik, sistem kami melakukan screening yang biasanya memakan waktu berjam-jam secara manual, memberikan hasil yang cepat dan bebas dari bias manusia.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
