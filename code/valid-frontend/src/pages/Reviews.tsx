// src/pages/Reviews.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { UserSidebar } from "../components/valid/UserSidebar";
import { portfolioApi, paymentApi } from "../lib/api";
import { ReviewListCard } from "../components/reviews/ReviewListCard";
import { ReviewDetailPanel } from "../components/reviews/ReviewDetailPanel";

const pageVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const slideOverVariants = {
  hidden: { x: "100%", opacity: 1 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { x: "100%", opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

function mapStatusToDisplay(status: string): string {
  if (status === "pending") return "MENUNGGU";
  if (status === "under_review") return "DITERIMA";
  if (status === "approved") return "SELESAI";
  if (status === "rejected") return "DITOLAK";
  return status.toUpperCase();
}

export function Reviews() {
  const [activeTab, setActiveTab] = useState("SEMUA");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portRes, payRes] = await Promise.all([
          portfolioApi.getMyPortfolios(),
          paymentApi.getMyPayments().catch(() => ({ payments: [] })),
        ]);

        const portfolios = portRes.portfolios || [];
        const paymentsData = payRes.payments || [];
        setPayments(paymentsData);

        // Gabungkan portofolio dengan pembayaran terkait
        const mapped = portfolios.map((p: any) => {
          const relatedPayment = paymentsData.find((pay: any) => pay.portfolioId === p.portfolioId);
          return {
            id: p.portfolioId,
            project: p.title,
            reviewerName: relatedPayment ? "Verifikator" : "Peer Review",
            price: relatedPayment?.amount || 0,
            date: new Date(p.submittedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            status: mapStatusToDisplay(p.status),
            score: p.verifiedScore,
            feedback: p.verifierReview?.feedback || p.peerReviews?.[0]?.feedback,
            verifiedSkills: [],
            rating: null,
            gradient: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            reason: p.status === "rejected" ? "Tidak memenuhi standar" : null,
            peerReviews: p.peerReviews || [],
            verifierReview: p.verifierReview,
          };
        });
        setReviews(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedReview = reviews.find((r) => r.id === selectedReviewId);

  const stats = {
    SEMUA: reviews.length,
    MENUNGGU: reviews.filter((r) => r.status === "MENUNGGU").length,
    DITERIMA: reviews.filter((r) => r.status === "DITERIMA").length,
    SELESAI: reviews.filter((r) => r.status === "SELESAI").length,
    DITOLAK: reviews.filter((r) => r.status === "DITOLAK").length,
  };

  const filteredReviews =
    activeTab === "SEMUA" ? reviews : reviews.filter((r) => r.status === activeTab);

  const openDetail = (id: string) => {
    setSelectedReviewId(id);
    setIsPanelOpen(true);
  };

  const handleCancel = (id: string) => {
    if (window.confirm("Yakin batalkan? Pembayaran tidak dapat dikembalikan secara otomatis.")) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "DITOLAK", reason: "Dibatalkan oleh kamu." } : r,
        ),
      );
    }
  };

  return (
    <div className="flex w-full h-screen bg-[var(--bg-a)] overflow-hidden text-[var(--text-color)] font-sans">
      <UserSidebar />
      <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto bg-[var(--bg-a)] relative pb-[100px] md:pb-[40px]">
        <motion.div
          className="p-[20px_16px] md:p-[32px_40px] max-w-[1000px] mx-auto relative z-10"
          variants={pageVariants as any}
          initial="hidden"
          animate="visible"
        >
          {/* HEADER */}
          <motion.div variants={sectionVariants as any} className="mb-[32px]">
            <div
              className="inline-flex px-3 py-1 bg-green-100 border-[2px] border-green-500 rounded-full shadow-[2px_2px_0px_#22c55e] font-black text-[9px] uppercase tracking-widest text-green-700 mb-[12px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              REVIEW SAYA
            </div>
            <div
              className="font-black text-[32px] md:text-[40px] text-[var(--text-color)] tracking-tighter mt-[4px] leading-tight uppercase"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              STATUS REVIEW
            </div>
          </motion.div>

          {/* STATS ROW */}
          <motion.div
            variants={sectionVariants as any}
            className="grid grid-cols-2 md:grid-cols-4 gap-[16px] mb-[32px]"
          >
            {[
              { label: "MENUNGGU", count: stats.MENUNGGU, color: "bg-yellow-400" },
              { label: "DITERIMA", count: stats.DITERIMA, color: "bg-blue-500" },
              { label: "SELESAI", count: stats.SELESAI, color: "bg-green-500" },
              { label: "DITOLAK", count: stats.DITOLAK, color: "bg-red-500" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[16px] p-[20px] relative overflow-hidden flex flex-col items-center hover:-translate-y-1 transition-transform"
              >
                <div
                  className={`absolute left-0 top-[20%] w-[6px] h-[60%] rounded-r-[4px] ${stat.color} border-y-[2px] border-r-[2px] border-slate-900`}
                />
                <div
                  className="font-black text-[40px] text-[var(--text-color)] leading-none"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  {stat.count}
                </div>
                <div
                  className="font-bold text-[11px] uppercase tracking-widest text-[var(--text-muted)] mt-[8px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* FILTER TABS */}
          <motion.div
            variants={sectionVariants as any}
            className="flex gap-[12px] overflow-x-auto pb-4 mb-[16px] no-scrollbar"
          >
            {["SEMUA", "MENUNGGU", "DITERIMA", "SELESAI", "DITOLAK"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 border-[2.5px] rounded-full px-[20px] py-[10px] font-black text-[11px] uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? "bg-slate-900 border-slate-900 text-white shadow-[3px_3px_0px_#64748B]"
                    : "bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-slate-900 hover:text-slate-900 hover:shadow-[3px_3px_0px_var(--shadow-color)] hover:-translate-y-0.5"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {tab} ({stats[tab as keyof typeof stats]})
              </button>
            ))}
          </motion.div>

          {/* LIST */}
          <motion.div variants={sectionVariants as any} className="flex flex-col gap-[20px]">
            {loading ? (
              <div className="text-center py-20 font-bold text-[var(--text-muted)]">
                Memuat data review...
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredReviews.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center p-[60px_20px] text-center border-[2.5px] border-dashed border-[var(--border-color)] rounded-[24px]"
                  >
                    <div className="w-[80px] h-[80px] rounded-full bg-blue-50 flex items-center justify-center border-[2px] border-blue-200 mb-[24px]">
                      <Star className="w-[36px] h-[36px] text-blue-500" />
                    </div>
                    <div
                      className="font-black text-[24px] text-[var(--text-color)] uppercase"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      BELUM ADA DATA
                    </div>
                    <div
                      className="font-bold text-[14px] text-[var(--text-muted)] mt-[8px] max-w-[320px]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {activeTab === "SEMUA"
                        ? "Upload portofolio terlebih dahulu untuk mendapatkan review."
                        : `Tidak ada portfolio dengan status ${activeTab}.`}
                    </div>
                    {activeTab === "SEMUA" && (
                      <button
                        onClick={() => (window.location.href = "/dashboard/portfolio")}
                        className="mt-[24px] bg-blue-600 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-[12px] px-[24px] py-[12px] font-black text-[12px] uppercase tracking-widest text-white hover:-translate-y-1 transition-all"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        UPLOAD PORTFOLIO
                      </button>
                    )}
                  </motion.div>
                ) : (
                  filteredReviews.map((review) => (
                    <ReviewListCard
                      key={review.id}
                      review={review}
                      onClick={() => openDetail(review.id)}
                      onCancel={handleCancel}
                    />
                  ))
                )}
              </AnimatePresence>
            )}
          </motion.div>
        </motion.div>
      </div>

      <ReviewDetailPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        selectedReview={selectedReview}
        slideOverVariants={slideOverVariants}
        onCancel={handleCancel}
      />
    </div>
  );
}
