// HALAMAN: C:\laragon\www\valid-react\src\components\valid\PreFooterCTA.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { Link } from "@tanstack/react-router";

export function PreFooterCTA() {
  return (
    <section
      id="coba-ai"
      style={{
        backgroundColor: "var(--bg-b)",
        borderTop: "3px solid var(--border-color)",
        borderBottom: "3px solid var(--border-color)",
        padding: "100px 7vw",
        transition: "background-color 500ms ease, border-color 500ms ease",
      }}
    >
      <div 
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-8"
      >
        {/* Left Column */}
        <div className="w-full md:w-[60%] flex flex-col">
          <span
            style={{
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontSize: "11px",
              color: "var(--primary)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            COBA SEKARANG — GRATIS
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading), Syne, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(36px, 5vw, 64px)",
              color: "var(--text-color)",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              marginTop: "12px",
            }}
          >
            Siap buktikan kemampuanmu?
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "15px",
              color: "var(--text-muted)",
              maxWidth: "420px",
              lineHeight: 1.75,
              marginTop: "16px",
            }}
          >
            Tidak perlu daftar. Tidak perlu kartu kredit. Langsung jawab 5 pertanyaan dan dapatkan laporan AI dalam 30 detik.
          </p>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-[40%] flex flex-col items-start gap-4">
          <Link
            to="/interview"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              border: "3px solid var(--border-color)",
              boxShadow: "4px 4px 0px var(--shadow-color)",
              borderRadius: "12px",
              padding: "16px 40px",
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              width: "fit-content",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            className="hover:-translate-y-0.5 active:translate-y-0"
          >
            Mulai Wawancara AI
          </Link>
          <p
            style={{
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            Atau{" "}
            <a
              href="/register"
              style={{
                color: "var(--primary)",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              daftar
            </a>{" "}
            untuk simpan hasilmu →
          </p>
        </div>
      </div>
    </section>
  );
}
