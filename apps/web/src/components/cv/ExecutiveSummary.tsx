export default function ExecutiveSummary({ summary, score }: any) {
  const truthMessage = score >= 8.0 
    ? "This profile demonstrates high market competitiveness and is positioned to clear top-tier screening filters."
    : score >= 6.5
    ? "This profile is competitive but may face friction at top-tier firms without sharper impact quantification."
    : "This profile would not consistently pass top-tier screening filters without structural revision.";

  return (
    <section className="cabinet-section">
      <h2>Executive Market Positioning</h2>
      <p className="executive-summary-text" style={{ marginBottom: '16px' }}>
        {summary?.overall_level || summary}
      </p>
      <p className="cabinet-truth" style={{ fontSize: '14px', color: '#f87171', fontStyle: 'italic', borderLeft: '2px solid #f87171', paddingLeft: '12px' }}>
        {truthMessage}
      </p>
    </section>
  )
}
