// app/opengraph-image.tsx
import { ImageResponse } from "next/og";
import {
  OG_COLORS,
  OG_DIMENSIONS,
  BACKGROUND_GRADIENT,
} from "@/lib/seo/generators/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = OG_DIMENSIONS;

export default async function HomepageOGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...BACKGROUND_GRADIENT,
        fontFamily: "system-ui, -apple-system, sans-serif",
        gap: "32px",
        position: "relative",
      }}
    >
      {/* Grille décorative */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(220,38,38,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ligne décorative (top) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${OG_COLORS.primaryDark}, ${OG_COLORS.primary}, ${OG_COLORS.primaryLight}, transparent)`,
        }}
      />

      {/* Logo */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "20px",
          background: OG_COLORS.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          boxShadow: "0 0 60px rgba(220,38,38,0.5)",
        }}
      >
        🚀
      </div>

      {/* Titre */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <h1
          style={{
            fontSize: "72px",
            fontWeight: "900",
            color: "white",
            letterSpacing: "-3px",
            margin: 0,
            textAlign: "center",
          }}
        >
          AI Career Copilot
        </h1>
        <p
          style={{
            fontSize: "28px",
            color: OG_COLORS.textSecondary,
            margin: 0,
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: "1.4",
          }}
        >
          Passez les filtres ATS et décrochez l'entretien de vos rêves
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: "48px",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${OG_COLORS.border}`,
          borderRadius: "16px",
          padding: "24px 48px",
        }}
      >
        {[
          { value: "2 847", label: "CV optimisés" },
          { value: "4.8/5", label: "Note moyenne" },
          { value: "+127%", label: "Taux de succès" },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                fontSize: "32px",
                fontWeight: "900",
                color: OG_COLORS.primary,
              }}
            >
              {stat.value}
            </span>
            <span style={{ fontSize: "16px", color: OG_COLORS.textMuted }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* URL */}
      <span
        style={{
          position: "absolute",
          bottom: "32px",
          fontSize: "18px",
          color: OG_COLORS.textMuted,
          fontWeight: "500",
        }}
      >
        aicareercopilot.com
      </span>
    </div>,
    {
      ...OG_DIMENSIONS,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    },
  );
}
