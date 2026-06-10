// HALAMAN: C:\laragon\www\valid-react\src\pages\Coins.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { motion, AnimatePresence, useMotionValue, animate, Variants } from 'framer-motion';
import { LayoutDashboard, FolderOpen, Mic, Star, Users, Coins as CoinsIcon, ChevronRight, X, CheckCircle2, Compass } from 'lucide-react';
import { useState, useEffect } from 'react';
import { paymentApi } from '../lib/api';

const DUMMY_TRANSACTIONS = [
  { id: '1', date: 'Belum ada transaksi', desc: 'Riwayat kosong', amount: 0, balance: 0, type: 'info' }
];

const PACKAGES = [
  { id: 1, koin: 10, priceRp: '10.000', perKoin: '1.000', badge: null },
  { id: 2, koin: 50, priceRp: '45.000', perKoin: '900', badge: { text: 'POPULER', color: 'blue' } },
  { id: 3, koin: 100, priceRp: '85.000', perKoin: '850', badge: { text: 'HEMAT 15%', color: 'green' } },
];

const pageVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: '-50%', x: '-50%' },
  visible: { opacity: 1, scale: 1, y: '-50%', x: '-50%', transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }
};

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest))
    });
    return controls.stop;
  }, [value, count]);

  return <>{display}</>;
}

export function Coins() {
  const [balance, setBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<typeof PACKAGES[0] | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    paymentApi.getMyPayments().then(res => {
      setTransactions(res.payments || []);
    }).catch(console.error);
  }, []);

  const handleBeli = (pkg: typeof PACKAGES[0]) => {
    setSelectedPkg(pkg);
    setIsModalOpen(true);
    setIsSuccess(false);
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBalance(prev => prev + (selectedPkg?.koin || 0));
      setIsSuccess(true);
    }, 1000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPkg(null);
      setIsSuccess(false);
    }, 300);
  };

  return (
    <div className="flex w-full h-screen bg-[var(--bg-a)] overflow-hidden text-[var(--text-color)] font-sans">
      
      {/* SIDEBAR */}
      <UserSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto bg-[var(--bg-a)] relative pb-[100px] md:pb-[40px]">
        <motion.div 
          className="p-[20px_16px] md:p-[32px_40px] max-w-[1000px] mx-auto relative z-10"
          variants={pageVariants as any}
          initial="hidden"
          animate="visible"
        >
          {/* HEADER */}
          <motion.div variants={sectionVariants as any} className="mb-[32px]">
            <div className="inline-flex px-3 py-1 bg-yellow-100 border-[2px] border-yellow-500 rounded-full shadow-[2px_2px_0px_#eab308] font-black text-[9px] uppercase tracking-widest text-yellow-700 mb-[12px]" style={{ fontFamily: 'var(--font-body)' }}>KOIN</div>
            <div className="font-black text-[32px] md:text-[40px] text-[var(--text-color)] tracking-tighter mt-[4px] leading-tight uppercase" style={{ fontFamily: 'var(--font-impact)' }}>DOMPET KOIN</div>
          </motion.div>

          {/* BALANCE HERO - NEO BRUTALISM */}
          <motion.div variants={sectionVariants as any} className="bg-yellow-400 border-[3px] border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-[24px] p-[36px_40px] mb-[40px] relative overflow-hidden flex flex-col justify-center min-h-[180px]">
            <div className="absolute right-[32px] top-1/2 -translate-y-1/2 font-black text-[120px] md:text-[160px] text-yellow-500/50 tracking-tighter pointer-events-none select-none drop-shadow-sm" style={{ fontFamily: 'var(--font-impact)' }}>
              <AnimatedNumber value={balance} />
            </div>
            
            <div className="relative z-10">
              <div className="font-black text-[12px] text-yellow-900 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>SALDO SAAT INI</div>
              <div className="flex items-baseline gap-[12px] mt-[8px]">
                <CoinsIcon className="w-[40px] h-[40px] text-slate-900 translate-y-1" />
                <div className="font-black text-[56px] md:text-[72px] text-slate-900 tracking-tighter leading-none" style={{ fontFamily: 'var(--font-impact)' }}>
                  <AnimatedNumber value={balance} />
                </div>
                <div className="font-black text-[20px] text-yellow-900 uppercase" style={{ fontFamily: 'var(--font-body)' }}>koin</div>
              </div>
              <div className="font-bold text-[14px] text-yellow-800 mt-[8px] bg-yellow-300 inline-block px-3 py-1 border-[2px] border-slate-900 rounded-lg shadow-[2px_2px_0px_#0f172a]" style={{ fontFamily: 'var(--font-body)' }}>
                ≈ Rp {(balance * 900).toLocaleString('id-ID')}
              </div>
            </div>
          </motion.div>

          {/* TOP-UP OPTIONS */}
          <motion.div variants={sectionVariants as any} className="mb-[40px]">
            <div className="font-black text-[20px] text-[var(--text-color)] mb-[20px] uppercase" style={{ fontFamily: 'var(--font-impact)' }}>TAMBAH KOIN</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
              {PACKAGES.map((pkg) => (
                <motion.div 
                  key={pkg.id}
                  whileHover={{ y: -5, boxShadow: '6px 6px 0px var(--shadow-color)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[20px] p-[28px_24px] text-center relative overflow-hidden flex flex-col"
                >
                  {pkg.badge && (
                    <div className={`absolute top-[16px] right-[16px] px-[10px] py-[4px] rounded-lg font-black text-[9px] uppercase tracking-widest border-[2px] ${pkg.badge.color === 'blue' ? 'bg-blue-100 text-blue-700 border-blue-500 shadow-[2px_2px_0px_#3b82f6]' : 'bg-green-100 text-green-700 border-green-500 shadow-[2px_2px_0px_#22c55e]'}`} style={{ fontFamily: 'var(--font-body)' }}>
                      {pkg.badge.text}
                    </div>
                  )}
                  
                  <div className="flex justify-center mb-[20px] relative w-[56px] h-[56px] mx-auto">
                    <div className="absolute w-[28px] h-[28px] rounded-full bg-yellow-400 border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] top-0 left-0" />
                    <div className="absolute w-[36px] h-[36px] rounded-full bg-yellow-300 border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] bottom-0 right-0 z-10" />
                    <div className="absolute w-[24px] h-[24px] rounded-full bg-yellow-500 border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] top-[50%] left-[20%] z-20" />
                  </div>
                  
                  <div className="font-black text-[48px] text-[var(--text-color)] leading-none mt-[16px]" style={{ fontFamily: 'var(--font-impact)' }}>{pkg.koin}</div>
                  <div className="font-bold text-[14px] text-[var(--text-muted)] uppercase tracking-widest mt-1" style={{ fontFamily: 'var(--font-body)' }}>koin</div>
                  
                  <div className="w-full border-t-[2.5px] border-dashed border-[var(--border-color)] my-[20px]" />
                  
                  <div className="font-black text-[20px] text-[var(--text-color)]" style={{ fontFamily: 'var(--font-impact)' }}>Rp {pkg.priceRp}</div>
                  <div className="font-bold text-[11px] text-[var(--text-muted)] mt-[6px]" style={{ fontFamily: 'var(--font-body)' }}>Rp {pkg.perKoin}/koin</div>
                  
                  <button 
                    onClick={() => handleBeli(pkg)}
                    className="w-full bg-yellow-400 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[2px_2px_0px_#0f172a] hover:translate-y-[2px] text-slate-900 rounded-[12px] py-[12px] font-black text-[14px] uppercase tracking-widest mt-auto pt-[14px] transition-all" style={{ fontFamily: 'var(--font-body)' }}
                  >
                    BELI SEKARANG
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* TRANSACTION HISTORY */}
          <motion.div variants={sectionVariants as any}>
            <div className="font-black text-[20px] text-[var(--text-color)] mb-[20px] uppercase" style={{ fontFamily: 'var(--font-impact)' }}>RIWAYAT TRANSAKSI</div>
            
            <div className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[20px] overflow-hidden">
              <div className="hidden md:grid grid-cols-4 p-[16px_24px] bg-[var(--bg-a)] border-b-[2.5px] border-[var(--border-color)]">
                <div className="font-black text-[11px] text-[var(--text-color)] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>TANGGAL</div>
                <div className="font-black text-[11px] text-[var(--text-color)] uppercase tracking-widest col-span-2" style={{ fontFamily: 'var(--font-body)' }}>KETERANGAN</div>
                <div className="font-black text-[11px] text-[var(--text-color)] uppercase tracking-widest text-right" style={{ fontFamily: 'var(--font-body)' }}>JUMLAH</div>
              </div>
              {(transactions.length > 0 ? transactions : DUMMY_TRANSACTIONS).map((trx: any, i: number) => (
                <div key={trx.id || trx._id || i} className="grid grid-cols-1 md:grid-cols-4 p-[20px_24px] border-b-[2px] border-dashed border-[var(--border-color)] hover:bg-[var(--bg-a)] transition-colors last:border-0 gap-3 md:gap-0 items-center">
                  <div className="font-bold text-[13px] text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-body)' }}>{trx.date || new Date(trx.createdAt || Date.now()).toLocaleDateString('id-ID')}</div>
                  
                  <div className="font-black text-[14px] text-[var(--text-color)] col-span-2 flex items-center gap-[12px] uppercase" style={{ fontFamily: 'var(--font-body)' }}>
                    <div className={`w-[12px] h-[12px] rounded-full border-[2px] border-slate-900 shadow-[1px_1px_0px_#0f172a] shrink-0 ${
                      (trx.status === 'success' || trx.type === 'topup') ? 'bg-green-500' : 'bg-slate-300'
                    }`} />
                    {trx.desc || `Pembayaran Review (Status: ${trx.status})`}
                  </div>
                  
                  <div className="flex md:flex-col justify-between md:items-end w-full md:w-auto">
                    <span className="md:hidden font-bold text-[12px] text-[var(--text-muted)]">Gross: {trx.amount || trx.grossAmount || 0}</span>
                    <div className="text-right flex flex-col items-end">
                      <div className="bg-[var(--card-bg)] border-[2px] border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] px-[10px] py-[4px] rounded-lg">
                        <div className={`font-black text-[16px] leading-none ${trx.amount > 0 ? 'text-green-600' : 'text-slate-600'}`} style={{ fontFamily: 'var(--font-impact)' }}>
                          Rp {(trx.amount || trx.grossAmount || 0).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedPkg && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
            />
            
            <motion.div 
              variants={modalVariants as any} initial="hidden" animate="visible" exit="exit"
              className="fixed top-1/2 left-1/2 w-[90%] max-w-[460px] bg-[var(--card-bg)] border-[3px] border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-[24px] z-50 overflow-hidden"
            >
              {!isSuccess ? (
                <div className="flex flex-col">
                  <div className="flex justify-between items-center p-[24px_32px] border-b-[2.5px] border-slate-900 bg-yellow-300">
                    <div className="font-black text-[22px] text-slate-900 uppercase" style={{ fontFamily: 'var(--font-impact)' }}>KONFIRMASI BELI</div>
                    <button onClick={closeModal} className="w-[32px] h-[32px] bg-white border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] rounded-lg flex items-center justify-center hover:-translate-y-0.5 transition-transform"><X className="w-5 h-5 text-slate-900" /></button>
                  </div>
                  
                  <div className="p-[32px]">
                    <div className="bg-[var(--bg-a)] border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-[16px] p-[24px]">
                      <div className="font-black text-[40px] text-slate-900 text-center leading-none" style={{ fontFamily: 'var(--font-impact)' }}>{selectedPkg.koin} KOIN</div>
                      <div className="font-bold text-[14px] text-slate-600 text-center mt-[8px]" style={{ fontFamily: 'var(--font-body)' }}>Rp {selectedPkg.priceRp}</div>
                      
                      <div className="w-full border-t-[2.5px] border-dashed border-slate-300 my-[20px]" />
                      
                      <div className="flex justify-between items-center mb-[12px]">
                        <span className="font-bold text-[12px] uppercase text-slate-500" style={{ fontFamily: 'var(--font-body)' }}>Saldo sebelum</span>
                        <span className="font-black text-[14px] text-slate-800" style={{ fontFamily: 'var(--font-body)' }}>{balance} koin</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[12px] uppercase text-slate-500" style={{ fontFamily: 'var(--font-body)' }}>Saldo setelah</span>
                        <span className="font-black text-[20px] text-green-600 bg-green-100 px-[10px] py-[4px] rounded-md border-[2px] border-green-500 shadow-[2px_2px_0px_#22c55e]" style={{ fontFamily: 'var(--font-impact)' }}>{balance + selectedPkg.koin} koin</span>
                      </div>
                    </div>
                    
                    <div className="font-bold text-[11px] text-[var(--text-muted)] text-center mt-[24px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>
                      Simulasi Pembayaran (Demo)
                    </div>
                    
                    <div className="mt-[16px] flex gap-[12px]">
                      <button 
                        onClick={closeModal}
                        disabled={isSubmitting}
                        className="flex-[2] bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[12px] py-[14px] font-black text-[13px] uppercase tracking-widest text-[var(--text-color)] hover:bg-[var(--text-color)] hover:text-white transition-colors shadow-[2px_2px_0px_var(--shadow-color)]" style={{ fontFamily: 'var(--font-body)' }}
                      >
                        BATAL
                      </button>
                      <button 
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="flex-[3] bg-blue-600 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-[12px] py-[14px] font-black text-[13px] uppercase tracking-widest text-white hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {isSubmitting ? 'MEMPROSES...' : 'BAYAR'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center p-[48px_32px] bg-green-50">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.6, times: [0, 0.6, 1], ease: "backOut" }}
                    className="w-[100px] h-[100px] rounded-full bg-yellow-400 border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] flex items-center justify-center mb-[24px]"
                  >
                    <CoinsIcon className="w-[48px] h-[48px] text-slate-900" />
                  </motion.div>
                  
                  <div className="font-black text-[28px] text-slate-900 text-center uppercase leading-none" style={{ fontFamily: 'var(--font-impact)' }}>TOP UP BERHASIL!</div>
                  <div className="font-bold text-[14px] text-green-700 text-center mt-[12px]" style={{ fontFamily: 'var(--font-body)' }}>
                    Saldo kamu sekarang: {balance} koin
                  </div>
                  
                  <button 
                    onClick={closeModal}
                    className="w-full max-w-[240px] bg-blue-600 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 rounded-[12px] py-[14px] font-black text-[13px] uppercase tracking-widest text-white mt-[32px] transition-all" style={{ fontFamily: 'var(--font-body)' }}
                  >
                    TUTUP
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
