import { Html, Head, Body, Container, Text, Link, Section } from "react-email"

interface OnboardingEmailProps {
  userName: string
  magicLink: string
}

export function OnboardingEmail({ userName, magicLink }: OnboardingEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>Trajectoire</Text>
          </Section>

          {/* Welcome */}
          <Section style={content}>
            <Text style={greeting}>Bonjour {userName},</Text>
            
            <Text style={paragraph}>
              Bienvenue sur Trajectoire.
            </Text>

            <Text style={paragraph}>
              Votre compte est prêt. Cliquez sur le lien ci-dessous pour accéder à votre dashboard.
            </Text>

            <Link href={magicLink} style={button}>
              Accéder à mon dashboard
            </Link>

            <Text style={smallText}>
              Ce lien expire dans 24 heures.
            </Text>

            <Section style={divider} />

            <Text style={insightTitle}>Votre première analyse</Text>
            <Text style={insight}>
              En 30 secondes, découvrez votre score et recevez des recommandations personnalisées pour optimiser votre CV.
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
  marginBottom: "16px",
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
  marginBottom: "16px",
}

const smallText = {
  fontSize: "12px",
  color: "#64748b",
  marginBottom: "32px",
}

const divider = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  margin: "32px 0",
}

const insightTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#ffffff",
  marginBottom: "12px",
  letterSpacing: "-0.02em",
}

const insight = {
  fontSize: "14px",
  color: "#94a3b8",
  lineHeight: "1.6",
  padding: "16px",
  backgroundColor: "rgba(99,102,241,0.1)",
  border: "1px solid rgba(99,102,241,0.2)",
  borderRadius: "8px",
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
