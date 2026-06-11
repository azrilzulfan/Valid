// HALAMAN: C:\laragon\www\valid-react\src\components\auth\AuthLeftPanel.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { motion, Variants } from 'framer-motion';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

export function AuthLeftPanel() {
  return (
    <div className="w-full md:w-[42%] relative flex flex-col justify-center md:justify-between h-auto md:h-full p-6 md:p-12 overflow-hidden shrink-0 bg-[var(--card-bg)] border-b-[3.5px] md:border-b-0 md:border-r-[3.5px] border-[var(--border-color)]">
      
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* top logo */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants} className="flex flex-col md:block items-center md:items-start text-center md:text-left">
            <img src="/logo.png" alt="VALID Logo" className="h-[40px] md:h-[40px] object-contain hover:scale-105 transition-transform" />
            <h1 className="hidden md:block text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[var(--text-color)] mt-6" style={{ fontFamily: "var(--font-impact)" }}>
              Buktikan<br />
              <span className="text-blue-600 dark:text-blue-400">Kemampuanmu</span>
            </h1>
          </motion.div>
        </motion.div>

        {/* middle testimonial - hidden on mobile */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="hidden md:flex flex-1 flex-col justify-center">
          <motion.div variants={itemVariants} className="bg-[var(--card-bg)] border-[3.5px] border-[var(--border-color)] rounded-[2rem] p-8 shadow-[8px_8px_0px_var(--shadow-color)] relative mt-8 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="text-7xl font-black text-yellow-400 absolute -top-8 -left-4 transform -rotate-12" style={{ fontFamily: "var(--font-display)" }}>
              "
            </div>
            <p className="text-lg font-bold text-[var(--text-color)] leading-relaxed mt-2" style={{ fontFamily: "var(--font-body)" }}>
              Laporan AI dari VALID membantu saya tau persis di mana harus berkembang.
            </p>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t-[2.5px] border-dashed border-[var(--border-color)]">
              <div className="w-12 h-12 rounded-[1rem] border-[2.5px] border-[var(--border-color)] bg-blue-100 flex items-center justify-center font-black text-xl text-blue-600 shadow-[3px_3px_0px_var(--border-color)]">
                R
              </div>
              <div>
                <div className="font-black text-[var(--text-color)] text-sm uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>Rizky P.</div>
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Alumni SMK</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* bottom stats - hidden on mobile */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="hidden md:grid grid-cols-2 gap-5 mt-12">
          {[
            { num: '10K+', label: 'Lulusan' },
            { num: '98%', label: 'Puas' }
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] rounded-[1.5rem] p-5 shadow-[5px_5px_0px_var(--shadow-color)] transform hover:-translate-y-1 transition-transform">
              <div className="text-4xl font-black text-blue-600 dark:text-blue-400" style={{ fontFamily: "var(--font-impact)" }}>{stat.num}</div>
              <div className="text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
