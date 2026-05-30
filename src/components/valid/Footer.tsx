// HALAMAN: C:\laragon\www\valid-react\src\components\valid\Footer.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

export function Footer() {
  return (
    <footer className="relative px-6 pt-24 pb-12 bg-[var(--bg-b)] text-[var(--text-color)] transition-colors duration-500 border-t border-[var(--border-color)]/10 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <img src="/logo.png" alt="VALID Logo" className="h-[48px] sm:h-[56px] object-contain hover:scale-105 transition-transform cursor-pointer" onClick={() => window.location.href = '/'} />
            <p className="text-[var(--text-muted)] text-base font-semibold leading-relaxed max-w-sm">
              Platform verifikasi peer berbasis AI untuk talenta dan pekerja vokasi Indonesia yang terpercaya.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-2">
              {["LinkedIn", "GitHub", "Instagram"].map((s, i) => (
                <span key={s} className="flex items-center gap-4">
                  <a
                    href="#"
                    className="text-sm font-bold text-[var(--text-muted)] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {s}
                  </a>
                  {i < 2 && <span className="text-[var(--text-muted)]/30 text-xs">|</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <div className="text-xs uppercase tracking-widest font-black text-[var(--text-muted)]">Navigasi</div>
            <div className="flex flex-col gap-3">
              {["Tentang", "Cara Kerja", "Untuk Siapa", "Kontak"].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase().replace(" ", "-")}`}
                  className="text-sm font-bold text-[var(--text-color)] hover:text-blue-600 dark:hover:text-blue-400 transition-colors self-start"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Status */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-widest font-black text-[var(--text-muted)]">Hubungi Kami</div>
              <a href="mailto:halo@valid.id" className="text-base font-bold text-blue-600 dark:text-blue-400 hover:underline self-start">
                halo@valid.id
              </a>
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-color)]/5">
              <div className="text-xs uppercase tracking-widest font-black text-[var(--text-muted)]">Status Layanan</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-bold text-[var(--text-color)]">Semua Layanan Berjalan Normal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border-color)]/10 text-xs font-bold text-[var(--text-muted)]">
          <div>© 2026 VALID. Hak Cipta Dilindungi.</div>
          <a href="#top" className="hover:text-[var(--text-color)] transition-colors">
            Kembali ke atas ↑
          </a>
        </div>
      </div>
    </footer>
  );
}