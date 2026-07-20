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

const PALETTES = {
  blue: {
    accent: "#2563EB",
    muted: "#DBEAFE",
    line: "#E2E8F0",
    dot: "#93C5FD",
  },
  green: {
    accent: "#16A34A",
    muted: "#DCFCE7",
    line: "#E2E8F0",
    dot: "#86EFAC",
  },
  purple: {
    accent: "#7C3AED",
    muted: "#EDE9FE",
    line: "#E2E8F0",
    dot: "#C4B5FD",
  },
  dark: {
    accent: "#1E293B",
    muted: "#F1F5F9",
    line: "#E2E8F0",
    dot: "#94A3B8",
  },
};

const createStyles = (colorScheme: ExportOptions["colorScheme"]) => {
  const c = PALETTES[colorScheme] || PALETTES.blue;
  return StyleSheet.create({
    page: {
      fontFamily: "Inter",
      backgroundColor: "#FFFFFF",
      paddingTop: 40,
      paddingBottom: 40,
      paddingHorizontal: 48,
    },
    header: {
      marginBottom: 24,
    },
    headerName: {
      fontSize: 24,
      fontWeight: 700,
      color: "#0F172A",
      letterSpacing: 0.3,
      marginBottom: 6,
    },
    headerAccentLine: {
      width: 36,
      height: 3,
      backgroundColor: c.accent,
      borderRadius: 2,
      marginBottom: 10,
    },
    headerContact: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    headerContactChip: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 14,
      marginBottom: 3,
    },
    headerContactBullet: {
      width: 3,
      height: 3,
      backgroundColor: c.accent,
      borderRadius: 2,
      marginRight: 5,
    },
    headerContactText: {
      fontSize: 8.5,
      color: "#64748B",
      fontWeight: 500,
    },
    globalSeparator: {
      height: 1,
      backgroundColor: c.line,
      marginBottom: 18,
      marginTop: 2,
    },
    section: {
      marginBottom: 18,
      flexDirection: "row",
      gap: 18,
    },
    sectionLabel: {
      width: 90,
      paddingTop: 1,
    },
    sectionLabelText: {
      fontSize: 8,
      fontWeight: 700,
      color: c.accent,
      textTransform: "uppercase",
      letterSpacing: 1.4,
    },
    sectionContent: {
      flex: 1,
    },
    summaryText: {
      fontSize: 9.5,
      lineHeight: 1.7,
      color: "#475569",
    },
    expItem: {
      marginBottom: 13,
    },
    expHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 2,
    },
    expTitle: {
      fontSize: 10,
      fontWeight: 700,
      color: "#0F172A",
      flex: 1,
      marginRight: 8,
    },
    expPeriod: {
      fontSize: 8.5,
      color: "#94A3B8",
    },
    expCompany: {
      fontSize: 9,
      color: c.accent,
      fontWeight: 600,
      marginBottom: 5,
    },
    expBullet: {
      flexDirection: "row",
      marginBottom: 3,
    },
    expBulletDot: {
      width: 3,
      height: 3,
      backgroundColor: c.dot,
      borderRadius: 2,
      marginRight: 7,
      marginTop: 5,
    },
    expBulletText: {
      fontSize: 9,
      color: "#64748B",
      lineHeight: 1.6,
      flex: 1,
    },
    eduItem: {
      marginBottom: 9,
    },
    eduTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    eduDegree: {
      fontSize: 9.5,
      fontWeight: 700,
      color: "#0F172A",
      flex: 1,
    },
    eduYear: {
      fontSize: 8.5,
      color: "#94A3B8",
    },
    eduSchool: {
      fontSize: 9,
      color: "#64748B",
    },
    eduMention: {
      fontSize: 8.5,
      color: c.accent,
      fontWeight: 600,
    },
    skillsBlock: {
      gap: 8,
    },
    skillRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    skillRowLabel: {
      width: 65,
      fontSize: 8,
      color: "#94A3B8",
      fontWeight: 600,
      textTransform: "uppercase",
    },
    skillList: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    skillChip: {
      backgroundColor: c.muted,
      borderRadius: 3,
      paddingHorizontal: 6,
      paddingVertical: 2.5,
    },
    skillChipText: {
      fontSize: 8,
      color: "#374151",
      fontWeight: 600,
    },
    langInlineRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    langBadge: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: c.line,
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    langBadgeName: {
      fontSize: 9,
      fontWeight: 700,
      color: "#1E293B",
      marginRight: 3,
    },
    langBadgeLevel: {
      fontSize: 8,
      color: "#94A3B8",
    },
    certList: {
      gap: 6,
    },
    certItem: {
      flexDirection: "row",
    },
    certAccentDot: {
      width: 4,
      height: 4,
      backgroundColor: c.accent,
      borderRadius: 2,
      marginRight: 7,
      marginTop: 4,
    },
    certContent: {
      flex: 1,
    },
    certName: {
      fontSize: 9,
      fontWeight: 600,
      color: "#1E293B",
    },
    certMeta: {
      fontSize: 8,
      color: "#94A3B8",
    },
    footer: {
      position: "absolute",
      bottom: 14,
      left: 48,
      right: 48,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    footerText: {
      fontSize: 7,
      color: "#CBD5E1",
    },
  });
};

export const MinimalTemplate = ({
  data,
  options,
}: {
  data: CVData;
  options: ExportOptions;
}) => {
  const styles = createStyles(options.colorScheme);
  const SectionRow = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionLabel}>
        <Text style={styles.sectionLabelText}>{label}</Text>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <Document
      title={`CV — ${data.personalInfo.name}`}
      author={data.personalInfo.name}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerName}>{data.personalInfo.name}</Text>
          <View style={styles.headerAccentLine} />
          <View style={styles.headerContact}>
            {[
              data.personalInfo.email,
              data.personalInfo.phone,
              data.personalInfo.location,
              data.personalInfo.linkedin,
              data.personalInfo.portfolio,
            ]
              .filter(Boolean)
              .map((contact, i) => (
                <View key={i} style={styles.headerContactChip}>
                  <View style={styles.headerContactBullet} />
                  <Text style={styles.headerContactText}>{contact}</Text>
                </View>
              ))}
          </View>
        </View>
        <View style={styles.globalSeparator} />

        {data.summary && (
          <SectionRow label="Profil">
            <Text style={styles.summaryText}>{data.summary}</Text>
          </SectionRow>
        )}

        {data.experience.length > 0 && (
          <SectionRow label="Expérience">
            {data.experience.map((exp, i) => (
              <View key={i} style={styles.expItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.expTitle}>{exp.title}</Text>
                  <Text style={styles.expPeriod}>{exp.period}</Text>
                </View>
                <Text style={styles.expCompany}>
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </Text>
                {exp.achievements.map((a, j) => (
                  <View key={j} style={styles.expBullet}>
                    <View style={styles.expBulletDot} />
                    <Text style={styles.expBulletText}>{a}</Text>
                  </View>
                ))}
              </View>
            ))}
          </SectionRow>
        )}

        {data.education.length > 0 && (
          <SectionRow label="Formation">
            {data.education.map((edu, i) => (
              <View key={i} style={styles.eduItem}>
                <View style={styles.eduTopRow}>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  <Text style={styles.eduYear}>{edu.year}</Text>
                </View>
                <Text style={styles.eduSchool}>{edu.school}</Text>
                {edu.mention && (
                  <Text style={styles.eduMention}>{edu.mention}</Text>
                )}
              </View>
            ))}
          </SectionRow>
        )}

        {data.skills.technical.length > 0 && (
          <SectionRow label="Compétences">
            <View style={styles.skillsBlock}>
              <View style={styles.skillRow}>
                <Text style={styles.skillRowLabel}>Tech</Text>
                <View style={styles.skillList}>
                  {data.skills.technical.map((s, i) => (
                    <View key={i} style={styles.skillChip}>
                      <Text style={styles.skillChipText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </SectionRow>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {data.personalInfo.name} · {new Date().getFullYear()}
          </Text>
          <Text style={styles.footerText}>
            StudioEntretien.fr · ATS-Optimized
          </Text>
        </View>
      </Page>
    </Document>
  );
};
export default MinimalTemplate;
