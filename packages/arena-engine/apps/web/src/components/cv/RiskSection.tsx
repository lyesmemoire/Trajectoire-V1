export default function RiskSection({ gaps }: { gaps: string[] }) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <section className="mt-8 bg-[#151B23] border border-white/5 p-8">
      <h3 className="text-xs font-bold font-sans text-[#9CA3AF] uppercase tracking-widest mb-6">
        Intégrité & Cohérence Narrative
      </h3>

      <div className="space-y-4">
        {gaps.map((gap: string, i: number) => (
          <p key={i} className="text-sm text-[#E5E7EB] font-sans leading-relaxed">
            {gap}
          </p>
        ))}
      </div>
    </section>
  );
}
