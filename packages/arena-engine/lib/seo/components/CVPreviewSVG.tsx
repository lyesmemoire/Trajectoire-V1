import { CVTemplate } from "@/lib/seo/data/templates";

interface CVPreviewSVGProps {
  template: CVTemplate;
  className?: string;
}

const STYLE_COLORS: Record<
  string,
  { primary: string; text: string; bg: string; accent: string }
> = {
  "modern-red": {
    primary: "#dc2626",
    text: "#111827",
    bg: "#ffffff",
    accent: "#fef2f2",
  },
  "executive-navy": {
    primary: "#1e3a5f",
    text: "#1f2937",
    bg: "#ffffff",
    accent: "#f0f4f8",
  },
  "minimal-black": {
    primary: "#111827",
    text: "#374151",
    bg: "#ffffff",
    accent: "#f9fafb",
  },
  "creative-slate": {
    primary: "#475569",
    text: "#1e293b",
    bg: "#f8fafc",
    accent: "#e2e8f0",
  },
};

export default function CVPreviewSVG({
  template,
  className,
}: CVPreviewSVGProps) {
  const colors = (STYLE_COLORS[template.id] || STYLE_COLORS["modern-red"]) as Colors;
  if (template.style === "minimal")
    return <MinimalPreview colors={colors} className={className} />;
  if (template.style === "executive")
    return <ExecutivePreview colors={colors} className={className} />;
  if (template.style === "creative")
    return <CreativePreview colors={colors} className={className} />;
  return <ModernPreview colors={colors} className={className} />;
}

type Colors = { primary: string; text: string; bg: string; accent: string };

function ModernPreview({
  colors,
  className,
}: {
  colors: Colors;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 566"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Aperçu template Modern Pro"
    >
      <rect width="400" height="566" fill={colors.bg} />
      <rect width="400" height="120" fill={colors.primary} />
      <circle cx="60" cy="60" r="35" fill="rgba(255,255,255,0.2)" />
      <circle cx="60" cy="50" r="14" fill="rgba(255,255,255,0.3)" />
      <ellipse cx="60" cy="80" rx="22" ry="14" fill="rgba(255,255,255,0.3)" />
      <rect
        x="110"
        y="30"
        width="180"
        height="14"
        rx="3"
        fill="rgba(255,255,255,0.9)"
      />
      <rect
        x="110"
        y="52"
        width="120"
        height="10"
        rx="3"
        fill="rgba(255,255,255,0.6)"
      />
      <rect
        x="110"
        y="70"
        width="100"
        height="8"
        rx="3"
        fill="rgba(255,255,255,0.4)"
      />
      <rect
        x="110"
        y="85"
        width="150"
        height="8"
        rx="3"
        fill="rgba(255,255,255,0.4)"
      />
      <rect
        x="310"
        y="20"
        width="70"
        height="70"
        rx="12"
        fill="rgba(255,255,255,0.15)"
      />
      <text
        x="345"
        y="58"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
      >
        94
      </text>
      <text
        x="345"
        y="76"
        textAnchor="middle"
        fill="rgba(255,255,255,0.7)"
        fontSize="9"
      >
        ATS
      </text>
      <rect
        x="20"
        y="140"
        width="100"
        height="10"
        rx="3"
        fill={colors.primary}
        opacity={0.8}
      />
      <rect
        x="20"
        y="158"
        width="360"
        height="7"
        rx="2"
        fill={colors.text}
        opacity={0.15}
      />
      <rect
        x="20"
        y="171"
        width="300"
        height="7"
        rx="2"
        fill={colors.text}
        opacity={0.1}
      />
      <rect
        x="20"
        y="184"
        width="330"
        height="7"
        rx="2"
        fill={colors.text}
        opacity={0.1}
      />
      <line
        x1="20"
        y1="205"
        x2="380"
        y2="205"
        stroke={colors.accent}
        strokeWidth="1.5"
      />
      <rect
        x="20"
        y="218"
        width="110"
        height="10"
        rx="3"
        fill={colors.primary}
        opacity={0.8}
      />
      {[240, 280, 320].map((y, i) => (
        <g key={y}>
          <circle
            cx="30"
            cy={y + 6}
            r="4"
            fill={colors.primary}
            opacity={0.6}
          />
          <rect
            x="44"
            y={y}
            width="120"
            height="8"
            rx="2"
            fill={colors.text}
            opacity={0.2}
          />
          <rect
            x="44"
            y={y + 14}
            width="200"
            height="6"
            rx="2"
            fill={colors.text}
            opacity={0.1}
          />
          <rect
            x="44"
            y={y + 24}
            width="160"
            height="6"
            rx="2"
            fill={colors.text}
            opacity={0.1}
          />
          <rect
            x="310"
            y={y + 2}
            width="70"
            height="8"
            rx="2"
            fill={colors.accent}
            opacity={0.8}
          />
        </g>
      ))}
      <rect
        x="20"
        y="380"
        width="70"
        height="10"
        rx="3"
        fill={colors.primary}
        opacity={0.8}
      />
      {[400, 418, 436].map((y, i) => (
        <g key={y}>
          <rect
            x="20"
            y={y}
            width="360"
            height="8"
            rx="4"
            fill={colors.accent}
          />
          <rect
            x="20"
            y={y}
            width={[280, 220, 300][i]}
            height="8"
            rx="4"
            fill={colors.primary}
            opacity={0.5}
          />
        </g>
      ))}
      {[
        { x: 20, w: 55 },
        { x: 84, w: 70 },
        { x: 163, w: 60 },
        { x: 232, w: 75 },
        { x: 316, w: 50 },
      ].map((pill, i) => (
        <g key={i}>
          <rect
            x={pill.x}
            y={468}
            width={pill.w}
            height="22"
            rx="11"
            fill={colors.accent}
            stroke={colors.primary}
            strokeWidth="1"
            strokeOpacity={0.3}
          />
          <rect
            x={pill.x + 10}
            y={479}
            width={pill.w - 20}
            height="5"
            rx="2"
            fill={colors.primary}
            opacity={0.3}
          />
        </g>
      ))}
      <rect
        x="130"
        y="540"
        width="140"
        height="6"
        rx="3"
        fill={colors.primary}
        opacity={0.1}
      />
    </svg>
  );
}

function ExecutivePreview({
  colors,
  className,
}: {
  colors: Colors;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 566"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Aperçu template Executive"
    >
      <rect width="400" height="566" fill={colors.bg} />
      <rect width="400" height="8" fill={colors.primary} />
      <rect
        x="20"
        y="28"
        width="220"
        height="18"
        rx="3"
        fill={colors.primary}
        opacity={0.9}
      />
      <rect
        x="20"
        y="54"
        width="150"
        height="11"
        rx="3"
        fill={colors.text}
        opacity={0.4}
      />
      <rect
        x="280"
        y="28"
        width="100"
        height="8"
        rx="2"
        fill={colors.text}
        opacity={0.2}
      />
      <rect
        x="280"
        y="42"
        width="100"
        height="8"
        rx="2"
        fill={colors.text}
        opacity={0.15}
      />
      <rect
        x="280"
        y="56"
        width="100"
        height="8"
        rx="2"
        fill={colors.text}
        opacity={0.15}
      />
      <line
        x1="20"
        y1="78"
        x2="380"
        y2="78"
        stroke={colors.primary}
        strokeWidth="2"
      />
      <line
        x1="20"
        y1="82"
        x2="380"
        y2="82"
        stroke={colors.primary}
        strokeWidth="0.5"
      />
      <rect
        x="20"
        y="98"
        width="140"
        height="10"
        rx="3"
        fill={colors.primary}
        opacity={0.8}
      />
      <rect
        x="20"
        y="116"
        width="360"
        height="7"
        rx="2"
        fill={colors.text}
        opacity={0.12}
      />
      <rect
        x="20"
        y="129"
        width="320"
        height="7"
        rx="2"
        fill={colors.text}
        opacity={0.1}
      />
      <rect
        x="20"
        y="142"
        width="280"
        height="7"
        rx="2"
        fill={colors.text}
        opacity={0.1}
      />
      <line
        x1="195"
        y1="165"
        x2="195"
        y2="530"
        stroke={colors.accent}
        strokeWidth="1.5"
      />
      <rect
        x="20"
        y="170"
        width="100"
        height="10"
        rx="3"
        fill={colors.primary}
        opacity={0.8}
      />
      {[190, 235, 280, 325].map((y) => (
        <g key={y}>
          <rect
            x="20"
            y={y}
            width="120"
            height="7"
            rx="2"
            fill={colors.text}
            opacity={0.18}
          />
          <rect
            x="20"
            y={y + 13}
            width="160"
            height="5"
            rx="2"
            fill={colors.text}
            opacity={0.1}
          />
          <rect
            x="20"
            y={y + 23}
            width="140"
            height="5"
            rx="2"
            fill={colors.text}
            opacity={0.1}
          />
        </g>
      ))}
      <rect
        x="210"
        y="170"
        width="80"
        height="10"
        rx="3"
        fill={colors.primary}
        opacity={0.8}
      />
      {[190, 218, 246, 274, 302, 330].map((y, i) => (
        <g key={y}>
          <rect
            x="210"
            y={y}
            width="170"
            height="20"
            rx="3"
            fill={i % 2 === 0 ? colors.accent : "transparent"}
            opacity={0.5}
          />
          <rect
            x="220"
            y={y + 7}
            width={[140, 110, 130, 100, 120, 90][i]}
            height="6"
            rx="2"
            fill={colors.text}
            opacity={0.15}
          />
        </g>
      ))}
      <rect
        x="20"
        y="490"
        width="360"
        height="40"
        rx="8"
        fill={colors.accent}
      />
      <rect
        x="30"
        y="502"
        width="60"
        height="16"
        rx="4"
        fill={colors.primary}
        opacity={0.8}
      />
      <rect
        x="100"
        y="506"
        width="100"
        height="8"
        rx="2"
        fill={colors.text}
        opacity={0.2}
      />
      <text
        x="370"
        y="515"
        textAnchor="end"
        fill={colors.primary}
        fontSize="18"
        fontWeight="bold"
        opacity={0.8}
      >
        97
      </text>
    </svg>
  );
}

function MinimalPreview({
  colors,
  className,
}: {
  colors: Colors;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 566"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Aperçu template Minimal"
    >
      <rect width="400" height="566" fill={colors.bg} />
      <rect
        x="40"
        y="40"
        width="200"
        height="18"
        rx="2"
        fill={colors.text}
        opacity={0.85}
      />
      <rect
        x="40"
        y="66"
        width="130"
        height="10"
        rx="2"
        fill={colors.text}
        opacity={0.35}
      />
      <line
        x1="40"
        y1="88"
        x2="360"
        y2="88"
        stroke={colors.text}
        strokeWidth="0.75"
        opacity={0.2}
      />
      <rect
        x="40"
        y="96"
        width="60"
        height="7"
        rx="2"
        fill={colors.text}
        opacity={0.15}
      />
      <rect
        x="115"
        y="96"
        width="80"
        height="7"
        rx="2"
        fill={colors.text}
        opacity={0.15}
      />
      <rect
        x="210"
        y="96"
        width="90"
        height="7"
        rx="2"
        fill={colors.text}
        opacity={0.15}
      />
      {[
        { label: "EXPERIENCE", y: 120, lines: [140, 185, 230] },
        { label: "FORMATION", y: 270, lines: [290] },
        { label: "COMPÉTENCES", y: 330, lines: [350] },
      ].map((section) => (
        <g key={section.label}>
          <text
            x="40"
            y={section.y + 10}
            fill={colors.text}
            fontSize="9"
            fontWeight="700"
            opacity={0.5}
            letterSpacing="2"
          >
            {section.label}
          </text>
          <line
            x1="40"
            y1={section.y + 16}
            x2="360"
            y2={section.y + 16}
            stroke={colors.text}
            strokeWidth="0.5"
            opacity={0.15}
          />
          {section.lines.map((ly) => (
            <g key={ly}>
              <rect
                x="40"
                y={ly}
                width="160"
                height="8"
                rx="2"
                fill={colors.text}
                opacity={0.2}
              />
              <rect
                x="280"
                y={ly}
                width="80"
                height="8"
                rx="2"
                fill={colors.text}
                opacity={0.1}
              />
              <rect
                x="40"
                y={ly + 14}
                width="300"
                height="6"
                rx="2"
                fill={colors.text}
                opacity={0.1}
              />
              <rect
                x="40"
                y={ly + 26}
                width="260"
                height="6"
                rx="2"
                fill={colors.text}
                opacity={0.08}
              />
            </g>
          ))}
        </g>
      ))}
      {[40, 110, 175, 240].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={390}
            width={[55, 50, 52, 48][i]}
            height="16"
            rx="2"
            fill={colors.text}
            opacity={0.08}
          />
          <rect
            x={x + 8}
            y={397}
            width={[38, 33, 35, 30][i]}
            height="4"
            rx="1"
            fill={colors.text}
            opacity={0.2}
          />
        </g>
      ))}
      <text
        x="360"
        y="540"
        textAnchor="end"
        fill={colors.text}
        fontSize="9"
        opacity={0.3}
      >
        ATS 99/100
      </text>
    </svg>
  );
}

function CreativePreview({
  colors,
  className,
}: {
  colors: Colors;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 566"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Aperçu template Creative"
    >
      <rect width="400" height="566" fill={colors.bg} />
      <rect width="130" height="566" fill={colors.primary} opacity={0.08} />
      <rect width="4" height="566" fill={colors.primary} opacity={0.6} />
      <circle cx="65" cy="70" r="42" fill={colors.primary} opacity={0.15} />
      <circle cx="65" cy="58" r="18" fill={colors.primary} opacity={0.2} />
      <ellipse
        cx="65"
        cy="100"
        rx="28"
        ry="16"
        fill={colors.primary}
        opacity={0.2}
      />
      <rect
        x="15"
        y="130"
        width="100"
        height="8"
        rx="2"
        fill={colors.primary}
        opacity={0.4}
      />
      {[150, 165, 180, 195].map((y) => (
        <rect
          key={y}
          x="15"
          y={y}
          width="100"
          height="6"
          rx="2"
          fill={colors.primary}
          opacity={0.2}
        />
      ))}
      <rect
        x="15"
        y="220"
        width="80"
        height="8"
        rx="2"
        fill={colors.primary}
        opacity={0.6}
      />
      {[240, 260, 280, 300, 320].map((y, i) => (
        <g key={y}>
          <circle
            cx="22"
            cy={y + 5}
            r="3"
            fill={colors.primary}
            opacity={0.4}
          />
          <rect
            x="32"
            y={y}
            width={[70, 55, 65, 50, 60][i]}
            height="6"
            rx="2"
            fill={colors.primary}
            opacity={0.25}
          />
        </g>
      ))}
      <rect
        x="150"
        y="24"
        width="200"
        height="16"
        rx="2"
        fill={colors.text}
        opacity={0.8}
      />
      <rect
        x="150"
        y="48"
        width="140"
        height="10"
        rx="2"
        fill={colors.primary}
        opacity={0.5}
      />
      <rect
        x="150"
        y="80"
        width="90"
        height="8"
        rx="2"
        fill={colors.primary}
        opacity={0.7}
      />
      <rect
        x="150"
        y="96"
        width="230"
        height="6"
        rx="2"
        fill={colors.text}
        opacity={0.12}
      />
      <rect
        x="150"
        y="108"
        width="200"
        height="6"
        rx="2"
        fill={colors.text}
        opacity={0.1}
      />
      <rect
        x="150"
        y="120"
        width="215"
        height="6"
        rx="2"
        fill={colors.text}
        opacity={0.1}
      />
      <rect
        x="150"
        y="148"
        width="80"
        height="8"
        rx="2"
        fill={colors.primary}
        opacity={0.7}
      />
      {[165, 210, 255].map((y, i) => (
        <g key={y}>
          <rect
            x="150"
            y={y}
            width="230"
            height="35"
            rx="6"
            fill={colors.text}
            opacity={0.04}
          />
          <rect
            x="158"
            y={y + 8}
            width="130"
            height="7"
            rx="2"
            fill={colors.text}
            opacity={0.2}
          />
          <rect
            x="158"
            y={y + 22}
            width="180"
            height="5"
            rx="2"
            fill={colors.text}
            opacity={0.1}
          />
          <rect
            x="330"
            y={y + 6}
            width="40"
            height="20"
            rx="4"
            fill={colors.primary}
            opacity={[0.3, 0.2, 0.25][i]}
          />
        </g>
      ))}
      <rect
        x="150"
        y="480"
        width="230"
        height="50"
        rx="10"
        fill={colors.primary}
        opacity={0.08}
      />
      <rect
        x="162"
        y="494"
        width="50"
        height="22"
        rx="5"
        fill={colors.primary}
        opacity={0.3}
      />
      <text
        x="187"
        y="510"
        textAnchor="middle"
        fill={colors.primary}
        fontSize="12"
        fontWeight="bold"
        opacity={0.7}
      >
        88
      </text>
      <rect
        x="224"
        y="500"
        width="80"
        height="6"
        rx="2"
        fill={colors.text}
        opacity={0.15}
      />
      <rect
        x="224"
        y="514"
        width="60"
        height="5"
        rx="2"
        fill={colors.text}
        opacity={0.1}
      />
    </svg>
  );
}
