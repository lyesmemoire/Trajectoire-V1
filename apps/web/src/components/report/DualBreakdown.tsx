export default function DualBreakdown({
  cvScore,
  interviewScore,
  technicalDepthScore,
  communicationScore,
  quantificationDepthScore,
  leadershipCompositeScore,
}: {
  cvScore: number;
  interviewScore: number;
  technicalDepthScore: number;
  communicationScore: number;
  quantificationDepthScore: number;
  leadershipCompositeScore: number;
}) {
  return (
    <section className="report-grid">
      <div className="dual-breakdown">
        {/* Colonne CV */}
        <div className="breakdown-col">
          <h3 className="col-title">CV Evaluation</h3>
          <div className="score-row">
            <span className="row-label">Score CV Global</span>
            <span className="row-value">{cvScore.toFixed(1)} / 100</span>
          </div>
          {/* Note: The original code didn't display the other interviewScore inside CV block, 
              but it was passed as prop. We keep the layout faithful to the original. */}
        </div>

        {/* Colonne Interview */}
        <div className="breakdown-col">
          <h3 className="col-title">Interview Evaluation</h3>
          
          <div className="score-row">
            <span className="row-label">Technical Depth</span>
            <span className="row-value">{technicalDepthScore.toFixed(1)}</span>
          </div>
          
          <div className="score-row">
            <span className="row-label">Communication</span>
            <span className="row-value">{communicationScore.toFixed(1)}</span>
          </div>
          
          <div className="score-row">
            <span className="row-label">Quantification</span>
            <span className="row-value">{quantificationDepthScore.toFixed(1)}</span>
          </div>
          
          <div className="score-row">
            <span className="row-label">Leadership & Impact</span>
            <span className="row-value">{leadershipCompositeScore.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
