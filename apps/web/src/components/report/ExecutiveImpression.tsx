export default function ExecutiveImpression({
  impressionText
}: {
  impressionText: string;
}) {
  return (
    <section className="executive-impression">
      <h3 className="section-title">EXECUTIVE IMPRESSION</h3>
      <blockquote className="impression-quote">
        {impressionText}
      </blockquote>
    </section>
  );
}
