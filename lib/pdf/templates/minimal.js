import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Document, Page, Text, View, StyleSheet, Font, } from "@react-pdf/renderer";
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
const createStyles = (colorScheme) => {
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
export const MinimalTemplate = ({ data, options, }) => {
    const styles = createStyles(options.colorScheme);
    const SectionRow = ({ label, children, }) => (_jsxs(View, { style: styles.section, children: [_jsx(View, { style: styles.sectionLabel, children: _jsx(Text, { style: styles.sectionLabelText, children: label }) }), _jsx(View, { style: styles.sectionContent, children: children })] }));
    return (_jsx(Document, { title: `CV — ${data.personalInfo.name}`, author: data.personalInfo.name, children: _jsxs(Page, { size: "A4", style: styles.page, children: [_jsxs(View, { style: styles.header, children: [_jsx(Text, { style: styles.headerName, children: data.personalInfo.name }), _jsx(View, { style: styles.headerAccentLine }), _jsx(View, { style: styles.headerContact, children: [
                                data.personalInfo.email,
                                data.personalInfo.phone,
                                data.personalInfo.location,
                                data.personalInfo.linkedin,
                                data.personalInfo.portfolio,
                            ]
                                .filter(Boolean)
                                .map((contact, i) => (_jsxs(View, { style: styles.headerContactChip, children: [_jsx(View, { style: styles.headerContactBullet }), _jsx(Text, { style: styles.headerContactText, children: contact })] }, i))) })] }), _jsx(View, { style: styles.globalSeparator }), data.summary && (_jsx(SectionRow, { label: "Profil", children: _jsx(Text, { style: styles.summaryText, children: data.summary }) })), data.experience.length > 0 && (_jsx(SectionRow, { label: "Exp\u00E9rience", children: data.experience.map((exp, i) => (_jsxs(View, { style: styles.expItem, children: [_jsxs(View, { style: styles.expHeader, children: [_jsx(Text, { style: styles.expTitle, children: exp.title }), _jsx(Text, { style: styles.expPeriod, children: exp.period })] }), _jsxs(Text, { style: styles.expCompany, children: [exp.company, exp.location ? ` · ${exp.location}` : ""] }), exp.achievements.map((a, j) => (_jsxs(View, { style: styles.expBullet, children: [_jsx(View, { style: styles.expBulletDot }), _jsx(Text, { style: styles.expBulletText, children: a })] }, j)))] }, i))) })), data.education.length > 0 && (_jsx(SectionRow, { label: "Formation", children: data.education.map((edu, i) => (_jsxs(View, { style: styles.eduItem, children: [_jsxs(View, { style: styles.eduTopRow, children: [_jsx(Text, { style: styles.eduDegree, children: edu.degree }), _jsx(Text, { style: styles.eduYear, children: edu.year })] }), _jsx(Text, { style: styles.eduSchool, children: edu.school }), edu.mention && (_jsx(Text, { style: styles.eduMention, children: edu.mention }))] }, i))) })), data.skills.technical.length > 0 && (_jsx(SectionRow, { label: "Comp\u00E9tences", children: _jsx(View, { style: styles.skillsBlock, children: _jsxs(View, { style: styles.skillRow, children: [_jsx(Text, { style: styles.skillRowLabel, children: "Tech" }), _jsx(View, { style: styles.skillList, children: data.skills.technical.map((s, i) => (_jsx(View, { style: styles.skillChip, children: _jsx(Text, { style: styles.skillChipText, children: s }) }, i))) })] }) }) })), _jsxs(View, { style: styles.footer, fixed: true, children: [_jsxs(Text, { style: styles.footerText, children: [data.personalInfo.name, " \u00B7 ", new Date().getFullYear()] }), _jsx(Text, { style: styles.footerText, children: "StudioEntretien.fr \u00B7 ATS-Optimized" })] })] }) }));
};
export default MinimalTemplate;
//# sourceMappingURL=minimal.js.map