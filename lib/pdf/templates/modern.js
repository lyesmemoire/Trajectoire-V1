import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Document, Page, Text, View, StyleSheet, Font, } from "@react-pdf/renderer";
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
};
const createStyles = (colorScheme) => {
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
const LANG_LEVELS = {
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
function getLangBarWidth(langEntry) {
    const lower = langEntry.toLowerCase();
    for (const [key, val] of Object.entries(LANG_LEVELS)) {
        if (lower.includes(key))
            return val;
    }
    return 0.6;
}
function parseLangEntry(entry) {
    const dashMatch = entry.match(/^(.+?)\s*[—–-]\s*(.+)$/);
    const parenMatch = entry.match(/^(.+?)\s*\((.+?)\)$/);
    if (dashMatch)
        return { name: (dashMatch[1] ?? "").trim(), level: (dashMatch[2] ?? "").trim() };
    if (parenMatch)
        return { name: (parenMatch[1] ?? "").trim(), level: (parenMatch[2] ?? "").trim() };
    return { name: entry, level: "" };
}
export const ModernTemplate = ({ data, options }) => {
    const styles = createStyles(options.colorScheme);
    const c = COLOR_PALETTES[options.colorScheme] || COLOR_PALETTES.blue;
    const hasExperience = data.experience.length > 0;
    const hasEducation = data.education.length > 0;
    const hasTechSkills = data.skills.technical.length > 0;
    const hasSoftSkills = data.skills.soft.length > 0;
    const hasLanguages = data.skills.languages.length > 0;
    const hasCertifications = (data.certifications ?? []).length > 0;
    return (_jsx(Document, { title: `CV — ${data.personalInfo.name}`, author: data.personalInfo.name, subject: "Curriculum Vitae", keywords: "CV, ATS-Ready, StudioEntretien", creator: "StudioEntretien.fr", children: _jsxs(Page, { size: "A4", style: styles.page, children: [_jsxs(View, { style: styles.header, children: [_jsxs(View, { style: styles.headerTopRow, children: [_jsxs(View, { style: styles.headerLeft, children: [_jsx(Text, { style: styles.headerName, children: data.personalInfo.name }), data.experience[0]?.title && (_jsx(Text, { style: styles.headerTitle, children: data.experience[0].title }))] }), _jsx(View, { style: styles.headerBadge, children: _jsx(Text, { style: styles.headerBadgeText, children: "ATS-Ready" }) })] }), _jsx(View, { style: styles.headerDivider }), _jsxs(View, { style: styles.headerContactGrid, children: [data.personalInfo.email && (_jsx(View, { style: styles.headerContactItem, children: _jsxs(Text, { style: styles.headerContactText, children: ["\u2709 ", data.personalInfo.email] }) })), data.personalInfo.phone && (_jsx(View, { style: styles.headerContactItem, children: _jsxs(Text, { style: styles.headerContactText, children: ["\u260E ", data.personalInfo.phone] }) })), data.personalInfo.location && (_jsx(View, { style: styles.headerContactItem, children: _jsxs(Text, { style: styles.headerContactText, children: ["\u2316 ", data.personalInfo.location] }) })), data.personalInfo.linkedin && (_jsx(View, { style: styles.headerContactItem, children: _jsxs(Text, { style: styles.headerContactText, children: ["in ", data.personalInfo.linkedin] }) }))] })] }), _jsxs(View, { style: styles.body, children: [_jsxs(View, { style: styles.mainColumn, children: [data.summary && (_jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(View, { style: styles.sectionAccentBar }), _jsx(Text, { style: styles.sectionTitle, children: "Profil Professionnel" })] }), _jsx(View, { style: styles.summaryBox, children: _jsx(Text, { style: styles.summaryText, children: data.summary }) })] })), hasExperience && (_jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(View, { style: styles.sectionAccentBar }), _jsx(Text, { style: styles.sectionTitle, children: "Exp\u00E9riences Professionnelles" })] }), _jsx(View, { style: styles.sectionDivider }), data.experience.map((exp, i) => (_jsxs(View, { style: i === data.experience.length - 1
                                                ? styles.expItemLast
                                                : styles.expItem, children: [_jsxs(View, { style: styles.expHeader, children: [_jsx(Text, { style: styles.expTitle, children: exp.title }), _jsx(View, { style: styles.expPeriodBadge, children: _jsx(Text, { style: styles.expPeriodText, children: exp.period }) })] }), _jsxs(View, { style: styles.expCompanyRow, children: [_jsx(View, { style: styles.expCompanyDot }), _jsx(Text, { style: styles.expCompany, children: exp.company }), exp.location && (_jsxs(Text, { style: styles.expLocation, children: ["\u00B7 ", exp.location] }))] }), exp.achievements.map((achievement, j) => (_jsxs(View, { style: styles.expBullet, children: [_jsx(Text, { style: styles.expBulletArrow, children: "\u25B8" }), _jsx(Text, { style: styles.expBulletText, children: achievement })] }, j)))] }, i)))] })), hasEducation && (_jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(View, { style: styles.sectionAccentBar }), _jsx(Text, { style: styles.sectionTitle, children: "Formation" })] }), _jsx(View, { style: styles.sectionDivider }), data.education.map((edu, i) => (_jsxs(View, { style: styles.eduItem, children: [_jsx(View, { style: styles.eduAccent }), _jsxs(View, { style: styles.eduContent, children: [_jsx(Text, { style: styles.eduDegree, children: edu.degree }), _jsx(Text, { style: styles.eduSchool, children: edu.school }), _jsxs(View, { style: styles.eduMeta, children: [_jsx(Text, { style: styles.eduYear, children: edu.year }), edu.mention && (_jsx(Text, { style: styles.eduMention, children: edu.mention }))] })] })] }, i)))] }))] }), _jsxs(View, { style: styles.sideColumn, children: [hasTechSkills && (_jsxs(View, { style: styles.sideSection, children: [_jsx(Text, { style: styles.sideSectionTitle, children: "Comp\u00E9tences" }), _jsx(Text, { style: styles.skillGroupLabel, children: "Techniques" }), _jsx(View, { style: styles.skillPillsRow, children: data.skills.technical.map((skill, i) => (_jsx(View, { style: styles.skillPill, children: _jsx(Text, { style: styles.skillPillText, children: skill }) }, i))) }), hasSoftSkills && (_jsxs(_Fragment, { children: [_jsx(Text, { style: styles.skillGroupLabel, children: "Savoir-\u00EAtre" }), _jsx(View, { style: styles.skillPillsRow, children: data.skills.soft.map((skill, i) => (_jsx(View, { style: {
                                                            ...styles.skillPill,
                                                            backgroundColor: c.secondary,
                                                            borderColor: "transparent",
                                                        }, children: _jsx(Text, { style: styles.skillPillText, children: skill }) }, i))) })] }))] })), hasLanguages && (_jsxs(View, { style: styles.sideSection, children: [_jsx(Text, { style: styles.sideSectionTitle, children: "Langues" }), data.skills.languages.map((langEntry, i) => {
                                            const { name, level } = parseLangEntry(langEntry);
                                            const barWidth = getLangBarWidth(langEntry);
                                            return (_jsxs(View, { children: [_jsxs(View, { style: styles.langItem, children: [_jsx(Text, { style: styles.langName, children: name }), level && _jsx(Text, { style: styles.langLevel, children: level })] }), _jsx(View, { style: styles.langBar, children: _jsx(View, { style: [
                                                                styles.langBarFill,
                                                                { width: `${barWidth * 100}%` },
                                                            ] }) })] }, i));
                                        })] })), hasCertifications && (_jsxs(View, { style: styles.sideSection, children: [_jsx(Text, { style: styles.sideSectionTitle, children: "Certifications" }), data.certifications.map((cert, i) => (_jsxs(View, { style: styles.certItem, children: [_jsx(Text, { style: styles.certName, children: cert.name }), _jsx(Text, { style: styles.certIssuer, children: cert.issuer }), _jsx(Text, { style: styles.certYear, children: cert.year })] }, i)))] }))] })] }), _jsxs(View, { style: styles.footer, fixed: true, children: [_jsxs(Text, { style: styles.footerText, children: [data.personalInfo.name, " \u00B7 ", new Date().getFullYear()] }), _jsx(View, { style: styles.footerBadge, children: _jsx(Text, { style: styles.footerBadgeText, children: "StudioEntretien.fr \u00B7 Optimis\u00E9 ATS" }) })] })] }) }));
};
export default ModernTemplate;
//# sourceMappingURL=modern.js.map