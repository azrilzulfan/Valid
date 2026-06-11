// HALAMAN: C:\laragon\www\valid-react\src\pages\ProReviewRoom.tsx
// FUNGSI: Bilik pengujian penilai riil standar kriteria industri berbasis data API Backend
// API YANG DIBUTUHKAN: portfolioApi.getPortfolioById(id) & portfolioApi.reviewPortfolio(id, payload)

import { motion } from "framer-motion";
import {
  X,
  Play,
  Clock,
  CheckCircle2,
  ChevronLeft,
  Star,
  Send,
  AlertCircle,
  Sparkles,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { ThemeToggle } from "../components/valid/ThemeToggle";
import { portfolioApi } from "../lib/api";

export function ProReviewRoom() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [data, setData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const params = useParams({ strict: false });
  const portfolioId = (params as any)?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (portfolioId) {
      portfolioApi
        .getPortfolioById(portfolioId)
        .then((res) => setData(res.portfolio || res))
        .catch((err) => console.error("Gagal mengambil data proyek uji:", err));
    }
  }, [portfolioId]);

  const handleSubmit = async () => {
    if (!portfolioId || rating === 0 || !feedback.trim()) return;
    try {
      setSubmitting(true);
      await portfolioApi.reviewPortfolio(portfolioId, {
        technicalAccuracy: rating * 20,
        processDocumentation: rating * 20,
        originality: rating * 20,
        feedback: feedback || "Tidak ada catatan evaluasi khusus",
      });
      navigate({ to: "/pro/dashboard" });
    } catch (err) {
      console.error("Gagal mengirim ulasan final:", err);
      navigate({ to: "/pro/dashboard" }); // Fallback perlindungan state router
    } finally {
      setSubmitting(false);
    }
  };

  const candidateName = data?.user?.displayName || data?.candidateName || "Memuat...";
  const vocationField = data?.user?.vocationField || data?.category || "Umum";

  return (
    <div className="flex flex-col w-full min-h-screen bg-[var(--bg-b)] text-[var(--text-color)] font-sans transition-colors duration-300">
      {/* TOP NAV */}
      <div className="flex items-center justify-between px-[24px] py-[16px] bg-[var(--bg-a)] border-b-[3px] border-slate-900 sticky top-0 z-50 shadow-[0px_2px_0px_var(--shadow-color)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: "/pro/dashboard" })}
            className="w-[40px] h-[40px] rounded-[10px] border-[2.5px] border-slate-900 bg-[var(--bg-b)] flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-[2px_2px_0px_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--shadow-color)]"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--text-color)]" />
          </button>
          <div>
            <div
              className="font-black text-[18px] text-[var(--text-color)] leading-tight uppercase tracking-tight"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              BILIK EVALUASI <span className="text-blue-600">PRO</span>
            </div>
            <div
              className="font-bold text-[10px] text-slate-400 uppercase tracking-widest"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Kandidat: {candidateName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-950/40 border-[2px] border-yellow-500 rounded-full">
            <Clock className="w-4 h-4 text-yellow-600 animate-pulse" />
            <span
              className="font-black text-[10px] text-yellow-700 dark:text-yellow-400 uppercase tracking-widest"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Tenggat Penilaian: Aktif
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto p-[16px] lg:p-[32px] gap-[32px] relative z-10">
        {/* LEFT PANEL: Candidate Profile & Portfolio Document Area */}
        <div className="flex-1 flex flex-col gap-[24px]">
          {/* Profile Overview */}
          <div className="bg-[var(--bg-a)] rounded-[1.5rem] border-[3px] border-slate-900 shadow-[6px_6px_0px_var(--shadow-color)] p-[24px]">
            <div className="flex items-start gap-4">
              <div className="w-[80px] h-[80px] rounded-[16px] border-[3px] border-slate-900 bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center shadow-[4px_4px_0px_var(--shadow-color)] shrink-0">
                <User className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3
                  className="font-black text-[24px] md:text-[28px] text-[var(--text-color)] uppercase tracking-tight leading-none mb-1.5"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  {candidateName}
                </h3>
                <p
                  className="font-bold text-[12px] md:text-[13px] text-slate-400 uppercase tracking-widest mb-3"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {vocationField} • {data?.user?.location || "Terregistrasi"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(data?.user?.skills || data?.tags || ["Talenta Digital"]).map(
                    (skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-[var(--bg-b)] border-[2px] border-slate-900 rounded-md font-black text-[9px] uppercase tracking-widest text-slate-400"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
            {data?.user?.bio && (
              <p
                className="mt-5 font-bold text-[13px] text-slate-400 italic leading-relaxed border-t-[2.5px] border-dashed border-slate-200 dark:border-slate-800 pt-4"
                style={{ fontFamily: "var(--font-body)" }}
              >
                "{data.user.bio}"
              </p>
            )}
          </div>

          {/* AI Score Overview (Drawn from real analysis weights inside payload if existing) */}
          <div className="bg-blue-600 text-white rounded-[1.5rem] border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] p-[24px]">
            <div className="flex justify-between items-center mb-[20px]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <h3
                  className="font-black text-[16px] uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  REKOMENDASI DIKTI AI ASSISTANT
                </h3>
              </div>
              <div
                className="px-3 py-1 bg-slate-900 border-[2px] border-black text-white rounded-full font-black text-[10px] uppercase tracking-widest"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Skor Awal: {data?.aiScore || data?.initialScore || 75}/100
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
              {[
                { label: "Akurasi Teknis", score: data?.aiMetrics?.accuracy || 80 },
                { label: "Dokumentasi Proses", score: data?.aiMetrics?.documentation || 70 },
                { label: "Keaslian Kode", score: data?.aiMetrics?.originality || 85 },
              ].map((m, i) => (
                <div key={i} className="flex flex-col">
                  <div className="flex justify-between items-center mb-1.5">
                    <span
                      className="font-bold text-[10px] text-blue-200 uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {m.label}
                    </span>
                    <span
                      className="font-black text-[14px] text-white"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      {m.score}%
                    </span>
                  </div>
                  <div className="w-full h-[6px] bg-blue-950 border border-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-r-full"
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Projects Content View */}
          <div className="bg-[var(--bg-a)] rounded-[1.5rem] border-[3px] border-slate-900 shadow-[6px_6px_0px_var(--shadow-color)] overflow-hidden flex flex-col flex-1">
            <div className="bg-yellow-400 px-[24px] py-[16px] border-b-[3px] border-slate-900 flex justify-between items-center">
              <h3
                className="font-black text-[16px] text-slate-900 uppercase tracking-wider"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                BERKAS UJI PROYEK
              </h3>
              <span
                className="font-bold text-[10px] uppercase tracking-widest text-slate-800"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Dokumen Siap Diuji
              </span>
            </div>
            <div className="p-[24px] flex flex-col gap-4 overflow-y-auto max-h-[380px]">
              {(data?.portfolios?.length > 0 ? data.portfolios : data ? [data] : []).map(
                (proj: any, index: number) => (
                  <div
                    key={proj.id || proj._id || index}
                    className="border-[2.5px] border-slate-900 bg-[var(--bg-b)] rounded-xl p-5 shadow-[3px_3px_0px_var(--shadow-color)] group transition-all"
                  >
                    <h4
                      className="font-black text-[16px] text-[var(--text-color)] uppercase tracking-tight"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      {proj.title || "Spesifikasi Tugas Akhir"}
                    </h4>
                    <p
                      className="font-bold text-[11px] text-slate-400 uppercase tracking-widest mt-1 mb-3"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {proj.role || vocationField} • {proj.year || new Date().getFullYear()}
                    </p>
                    <p
                      className="font-bold text-[13px] text-slate-400 leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {proj.description ||
                        "Tidak tersedia deksripsi tambahan dari berkas mahasiswa."}
                    </p>

                    {proj.repositoryUrl || proj.link ? (
                      <div className="mt-4 pt-3 border-t border-dashed border-slate-700">
                        <a
                          href={proj.repositoryUrl || proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 border-[2px] border-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-lg shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 transition-all"
                        >
                          <Play className="w-3 h-3 fill-white" /> Buka Tautan Repositori
                        </a>
                      </div>
                    ) : null}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Professional Feedback Form Slider/Box */}
        <div className="flex-1 lg:max-w-[520px] flex flex-col bg-[var(--bg-a)] rounded-[1.5rem] border-[3px] border-slate-900 shadow-[8px_8px_0px_var(--shadow-color)] overflow-hidden">
          <div className="bg-yellow-400 p-[24px] border-b-[3px] border-slate-900">
            <h2
              className="font-black text-[24px] text-slate-900 uppercase tracking-tighter"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              LEMBAR PENILAIAN INDEPENDEN
            </h2>
            <p
              className="font-bold text-[12px] text-slate-800 tracking-wider mt-1"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Tentukan bobot kriteria standardisasi industri nasional secara objektif.
            </p>
          </div>

          <div className="p-[24px] flex-1 overflow-y-auto flex flex-col gap-[24px]">
            {/* Rating Star Row */}
            <div>
              <label
                className="font-black text-[11px] text-[var(--text-color)] uppercase tracking-widest block mb-2.5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Bintang Kualifikasi Kinerja
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="w-[48px] h-[48px] rounded-xl border-[2.5px] border-slate-900 flex items-center justify-center hover:-translate-y-1 hover:shadow-[3px_3px_0px_var(--shadow-color)] transition-all bg-[var(--bg-b)]"
                  >
                    <Star
                      className={`w-6 h-6 ${rating >= star ? "fill-yellow-400 text-yellow-500" : "text-slate-300 dark:text-slate-700"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* General Feedback Textarea */}
            <div>
              <label
                className="font-black text-[11px] text-[var(--text-color)] uppercase tracking-widest block mb-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Ulasan Evaluasi & Feedback Utama
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full min-h-[140px] bg-[var(--bg-b)] border-[2.5px] border-slate-900 rounded-xl p-4 font-bold text-[13px] text-[var(--text-color)] focus:outline-none focus:shadow-[4px_4px_0px_var(--shadow-color)] transition-all resize-none"
                placeholder="- Tulis evaluasi logismu terkait implementasi standar industri di sini..."
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>

            {/* Disclaimer Warning Box */}
            <div className="bg-yellow-950/40 border-[2px] border-dashed border-yellow-600 p-3 rounded-xl flex items-start gap-3 mt-2">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p
                className="font-bold text-[10px] text-yellow-500 leading-relaxed uppercase tracking-wider"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Dengan menekan Kirim, lembar penilaian akan dikunci secara permanen di basis data
                kandidat dan koin Anda akan bertambah secara otomatis.
              </p>
            </div>
          </div>

          {/* Action Submission Buttons */}
          <div className="p-[24px] border-t-[3px] border-slate-900 bg-[var(--bg-b)]">
            <button
              onClick={handleSubmit}
              disabled={submitting || rating === 0 || !feedback.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed text-white rounded-[1rem] px-[24px] py-[16px] font-black text-[14px] uppercase tracking-widest border-[3px] border-slate-900 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Send className="w-5 h-5" />{" "}
              {submitting ? "Mengamankan Data..." : "Kirim Ulasan Resmi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
