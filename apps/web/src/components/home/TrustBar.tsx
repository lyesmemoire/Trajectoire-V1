"use client";

const COMPANIES = [
  "LVMH",
  "BCG",
  "McKinsey",
  "L'Oréal",
  "BNP Paribas",
  "Total Energies",
  "Capgemini",
  "Saint-Gobain",
];

export default function TrustBar() {
  return (
    <section
      className="relative py-16 border-y"
      style={{
        backgroundColor: "#F7F8F9",
        borderColor: "#E2E8E4",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
        <div className="flex flex-col items-center gap-10">
          <p
            className="text-center font-medium tracking-wider uppercase"
            style={{
              fontSize: "13px",
              color: "#4A4A4A",
              letterSpacing: "0.15em",
            }}
          >
            Nos utilisateurs viennent des plus grandes entreprises
          </p>

          <div className="w-full overflow-hidden">
            <div
              className="flex items-center justify-around gap-12 flex-wrap"
              style={{ opacity: 0.65 }}
            >
              {COMPANIES.map((company) => (
                <div
                  key={company}
                  className="font-bold tracking-tight transition-all duration-300 hover:scale-105"
                  style={{
                    fontSize: "22px",
                    color: "#1A3C34",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
