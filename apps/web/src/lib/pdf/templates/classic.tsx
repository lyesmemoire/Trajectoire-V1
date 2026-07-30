import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"
import { CVData, ExportOptions } from "../types"

Font.register({
  family: "Merriweather",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-fCZM.woff",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52xwNZWMf_.woff",
      fontWeight: 700,
    },
  ],
})

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff",
      fontWeight: 400,
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
})

const PALETTES = {
  blue: {
    primary: "#1E3A5F",
    accent: "#2563EB",
    rule: "#CBD5E1",
    tag: "#EFF6FF",
    tagText: "#1E40AF",
  },
  green: {
    primary: "#14532D",
    accent: "#16A34A",
    rule: "#D1FAE5",
    tag: "#F0FDF4",
    tagText: "#166534",
  },
  purple: {
    primary: "#3B0764",
    accent: "#7C3AED",
    rule: "#E9D5FF",
    tag: "#F5F3FF",
    tagText: "#5B21B6",
  },
  dark: {
    primary: "#111827",
    accent: "#374151",
    rule: "#D1D5DB",
    tag: "#F9FAFB",
    tagText: "#1F2937",
  },
}

const createStyles = (colorScheme: ExportOptions["colorScheme"]) => {
  const c = PALETTES[colorScheme] || PALETTES.blue
  return StyleSheet.create({
    page: {
      fontFamily: "Inter",
      backgroundColor: "#FFFFFF",
      paddingTop: 36,
      paddingBottom: 40,
      paddingHorizontal: 44,
    },
    header: {
      alignItems: "center",
      marginBottom: 22,
      paddingBottom: 18,
      borderBottomWidth: 2,
      borderBottomColor: c.primary,
    },
    headerName: {
      fontFamily: "Merriweather",
      fontSize: 22,
      fontWeight: 700,
      color: c.primary,
      letterSpacing: 1.5,
      textAlign: "center",
      marginBottom: 6,
    },
    headerJobTitle: {
      fontSize: 11,
      color: c.accent,
      fontWeight: 600,
      textAlign: "center",
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    headerRule: {
      width: 48,
      height: 1.5,
      backgroundColor: c.rule,
      marginBottom: 10,
    },
    headerContactRow: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    headerContactSeparator: {
      fontSize: 8.5,
      color: "#9CA3AF",
      marginHorizontal: 6,
    },
    headerContactText: {
      fontSize: 8.5,
      color: "#6B7280",
    },
    section: {
      marginBottom: 18,
    },
    sectionTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    sectionTitle: {
      fontFamily: "Merriweather",
      fontSize: 10,
      fontWeight: 700,
      color: c.primary,
      textTransform: "uppercase",
      letterSpacing: 2,
      marginRight: 10,
    },
    sectionRule: {
      flex: 1,
      height: 0.75,
      backgroundColor: c.rule,
    },
    summaryText: {
      fontSize: 9.5,
      lineHeight: 1.7,
      color: "#374151",
      textAlign: "justify",
    },
    expItem: {
      marginBottom: 13,
    },
    expTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 1,
    },
    expTitle: {
      fontFamily: "Merriweather",
      fontSize: 10,
      fontWeight: 700,
      color: "#111827",
    },
    expPeriod: {
      fontSize: 8.5,
      color: "#6B7280",
    },
    expCompanyRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    expCompany: {
      fontSize: 9,
      color: c.accent,
      fontWeight: 600,
    },
    expLocation: {
      fontSize: 8.5,
      color: "#9CA3AF",
      marginLeft: 6,
    },
    expBullet: {
      flexDirection: "row",
      marginBottom: 3.5,
    },
    expBulletDash: {
      fontSize: 9,
      color: c.accent,
      marginRight: 6,
      fontWeight: 700,
    },
    expBulletText: {
      fontSize: 9,
      color: "#4B5563",
      lineHeight: 1.55,
      flex: 1,
    },
    eduGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    eduItem: {
      width: "50%",
      paddingRight: 12,
      marginBottom: 10,
    },
    eduDegree: {
      fontFamily: "Merriweather",
      fontSize: 9.5,
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
      gap: 6,
      marginTop: 3,
    },
    eduYear: {
      fontSize: 8,
      color: c.accent,
      fontWeight: 700,
    },
    eduMention: {
      fontSize: 8,
      color: "#6B7280",
    },
    skillsGrid: {
      flexDirection: "row",
      gap: 18,
    },
    skillsColumn: {
      flex: 1,
    },
    skillColumnTitle: {
      fontSize: 8.5,
      fontWeight: 700,
      color: "#374151",
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 6,
    },
    skillTagsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 5,
    },
    skillTag: {
      backgroundColor: c.tag,
      borderRadius: 3,
      paddingHorizontal: 7,
      paddingVertical: 3,
    },
    skillTagText: {
      fontSize: 8.5,
      color: c.tagText,
      fontWeight: 600,
    },
    langRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    langItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    langDot: {
      width: 5,
      height: 5,
      backgroundColor: c.accent,
      borderRadius: 3,
    },
    langName: {
      fontSize: 9,
      color: "#374151",
      fontWeight: 600,
    },
    langLevel: {
      fontSize: 8.5,
      color: "#9CA3AF",
    },
    certRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    certItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    certDiamond: {
      fontSize: 7,
      color: c.accent,
    },
    certText: {
      fontSize: 8.5,
      color: "#374151",
    },
    certYear: {
      fontSize: 8,
      color: "#9CA3AF",
    },
    footer: {
      position: "absolute",
      bottom: 14,
      left: 44,
      right: 44,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    footerText: {
      fontSize: 7,
      color: "#D1D5DB",
    },
  })
}

export const ClassicTemplate = ({
  data, options
}: {
  data: CVData
  options: ExportOptions
}) => {
  const styles = createStyles(options.colorScheme)
  const contacts = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.portfolio,
  ].filter(Boolean) as string[]

  return (
    <Document
      title={`CV — ${data.personalInfo.name}`}
      author={data.personalInfo.name}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerName}>
            {data.personalInfo.name.toUpperCase()}
          </Text>
          {data.experience[0]?.title && (
            <Text style={styles.headerJobTitle}>
              {data.experience[0].title}
            </Text>
          )}
          <View style={styles.headerRule} />
          <View style={styles.headerContactRow}>
            {contacts.map((contact, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Text style={styles.headerContactSeparator}>·</Text>}
                <Text style={styles.headerContactText}>{contact}</Text>
              </React.Fragment>
            ))}
          </View>
        </View>

        {data.summary && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Profil</Text>
              <View style={styles.sectionRule} />
            </View>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {data.experience.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Expérience</Text>
              <View style={styles.sectionRule} />
            </View>
            {data.experience.map((exp, i) => (
              <View key={i} style={styles.expItem}>
                <View style={styles.expTopRow}>
                  <Text style={styles.expTitle}>{exp.title}</Text>
                  <Text style={styles.expPeriod}>{exp.period}</Text>
                </View>
                <View style={styles.expCompanyRow}>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  {exp.location && (
                    <Text style={styles.expLocation}>{exp.location}</Text>
                  )}
                </View>
                {exp.achievements.map((a, j) => (
                  <View key={j} style={styles.expBullet}>
                    <Text style={styles.expBulletDash}>—</Text>
                    <Text style={styles.expBulletText}>{a}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {data.education.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Formation</Text>
              <View style={styles.sectionRule} />
            </View>
            <View style={styles.eduGrid}>
              {data.education.map((edu, i) => (
                <View key={i} style={styles.eduItem}>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  <Text style={styles.eduSchool}>{edu.school}</Text>
                  <View style={styles.eduMeta}>
                    <Text style={styles.eduYear}>{edu.year}</Text>
                    {edu.mention && (
                      <Text style={styles.eduMention}>{edu.mention}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {data.personalInfo.name} · {new Date().getFullYear()}
          </Text>
          <Text style={styles.footerText}>
            StudioEntretien.fr · Optimisé ATS
          </Text>
        </View>
      </Page>
    </Document>
  )
}
export default ClassicTemplate
