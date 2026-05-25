import { motion } from 'framer-motion';

interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
  rightContent?: React.ReactNode;
}

export function AdminPageHeader({ title, subtitle, rightContent }: AdminPageHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-[40px] pt-[20px] md:pt-[24px]"
    >
      <div className="flex flex-col gap-3">
        <div className="inline-flex px-3 py-1 bg-yellow-300 border-[2.5px] border-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-900 shadow-[2px_2px_0px_#0f172a] w-fit" style={{ fontFamily: 'var(--font-body)' }}>
          {subtitle}
        </div>
        <h1 className="text-[var(--text-color)] text-[40px] md:text-[52px] font-black uppercase tracking-tighter leading-none" style={{ fontFamily: 'var(--font-impact)' }}>
          {title}.
        </h1>
      </div>
      {rightContent && (
        <div className="flex-shrink-0">
          {rightContent}
        </div>
      )}
    </motion.div>
  );
}
