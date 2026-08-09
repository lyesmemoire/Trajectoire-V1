export function getInterviewStyleFromPosture(dominantPosture) {
    switch (dominantPosture) {
        case "Operational":
            return "VISION_ARBITRAGE";
        case "Managerial":
            return "LEADERSHIP_CONFLICT";
        case "Strategic":
            return "BOARD_PRESSURE";
        case "Transformational":
            return "CRISIS_TRANSFORMATION";
        default:
            return "VISION_ARBITRAGE";
    }
}
//# sourceMappingURL=interview-style.js.map