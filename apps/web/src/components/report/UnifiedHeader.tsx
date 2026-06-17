export default function UnifiedHeader({
  targetRole,
  date,
}: {
  candidateName?: string;
  targetRole: string;
  date: string;
}) {
  return (
    <header className="border-b border-white/5 pb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
      <div className="space-y-1">
        <div className="font-serif text-2xl font-semibold tracking-[0.08em] text-[#E5E7EB] uppercase">
          TRAJECTOIRE
        </div>
        <div className="text-xs font-mono text-[#9CA3AF] tracking-widest uppercase">
          Executive Evaluation Dossier
        </div>
      </div>
      <div className="flex flex-col md:text-right gap-1 text-[10px] font-mono text-[#9CA3AF] uppercase tracking-widest">
        <div>Role Target: {targetRole}</div>
        <div>Date: {new Date(date).toLocaleDateString()}</div>
        <div>Status: Confidentiel</div>
      </div>
    </header>
  );
}
