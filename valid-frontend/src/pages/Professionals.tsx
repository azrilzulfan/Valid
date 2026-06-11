// src/pages/Professionals.tsx
import { motion, Variants } from "framer-motion";
import { Star, Coins, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { UserSidebar } from "../components/valid/UserSidebar";
import { ProfileSlideOver } from "../components/professionals/ProfileSlideOver";
import { ReviewModal } from "../components/professionals/ReviewModal";
import { verifierApi, paymentApi, portfolioApi, dashboardApi } from "../lib/api";

const pageVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function Professionals() {
  const [verifiers, setVerifiers] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [selectedVerifierUid, setSelectedVerifierUid] = useState<string | null>(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>("");
  const [customNote, setCustomNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileViewUid, setProfileViewUid] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const verRes = await verifierApi.getList();
        setVerifiers(verRes.verifiers || []);

        const portRes = await portfolioApi.getMyPortfolios();
        const portfolioData = portRes.portfolios || (Array.isArray(portRes) ? portRes : []);
        setPortfolios(portfolioData);

        try {
          const dashRes = await dashboardApi.getCandidateDashboard();
          const coins = dashRes.profile?.coins ?? dashRes.coins ?? dashRes.stats?.coins ?? 0;
          setBalance(coins);
        } catch (e) {
          console.error("Gagal ambil saldo, default ke 0:", e);
          setBalance(0);
        }
      } catch (err) {
        console.error("Gagal memuat data utama professionals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeVerifier = verifiers.find((v) => v.uid === selectedVerifierUid);
  const viewVerifier = verifiers.find((v) => v.uid === profileViewUid);

  // Konversi verifier ke format yg kompatibel dengan komponen existing
  const mapVerifierToProf = (v: any) => ({
    id: v.uid,
    name: v.fullName,
    headline: `${v.currentJob || "Ahli Industri"} · ${v.experienceYears || 0} Tahun Pengalaman`,
    skills: v.vocationFields || [],
    rating: v.averageRating || 0,
    reviews: v.totalReviews || 0,
    price: v.reviewFee || 0,
    gradient: "linear-gradient(135deg, #2563EB, #1D4ED8)",
    about: `${v.currentJob || "Profesional"} di ${v.institution || "Industri"}. Pengalaman ${v.experienceYears || 0} tahun.`,
    experience: [{ role: v.currentJob, company: v.institution, year: "Aktif" }],
    verified_projects: v.totalReviews || 0,
    user_reviews: [],
  });

  const handleMintaReview = (uid?: string) => {
    if (uid) setSelectedVerifierUid(uid);

    // Auto-select portfolio pertama milik user jika tersedia
    if (portfolios.length > 0) {
      const firstId = portfolios[0].portfolioId || portfolios[0].id || portfolios[0]._id;
      setSelectedPortfolioId(firstId || "");
    }

    setModalStep(1);
    setIsModalOpen(true);
    setIsProfileOpen(false);
  };

  const handleLihatProfil = (uid: string) => {
    setProfileViewUid(uid);
    setIsProfileOpen(true);
  };

  const handleConfirmReview = async () => {
    if (!selectedVerifierUid || !selectedPortfolioId) return;
    setIsSubmitting(true);
    try {
      await paymentApi.createPayment({
        verifierUid: selectedVerifierUid,
        portfolioId: selectedPortfolioId,
        note: customNote,
      });

      const fee = activeVerifier?.reviewFee || 0;
      setBalance((prev) => Math.max(0, prev - fee));

      setModalStep(3);
    } catch (err: any) {
      alert(err.message || "Gagal membuat pemesanan review portofolio");
    } finally {
      // <-- GANTI KATA 'division' MENJADI 'finally' DI SINI!
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalStep(1);
      setSelectedVerifierUid(null);
      setCustomNote("");
    }, 300);
  };

  const filteredVerifiers = verifiers.filter(
    (v) =>
      v.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      v.vocationFields?.some((f: string) => f.toLowerCase().includes(search.toLowerCase())),
  );

  const mappedActiveProf = activeVerifier ? mapVerifierToProf(activeVerifier) : null;
  const mappedViewProf = viewVerifier ? mapVerifierToProf(viewVerifier) : null;

  return (
    <div className="flex w-full h-screen bg-[var(--bg-a)] overflow-hidden text-[var(--text-color)] font-sans">
      <UserSidebar />
      <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto bg-[var(--bg-a)] relative pb-[100px] md:pb-[40px]">
        <motion.div
          className="p-[20px_16px] md:p-[32px_40px] max-w-[1200px] mx-auto relative z-10"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {/* HEADER */}
          <motion.div variants={sectionVariants} className="mb-[32px]">
            <div
              className="inline-flex px-3 py-1 bg-[var(--card-bg)] border-[2px] border-[var(--border-color)] rounded-full shadow-[2px_2px_0px_var(--shadow-color)] font-black text-[9px] uppercase tracking-widest text-blue-600 mb-[12px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              PROFESIONAL
            </div>
            <div
              className="font-black text-[32px] md:text-[40px] text-[var(--text-color)] tracking-tighter mt-[4px] leading-tight uppercase"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              CARI REVIEWER
            </div>
            <div
              className="font-bold text-[14px] md:text-[15px] text-[var(--text-muted)] mt-[8px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Pilih verifikator ahli yang akan memverifikasi kemampuanmu.
            </div>
          </motion.div>

          {/* SEARCH */}
          <motion.div variants={sectionVariants} className="mb-[32px]">
            <div className="relative">
              <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari nama atau bidang keahlian..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] rounded-[1.5rem] py-[14px] pl-[46px] pr-[16px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] shadow-[4px_4px_0px_var(--shadow-color)] transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
          </motion.div>

          {/* GRID */}
          {loading ? (
            <div className="text-center py-20 font-bold text-[var(--text-muted)]">
              Memuat verifikator...
            </div>
          ) : filteredVerifiers.length === 0 ? (
            <div className="text-center py-20 font-bold text-[var(--text-muted)]">
              {search
                ? "Tidak ditemukan verifikator dengan kriteria tersebut."
                : "Belum ada verifikator yang tersedia."}
            </div>
          ) : (
            <motion.div
              variants={sectionVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]"
            >
              {filteredVerifiers.map((v) => (
                <motion.div
                  key={v.uid}
                  whileHover={{ y: -5, boxShadow: "6px 6px 0px var(--shadow-color)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[1.5rem] p-[24px] cursor-pointer group flex flex-col"
                >
                  {/* Top Row */}
                  <div className="flex gap-[16px] items-center">
                    <div
                      className="w-[56px] h-[56px] rounded-[14px] border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center font-black text-[24px] text-white shrink-0 bg-blue-600"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      {v.fullName
                        ?.split(" ")
                        .slice(0, 2)
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-black text-[18px] text-[var(--text-color)] truncate uppercase"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        {v.fullName}
                      </div>
                      <div
                        className="font-bold text-[12px] text-[var(--text-muted)] mt-[4px] truncate"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {v.currentJob} · {v.institution}
                      </div>
                    </div>
                    <div
                      className="bg-blue-100 border-[2px] border-blue-600 rounded-lg px-[10px] py-[4px] font-black text-[10px] tracking-widest text-blue-700 shrink-0 shadow-[2px_2px_0px_#2563eb]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      AHLI
                    </div>
                  </div>

                  <div className="w-full border-t-[2px] border-dashed border-[var(--border-color)] my-[20px]" />

                  {/* Skills */}
                  <div className="flex flex-wrap gap-[8px] mb-auto">
                    {(v.vocationFields || []).map((field: string, idx: number) => (
                      <div
                        key={idx}
                        className="bg-[var(--bg-a)] border-[2px] border-[var(--border-color)] rounded-[8px] px-[12px] py-[6px] font-black text-[10px] text-[var(--text-muted)] uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {field}
                      </div>
                    ))}
                  </div>

                  {/* Bottom Row */}
                  <div className="mt-[24px] flex justify-between items-end">
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex items-center gap-[6px]">
                        <Star className="w-[16px] h-[16px] text-yellow-400 fill-yellow-400" />
                        <span
                          className="font-black text-[16px] text-[var(--text-color)]"
                          style={{ fontFamily: "var(--font-impact)" }}
                        >
                          {v.averageRating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                      <span
                        className="font-bold text-[11px] text-[var(--text-muted)]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        ({v.totalReviews || 0} review)
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-[2px]">
                      <div className="flex items-center gap-[6px]">
                        <Coins className="w-[18px] h-[18px] text-yellow-500" />
                        <span
                          className="font-black text-[24px] text-[var(--text-color)] leading-none"
                          style={{ fontFamily: "var(--font-impact)" }}
                        >
                          {v.reviewFee || 0}
                        </span>
                      </div>
                      <span
                        className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        KOIN
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-[24px] flex gap-[12px]">
                    <button
                      type="button"
                      onClick={() => handleLihatProfil(v.uid)}
                      className="flex-1 bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] rounded-[12px] py-[10px] font-black text-[11px] uppercase tracking-widest text-[var(--text-color)] text-center hover:bg-[var(--text-color)] hover:text-white transition-all shadow-[2px_2px_0px_var(--shadow-color)]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Lihat Profil
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMintaReview(v.uid)}
                      className="flex-1 bg-blue-600 border-[2.5px] border-slate-900 rounded-[12px] py-[10px] font-black text-[11px] uppercase tracking-widest text-white text-center hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Minta Review
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {mappedViewProf && (
        <ProfileSlideOver
          isOpen={isProfileOpen}
          viewProf={mappedViewProf}
          onClose={() => setIsProfileOpen(false)}
          onMintaReview={() => handleMintaReview(profileViewUid || undefined)}
        />
      )}

      {mappedActiveProf && (
        <ReviewModal
          isOpen={isModalOpen}
          modalStep={modalStep}
          setModalStep={setModalStep}
          activeProf={mappedActiveProf} // Mengirim hasil map yang sudah memiliki field warna gradien, name, dsb
          balance={balance} // Menggunakan state balance asli
          portfolios={portfolios} // Menggunakan state portfolios asli hasil fetch data
          selectedProjectId={selectedPortfolioId}
          setSelectedProjectId={setSelectedPortfolioId}
          customNote={customNote}
          setCustomNote={setCustomNote}
          isSubmitting={isSubmitting} // Menggunakan state isSubmitting asli
          onConfirm={handleConfirmReview} // Menggunakan fungsi konfirmasi asli pemanggil API
          onClose={closeModal}
        />
      )}
    </div>
  );
}
