export type InterviewStyle =
  | "VISION_ARBITRAGE"
  | "LEADERSHIP_CONFLICT"
  | "BOARD_PRESSURE"
  | "CRISIS_TRANSFORMATION";

export function getInterviewStyleFromPosture(dominantPosture: string): InterviewStyle {
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
