// src/pages/Portfolio.tsx
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronRight, CheckCircle2, Zap, Plus, Pencil, Trash2, Compass } from "lucide-react";
import { useState, useEffect } from "react";
import { UserSidebar } from "../components/valid/UserSidebar";
import { portfolioApi, usersApi, interviewApi } from "../lib/api";
import { AddProjectModal } from "../components/portfolio/AddProjectModal";
import { useCurrentUser } from "../lib/useCurrentUser";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function Portfolio() {
  const { user } = useCurrentUser();
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [interviewHistory, setInterviewHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [portRes, intRes] = await Promise.all([
        portfolioApi.getMyPortfolios(),
        interviewApi.getHistory(),
      ]);
      setPortfolios(portRes.portfolios || []);
      setInterviewHistory(intRes.sessions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const initial = user?.displayName?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="flex w-full h-screen bg-[var(--bg-a)] overflow-hidden text-[var(--text-color)] font-sans">
      <UserSidebar />
      <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto bg-[var(--bg-a)] relative pb-[100px] md:pb-[40px]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[5%] right-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />
        </div>

        <motion.div
          className="p-[20px_16px] md:p-[32px_40px] max-w-[1000px] mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08 }}
        >
          {/* HEADER */}
          <motion.div
            variants={sectionVariants}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-[32px]"
          >
            <div>
              <div
                className="inline-flex px-3 py-1 bg-[var(--card-bg)] border-[2px] border-[var(--border-color)] rounded-full shadow-[2px_2px_0px_var(--shadow-color)] font-black text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-[12px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                PORTFOLIO
              </div>
              <div
                className="font-black text-[36px] md:text-[44px] text-[var(--text-color)] leading-[0.9] tracking-tighter mt-1 uppercase"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                PROFIL & KARYA
              </div>
            </div>
            <button
              onClick={() =>
                window.open(
                  `/p/${user?.displayName?.toLowerCase().replace(/ /g, "-") || "user"}`,
                  "_blank",
                )
              }
              className="bg-transparent hover:bg-[var(--card-bg)] transition-colors text-blue-600 rounded-[1rem] px-[20px] py-[12px] font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 border-[2.5px] border-blue-600 shadow-[3px_3px_0px_#2563EB] hover:shadow-[5px_5px_0px_#2563EB] hover:-translate-y-0.5 w-full sm:w-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Lihat Profil Publik <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* PROFILE HEADER */}
          <motion.div
            variants={sectionVariants}
            className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] rounded-[1.5rem] p-[28px] md:p-[32px] flex flex-col md:flex-row gap-[24px] items-center md:items-start shadow-[4px_4px_0px_var(--shadow-color)] mb-[24px]"
          >
            <div className="w-[80px] h-[80px] rounded-full border-[3px] border-slate-900 bg-blue-600 flex items-center justify-center shadow-[4px_4px_0px_#0f172a] shrink-0">
              <span
                className="font-black text-[36px] text-white"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                {initial}
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h2
                className="font-black text-[24px] md:text-[28px] text-[var(--text-color)] uppercase tracking-tight"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                {loading ? "..." : user?.displayName || "Pengguna"}
              </h2>
              <p
                className="font-bold text-[13px] md:text-[14px] text-[var(--text-muted)] mt-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {user?.vocationField || "Belum diset"} — {(user as any)?.location || "Indonesia"}
              </p>
              {(user as any)?.bio && (
                <p
                  className="font-medium text-[13px] text-[var(--text-muted)] mt-2 max-w-[400px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {(user as any).bio}
                </p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-[16px]">
                <span
                  className={`px-[12px] py-[4px] rounded-full border-[2px] border-[var(--border-color)] font-black text-[10px] uppercase tracking-widest ${user?.badgeLevel === "gold" ? "bg-yellow-300 text-yellow-900" : user?.badgeLevel === "silver" ? "bg-slate-200 text-slate-800" : user?.badgeLevel === "bronze" ? "bg-orange-200 text-orange-800" : "bg-[var(--bg-a)] text-[var(--text-muted)]"}`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {user?.badgeLevel ? `Badge ${user.badgeLevel.toUpperCase()}` : "Belum ada badge"}
                </span>
                <span
                  className="bg-[var(--bg-a)] border-[2px] border-[var(--border-color)] text-[var(--text-muted)] rounded-full px-[12px] py-[4px] font-black text-[10px] uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {user?.reputationPoints || 0} Poin Reputasi
                </span>
              </div>
            </div>
          </motion.div>

          {/* INTERVIEW HISTORY */}
          {interviewHistory.length > 0 && (
            <motion.div
              variants={sectionVariants}
              className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] rounded-[1.5rem] p-[28px] md:p-[32px] shadow-[4px_4px_0px_var(--shadow-color)] mb-[24px]"
            >
              <div className="flex justify-between items-end mb-[24px]">
                <h3
                  className="font-black text-[20px] text-[var(--text-color)] uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  RIWAYAT WAWANCARA
                </h3>
                <button
                  onClick={() => (window.location.href = "/dashboard/ai-interview")}
                  className="font-black text-[11px] uppercase tracking-widest text-blue-600 cursor-pointer hover:underline"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Lihat Semua →
                </button>
              </div>
              <div className="flex flex-col">
                {interviewHistory.slice(0, 3).map((sess: any, i: number) => (
                  <div
                    key={sess.sessionId || i}
                    className="flex gap-[16px] sm:gap-[24px] py-[20px] border-b-[2px] border-dashed border-[var(--border-color)] last:border-0 group hover:bg-[var(--bg-a)] transition-colors -mx-[12px] px-[12px] rounded-xl"
                  >
                    <div className="w-[60px] sm:w-[80px] shrink-0 text-right pt-[2px]">
                      <div
                        className="font-black text-[12px] text-[var(--text-color)] uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {new Date(sess.startedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      <div
                        className="font-bold text-[10px] text-[var(--text-muted)] mt-[2px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {new Date(sess.startedAt).getFullYear()}
                      </div>
                    </div>
                    <div className="relative w-[3px] bg-[var(--border-color)] shrink-0 rounded-full">
                      <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[12px] h-[12px] rounded-full border-[2.5px] border-slate-900 bg-blue-500 shadow-[1px_1px_0px_#0f172a] group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="flex-1 pb-[8px]">
                      <div className="flex items-baseline gap-1">
                        <span
                          className="font-black text-[28px] text-[var(--text-color)] leading-none"
                          style={{ fontFamily: "var(--font-impact)" }}
                        >
                          {sess.overall ?? "-"}
                        </span>
                        <span
                          className="font-black text-[11px] text-[var(--text-muted)] uppercase"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          /100
                        </span>
                      </div>
                      <div
                        className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-widest mt-[8px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {sess.vocationField?.toUpperCase()} · {sess.status?.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PROJECTS */}
          <motion.div variants={sectionVariants}>
            <div className="flex justify-between items-end mb-[20px]">
              <h3
                className="font-black text-[20px] text-[var(--text-color)] uppercase tracking-tight"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                PROYEK SAYA
              </h3>
              <button
                onClick={() => setIsAddProjectOpen(true)}
                className="bg-blue-600 text-white rounded-[1rem] px-[16px] py-[10px] font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-0.5 transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Plus className="w-4 h-4" /> Tambah Proyek
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-[var(--text-muted)] font-bold">
                Memuat portofolio...
              </div>
            ) : portfolios.length === 0 ? (
              <div className="col-span-1 md:col-span-2 text-center py-12 border-[2.5px] border-dashed border-[var(--border-color)] rounded-[1.5rem]">
                <p className="text-[var(--text-muted)] font-bold mb-4">
                  Kamu belum memiliki proyek di portfolio.
                </p>
                <button
                  onClick={() => setIsAddProjectOpen(true)}
                  className="bg-blue-600 text-white rounded-[1rem] px-[16px] py-[10px] font-black text-[12px] uppercase tracking-wider mx-auto border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#0f172a]"
                >
                  Tambah Proyek Pertama
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                {portfolios.map((proj: any, i: number) => (
                  <motion.div
                    key={proj.portfolioId || i}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] rounded-[1.5rem] overflow-hidden cursor-pointer shadow-[4px_4px_0px_var(--shadow-color)] hover:shadow-[6px_6px_0px_var(--shadow-color)] flex flex-col"
                  >
                    <div className="h-[140px] bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/20 relative flex items-center justify-center border-b-[2.5px] border-[var(--border-color)]">
                      <span
                        className="font-black text-[40px] text-blue-500/20 tracking-tighter"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        {proj.title?.substring(0, 2)?.toUpperCase() || "PF"}
                      </span>
                      {/* Status badge */}
                      <div
                        className={`absolute top-[12px] left-[12px] px-[10px] py-[4px] rounded-full border-[2px] font-black text-[9px] uppercase tracking-widest ${
                          proj.status === "approved"
                            ? "bg-green-100 border-green-500 text-green-700"
                            : proj.status === "under_review"
                              ? "bg-blue-100 border-blue-500 text-blue-700"
                              : "bg-yellow-100 border-yellow-500 text-yellow-700"
                        }`}
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {proj.status === "approved"
                          ? "Disetujui"
                          : proj.status === "under_review"
                            ? "Direview"
                            : "Menunggu"}
                      </div>
                      {proj.verifiedScore && (
                        <div className="absolute top-[12px] right-[12px] bg-white border-[2px] border-slate-900 rounded-lg px-[10px] py-[4px] shadow-[2px_2px_0px_#0f172a]">
                          <span
                            className="font-black text-[14px] text-blue-600"
                            style={{ fontFamily: "var(--font-impact)" }}
                          >
                            {proj.verifiedScore}
                          </span>
                          <span className="font-bold text-[9px] text-slate-500 ml-1">/100</span>
                        </div>
                      )}
                    </div>
                    <div className="p-[20px] flex flex-col flex-1">
                      <h4
                        className="font-black text-[16px] text-[var(--text-color)] uppercase tracking-wide"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {proj.title}
                      </h4>
                      <p
                        className="font-bold text-[12px] text-[var(--text-muted)] mt-[8px] line-clamp-2 leading-relaxed"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-[6px] mt-[12px]">
                        <span
                          className="bg-[var(--bg-a)] border-[2px] border-[var(--border-color)] text-[var(--text-muted)] rounded-md px-[8px] py-[4px] font-black text-[9px] uppercase tracking-widest"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {proj.vocationField}
                        </span>
                      </div>
                      <div
                        className="font-bold text-[10px] text-[var(--text-muted)]/60 mt-[12px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {new Date(proj.submittedAt).toLocaleDateString("id-ID")}
                      </div>
                      <div className="mt-auto pt-[16px] border-t-[2px] border-dashed border-[var(--border-color)] flex items-center justify-between">
                        <span
                          className="font-bold text-[10px] text-[var(--text-muted)] uppercase tracking-widest border-[2px] border-[var(--border-color)] px-[8px] py-[4px] rounded-full"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {proj.peerReviews?.length || 0} peer review
                        </span>
                        {proj.status !== "approved" && (
                          <button
                            onClick={() => (window.location.href = "/dashboard/professionals")}
                            className="font-black text-[11px] text-blue-600 uppercase tracking-widest hover:underline"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            Minta Review →
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => {
          setIsAddProjectOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
