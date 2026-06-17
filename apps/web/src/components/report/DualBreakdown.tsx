export default function DualBreakdown({
  cvScore,
  technicalDepthScore,
  communicationScore,
  quantificationDepthScore,
  leadershipCompositeScore
}: {
  cvScore: number;
  interviewScore: number;
  technicalDepthScore: number;
  communicationScore: number;
  quantificationDepthScore: number;
  leadershipCompositeScore: number;
}) {
  return (
    <section className="mt-8 border-t border-white/5 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-xs font-bold font-sans text-[#9CA3AF] uppercase tracking-widest border-b border-white/5 pb-4">
            CV Evaluation
          </h3>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#9CA3AF] font-sans">Score CV Global</span>
            <span className="text-[#E5E7EB] font-mono">{cvScore.toFixed(1)} / 100</span>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-xs font-bold font-sans text-[#9CA3AF] uppercase tracking-widest border-b border-white/5 pb-4">
            Interview Evaluation
          </h3>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#9CA3AF] font-sans">Technical Depth</span>
            <span className="text-[#E5E7EB] font-mono">{technicalDepthScore.toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#9CA3AF] font-sans">Communication</span>
            <span className="text-[#E5E7EB] font-mono">{communicationScore.toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#9CA3AF] font-sans">Quantification</span>
            <span className="text-[#E5E7EB] font-mono">{quantificationDepthScore.toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#9CA3AF] font-sans">Leadership & Impact</span>
            <span className="text-[#E5E7EB] font-mono">{leadershipCompositeScore.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
