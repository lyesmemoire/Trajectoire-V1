export default function RewriteSection({ rewrite, isPro }: any) {
  return (
    <section className="cabinet-section">
      <h2>Executive Optimized Version</h2>

      <div className={`rewrite-container ${!isPro ? "blurred" : ""}`}>
        <p>{rewrite?.executive_profile_rewritten ?? "Executive rewrite is available with Pro."}</p>
      </div>

      {!isPro && (
        <div className="rewrite-overlay">
          <button className="unlock-btn">
            Unlock Executive Rewrite
          </button>
        </div>
      )}
    </section>
  )
}
