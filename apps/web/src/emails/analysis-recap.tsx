import { Html, Head, Body, Container, Text, Link, Section } from "@react-email/components"

interface AnalysisRecapEmailProps {
  userName: string
  score: number
  percentile: number
  topStrength: string
  gapToOptimal: number
  dashboardLink: string
}

const getCultInsight = (score: number, topStrength: string): string => {
  if (score >= 80) {
    return `Votre ${topStrength.toLowerCase()} est votre atout majeur. C'est précisément ce que les recruteurs recherchent en priorité.`
  }
  if (score >= 65) {
    return `Vous avez une ${topStrength.toLowerCase()} solide. C'est un excellent point de départ pour vous différencier.`
  }
  return `Votre profil a du potentiel. Les recruteurs perçoivent clairement votre valeur ajoutée.`
}

export function AnalysisRecapEmail({ 
  userName, score, percentile, topStrength, gapToOptimal, dashboardLink 
}: AnalysisRecapEmailProps) {
  const cultInsight = getCultInsight(score, topStrength)

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>Trajectoire</Text>
          </Section>

          {/* Score reveal */}
          <Section style={content}>
            <Text style={greeting}>Bonjour {userName},</Text>
            
            <Text style={paragraph}>
              Votre analyse est prête.
            </Text>

            {/* Score card */}
            <Section style={scoreCard}>
              <Text style={scoreLabel}>Score actuel</Text>
              <Text style={scoreValue}>{score}/100</Text>
              <Text style={percentileText}>
                Vous performez mieux que {percentile}% des candidats.
              </Text>
            </Section>

            {/* Insight signature */}
            <Section style={insightSection}>
              <Text style={insightIcon}>★</Text>
              <Text style={insightText}>
                {cultInsight}
              </Text>
            </Section>

            {/* Gap */}
            {gapToOptimal > 0 && (
              <Section style={gapSection}>
                <Text style={gapText}>
                  Il vous manque {gapToOptimal} points pour atteindre le seuil recommandé.
                </Text>
              </Section>
            )}

            <Link href={dashboardLink} style={button}>
              Voir l'analyse complète
            </Link>

            <Section style={divider} />

            <Text style={nextStepTitle}>Prochaine étape</Text>
            <Text style={nextStepText}>
              Atteindre 80/100 pour rejoindre le top 20% des candidats.
            </Text>

            <Section style={divider} />

            <Text style={footer}>
              À tout moment,{" "}
              <Link href="mailto:anislamine1980@gmail.com" style={footerLink}>
                contactez-nous
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#0a0a0b",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
}

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px",
}

const header = {
  padding: "20px 0",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
}

const logo = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#ffffff",
  letterSpacing: "-0.02em",
}

const content = {
  padding: "40px 0",
}

const greeting = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#ffffff",
  marginBottom: "16px",
  letterSpacing: "-0.02em",
}

const paragraph = {
  fontSize: "16px",
  color: "#94a3b8",
  lineHeight: "1.6",
  marginBottom: "24px",
}

const scoreCard = {
  backgroundColor: "rgba(99,102,241,0.1)",
  border: "1px solid rgba(99,102,241,0.2)",
  borderRadius: "16px",
  padding: "32px",
  textAlign: "center" as const,
  marginBottom: "24px",
}

const scoreLabel = {
  fontSize: "14px",
  color: "#94a3b8",
  marginBottom: "8px",
}

const scoreValue = {
  fontSize: "48px",
  fontWeight: "600",
  color: "#ffffff",
  marginBottom: "8px",
  letterSpacing: "-0.02em",
}

const percentileText = {
  fontSize: "14px",
  color: "#94a3b8",
}

const insightSection = {
  backgroundColor: "rgba(99,102,241,0.05)",
  border: "1px solid rgba(99,102,241,0.15)",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "24px",
  position: "relative" as const,
}

const insightIcon = {
  fontSize: "20px",
  color: "#6366f1",
  marginBottom: "12px",
}

const insightText = {
  fontSize: "16px",
  color: "#ffffff",
  lineHeight: "1.6",
}

const gapSection = {
  marginBottom: "24px",
}

const gapText = {
  fontSize: "14px",
  color: "#f59e0b",
  lineHeight: "1.6",
}

const button = {
  display: "inline-block",
  backgroundColor: "#6366f1",
  color: "#ffffff",
  padding: "14px 28px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "16px",
  boxShadow: "0 0 30px rgba(99,102,241,0.25)",
  marginBottom: "32px",
}

const divider = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  margin: "32px 0",
}

const nextStepTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#ffffff",
  marginBottom: "8px",
  letterSpacing: "-0.02em",
}

const nextStepText = {
  fontSize: "14px",
  color: "#94a3b8",
  lineHeight: "1.6",
}

const footer = {
  fontSize: "14px",
  color: "#64748b",
  lineHeight: "1.6",
}

const footerLink = {
  color: "#6366f1",
  textDecoration: "underline",
}
