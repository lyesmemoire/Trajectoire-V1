import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { CVData, ExportOptions } from "../types";

// Enregistrement des polices
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff",
      fontWeight: 500,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff",
      fontWeight: 700,
    },
  ],
});

const COLOR_PALETTES = {
  blue: {
    primary: "#2563EB",
    secondary: "#EFF6FF",
    accent: "#1D4ED8",
    light: "#BFDBFE",
    dark: "#1E3A8A",
    text: "#1E40AF",
  },
  green: {
    primary: "#16A34A",
    secondary: "#F0FDF4",
    accent: "#15803D",
    light: "#BBF7D0",
    dark: "#14532D",
    text: "#166534",
  },
  purple: {
    primary: "#7C3AED",
    secondary: "#F5F3FF",
    accent: "#6D28D9",
    light: "#DDD6FE",
    dark: "#4C1D95",
    text: "#5B21B6",
  },
  dark: {
    primary: "#0F172A",
    secondary: "#F1F5F9",
    accent: "#1E293B",
    light: "#CBD5E1",
    dark: "#020617",
    text: "#334155",
  },
} as const;

const createStyles = (colorScheme: ExportOptions["colorScheme"]) => {
  const c = COLOR_PALETTES[colorScheme] || COLOR_PALETTES.blue;

  return StyleSheet.create({
    page: {
      fontFamily: "Inter",
      backgroundColor: "#FFFFFF",
      paddingBottom: 30,
    },
    header: {
      backgroundColor: c.primary,
      paddingHorizontal: 40,
      paddingTop: 32,
      paddingBottom: 28,
    },
    headerTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    headerLeft: {
      flex: 1,
    },
    headerName: {
      fontSize: 26,
      fontWeight: 700,
      color: "#FFFFFF",
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    headerTitle: {
      fontSize: 12,
      fontWeight: 500,
      color: "rgba(255,255,255,0.80)",
    },
    headerDivider: {
      width: 40,
      height: 2,
      backgroundColor: "rgba(255,255,255,0.40)",
      marginTop: 10,
      marginBottom: 14,
    },
    headerContactGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    headerContactItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 16,
      marginBottom: 4,
    },
    headerContactIcon: {
      fontSize: 9,
      color: "rgba(255,255,255,0.70)",
      marginRight: 4,
    },
    headerContactText: {
      fontSize: 8.5,
      color: "rgba(255,255,255,0.88)",
    },
    headerBadge: {
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    headerBadgeText: {
      fontSize: 8,
      color: "#FFFFFF",
      fontWeight: 600,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    body: {
      flexDirection: "row",
    },
    mainColumn: {
      flex: 2,
      paddingLeft: 40,
      paddingRight: 16,
      paddingTop: 22,
    },
    sideColumn: {
      flex: 1,
      backgroundColor: c.secondary,
      paddingLeft: 16,
      paddingRight: 40,
      paddingTop: 22,
      paddingBottom: 20,
      borderLeftWidth: 2,
      borderLeftColor: c.light,
    },
    section: {
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    sectionAccentBar: {
      width: 3,
      height: 14,
      backgroundColor: c.primary,
      borderRadius: 2,
      marginRight: 8,
    },
    sectionTitle: {
      fontSize: 10.5,
      fontWeight: 700,
      color: c.primary,
      textTransform: "uppercase",
      letterSpacing: 1.4,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: c.light,
      marginBottom: 10,
      marginTop: -6,
    },
    summaryBox: {
      backgroundColor: c.secondary,
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderLeftWidth: 3,
      borderLeftColor: c.primary,
    },
    summaryText: {
      fontSize: 9.5,
      lineHeight: 1.65,
      color: "#374151",
    },
    expItem: {
      marginBottom: 14,
      paddingBottom: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: "#E5E7EB",
    },
    expItemLast: {
      marginBottom: 0,
      paddingBottom: 0,
      borderBottomWidth: 0,
    },
    expHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 2,
    },
    expTitle: {
      fontSize: 10.5,
      fontWeight: 700,
      color: "#111827",
      flex: 1,
      marginRight: 8,
    },
    expPeriodBadge: {
      backgroundColor: c.secondary,
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderWidth: 0.5,
      borderColor: c.light,
    },
    expPeriodText: {
      fontSize: 8,
      color: c.text,
      fontWeight: 600,
    },
    expCompanyRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    expCompanyDot: {
      width: 4,
      height: 4,
      backgroundColor: c.primary,
      borderRadius: 2,
      marginRight: 5,
    },
    expCompany: {
      fontSize: 9.5,
      color: c.accent,
      fontWeight: 600,
    },
    expLocation: {
      fontSize: 8.5,
      color: "#9CA3AF",
      marginLeft: 5,
    },
    expBullet: {
      flexDirection: "row",
      marginBottom: 4,
      paddingLeft: 2,
    },
    expBulletArrow: {
      fontSize: 9,
      color: c.primary,
      marginRight: 6,
      marginTop: 1.5,
      fontWeight: 700,
    },
    expBulletText: {
      fontSize: 9,
      color: "#4B5563",
      lineHeight: 1.55,
      flex: 1,
    },
    eduItem: {
      marginBottom: 11,
      flexDirection: "row",
      gap: 10,
    },
    eduAccent: {
      width: 2,
      backgroundColor: c.light,
      borderRadius: 2,
    },
    eduContent: {
      flex: 1,
    },
    eduDegree: {
      fontSize: 10,
      fontWeight: 700,
      color: "#111827",
      marginBottom: 2,
    },
    eduSchool: {
      fontSize: 9,
      color: "#6B7280",
    },
    eduMeta: {
      flexDirection: "row",
      gap: 8,
      marginTop: 3,
    },
    eduYear: {
      fontSize: 8,
      color: "#FFFFFF",
      backgroundColor: c.primary,
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      borderRadius: 3,
      fontWeight: 600,
    },
    eduMention: {
      fontSize: 8,
      color: c.text,
      backgroundColor: c.secondary,
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      borderRadius: 3,
      fontWeight: 600,
    },
    sideSection: {
      marginBottom: 18,
    },
    sideSectionTitle: {
      fontSize: 9.5,
      fontWeight: 700,
      color: c.text,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      marginBottom: 8,
      paddingBottom: 4,
      borderBottomWidth: 1.5,
      borderBottomColor: c.light,
    },
    skillGroupLabel: {
      fontSize: 8,
      fontWeight: 600,
      color: "#9CA3AF",
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 4,
      marginTop: 6,
    },
    skillPillsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
    skillPill: {
      backgroundColor: "#FFFFFF",
      borderRadius: 4,
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderWidth: 1,
      borderColor: c.light,
    },
    skillPillText: {
      fontSize: 8.5,
      color: c.text,
      fontWeight: 600,
    },
    langItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    langName: {
      fontSize: 9,
      color: "#374151",
      fontWeight: 600,
    },
    langLevel: {
      fontSize: 8,
      color: c.text,
      fontWeight: 500,
    },
    langBar: {
      height: 3,
      backgroundColor: c.light,
      borderRadius: 2,
      marginTop: 3,
      marginBottom: 6,
    },
    langBarFill: {
      height: 3,
      backgroundColor: c.primary,
      borderRadius: 2,
    },
    certItem: {
      marginBottom: 8,
      paddingLeft: 8,
      borderLeftWidth: 2,
      borderLeftColor: c.light,
    },
    certName: {
      fontSize: 9,
      fontWeight: 600,
      color: "#1F2937",
    },
    certIssuer: {
      fontSize: 8,
      color: "#6B7280",
      marginTop: 1,
    },
    certYear: {
      fontSize: 7.5,
      color: c.text,
      backgroundColor: c.secondary,
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 2,
      marginTop: 2,
      alignSelf: "flex-start",
    },
    footer: {
      position: "absolute",
      bottom: 10,
      left: 40,
      right: 40,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    footerText: {
      fontSize: 7,
      color: "#D1D5DB",
    },
    footerBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: c.secondary,
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    footerBadgeText: {
      fontSize: 7,
      color: c.text,
      fontWeight: 600,
    },
  });
};

const LANG_LEVELS: Record<string, number> = {
  natif: 1.0,
  bilingue: 1.0,
  courant: 0.85,
  avancé: 0.75,
  intermédiaire: 0.55,
  débutant: 0.3,
  notions: 0.2,
  a1: 0.15,
  a2: 0.25,
  b1: 0.45,
  b2: 0.65,
  c1: 0.8,
  c2: 0.95,
};

function getLangBarWidth(langEntry: string): number {
  const lower = langEntry.toLowerCase();
  for (const [key, val] of Object.entries(LANG_LEVELS)) {
    if (lower.includes(key)) return val;
  }
  return 0.6;
}

function parseLangEntry(entry: string): { name: string; level: string } {
  const dashMatch = entry.match(/^(.+?)\s*[—–-]\s*(.+)$/);
  const parenMatch = entry.match(/^(.+?)\s*\((.+?)\)$/);

  if (dashMatch)
    return { name: (dashMatch[1] ?? "").trim(), level: (dashMatch[2] ?? "").trim() };
  if (parenMatch)
    return { name: (parenMatch[1] ?? "").trim(), level: (parenMatch[2] ?? "").trim() };
  return { name: entry, level: "" };
}

export interface ModernTemplateProps {
  data: CVData;
  options: ExportOptions;
}

export const ModernTemplate = ({ data, options }: ModernTemplateProps) => {
  const styles = createStyles(options.colorScheme);
  const c = COLOR_PALETTES[options.colorScheme] || COLOR_PALETTES.blue;

  const hasExperience = data.experience.length > 0;
  const hasEducation = data.education.length > 0;
  const hasTechSkills = data.skills.technical.length > 0;
  const hasSoftSkills = data.skills.soft.length > 0;
  const hasLanguages = data.skills.languages.length > 0;
  const hasCertifications = (data.certifications ?? []).length > 0;

  return (
    <Document
      title={`CV — ${data.personalInfo.name}`}
      author={data.personalInfo.name}
      subject="Curriculum Vitae"
      keywords="CV, ATS-Ready, StudioEntretien"
      creator="StudioEntretien.fr"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerName}>{data.personalInfo.name}</Text>
              {data.experience[0]?.title && (
                <Text style={styles.headerTitle}>
                  {data.experience[0].title}
                </Text>
              )}
            </View>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>ATS-Ready</Text>
            </View>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerContactGrid}>
            {data.personalInfo.email && (
              <View style={styles.headerContactItem}>
                <Text style={styles.headerContactText}>
                  ✉ {data.personalInfo.email}
                </Text>
              </View>
            )}
            {data.personalInfo.phone && (
              <View style={styles.headerContactItem}>
                <Text style={styles.headerContactText}>
                  ☎ {data.personalInfo.phone}
                </Text>
              </View>
            )}
            {data.personalInfo.location && (
              <View style={styles.headerContactItem}>
                <Text style={styles.headerContactText}>
                  ⌖ {data.personalInfo.location}
                </Text>
              </View>
            )}
            {data.personalInfo.linkedin && (
              <View style={styles.headerContactItem}>
                <Text style={styles.headerContactText}>
                  in {data.personalInfo.linkedin}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.mainColumn}>
            {data.summary && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionAccentBar} />
                  <Text style={styles.sectionTitle}>Profil Professionnel</Text>
                </View>
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryText}>{data.summary}</Text>
                </View>
              </View>
            )}

            {hasExperience && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionAccentBar} />
                  <Text style={styles.sectionTitle}>
                    Expériences Professionnelles
                  </Text>
                </View>
                <View style={styles.sectionDivider} />
                {data.experience.map((exp: unknown, i: number) => (
                  <View
                    key={i}
                    style={
                      i === data.experience.length - 1
                        ? styles.expItemLast
                        : styles.expItem
                    }
                  >
                    <View style={styles.expHeader}>
                      <Text style={styles.expTitle}>{exp.title}</Text>
                      <View style={styles.expPeriodBadge}>
                        <Text style={styles.expPeriodText}>{exp.period}</Text>
                      </View>
                    </View>
                    <View style={styles.expCompanyRow}>
                      <View style={styles.expCompanyDot} />
                      <Text style={styles.expCompany}>{exp.company}</Text>
                      {exp.location && (
                        <Text style={styles.expLocation}>· {exp.location}</Text>
                      )}
                    </View>
                    {exp.achievements.map((achievement: unknown, j: number) => (
                      <View key={j} style={styles.expBullet}>
                        <Text style={styles.expBulletArrow}>▸</Text>
                        <Text style={styles.expBulletText}>{achievement}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {hasEducation && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionAccentBar} />
                  <Text style={styles.sectionTitle}>Formation</Text>
                </View>
                <View style={styles.sectionDivider} />
                {data.education.map((edu: unknown, i: number) => (
                  <View key={i} style={styles.eduItem}>
                    <View style={styles.eduAccent} />
                    <View style={styles.eduContent}>
                      <Text style={styles.eduDegree}>{edu.degree}</Text>
                      <Text style={styles.eduSchool}>{edu.school}</Text>
                      <View style={styles.eduMeta}>
                        <Text style={styles.eduYear}>{edu.year}</Text>
                        {edu.mention && (
                          <Text style={styles.eduMention}>{edu.mention}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.sideColumn}>
            {hasTechSkills && (
              <View style={styles.sideSection}>
                <Text style={styles.sideSectionTitle}>Compétences</Text>
                <Text style={styles.skillGroupLabel}>Techniques</Text>
                <View style={styles.skillPillsRow}>
                  {data.skills.technical.map((skill: unknown, i: number) => (
                    <View key={i} style={styles.skillPill}>
                      <Text style={styles.skillPillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
                {hasSoftSkills && (
                  <>
                    <Text style={styles.skillGroupLabel}>Savoir-être</Text>
                    <View style={styles.skillPillsRow}>
                      {data.skills.soft.map((skill: unknown, i: number) => (
                        <View
                          key={i}
                          style={{
                            ...(styles.skillPill as unknown),
                            backgroundColor: c.secondary,
                            borderColor: "transparent",
                          }}
                        >
                          <Text style={styles.skillPillText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
            )}

            {hasLanguages && (
              <View style={styles.sideSection}>
                <Text style={styles.sideSectionTitle}>Langues</Text>
                {data.skills.languages.map((langEntry: unknown, i: number) => {
                  const { name, level } = parseLangEntry(langEntry);
                  const barWidth = getLangBarWidth(langEntry);
                  return (
                    <View key={i}>
                      <View style={styles.langItem}>
                        <Text style={styles.langName}>{name}</Text>
                        {level && <Text style={styles.langLevel}>{level}</Text>}
                      </View>
                      <View style={styles.langBar}>
                        <View
                          style={[
                            styles.langBarFill,
                            { width: `${barWidth * 100}%` },
                          ]}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {hasCertifications && (
              <View style={styles.sideSection}>
                <Text style={styles.sideSectionTitle}>Certifications</Text>
                {data.certifications!.map((cert: unknown, i: number) => (
                  <View key={i} style={styles.certItem}>
                    <Text style={styles.certName}>{cert.name}</Text>
                    <Text style={styles.certIssuer}>{cert.issuer}</Text>
                    <Text style={styles.certYear}>{cert.year}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {data.personalInfo.name} · {new Date().getFullYear()}
          </Text>
          <View style={styles.footerBadge}>
            <Text style={styles.footerBadgeText}>
              StudioEntretien.fr · Optimisé ATS
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ModernTemplate;
