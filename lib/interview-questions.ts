
export function getQuestionsForStyle(style: _InterviewStyle) {
  switch (style) {
    case "VISION_ARBITRAGE":
      return [
        "Quel arbitrage stratégique majeur avez-vous dû prendre sous contrainte forte ?",
        "Comment priorisez-vous lorsque tout semble prioritaire ?",
      ];

    case "LEADERSHIP_CONFLICT":
      return [
        "Décrivez une décision impopulaire que vous avez prise.",
        "Comment gérez-vous un conflit entre deux leaders clés ?",
      ];

    case "BOARD_PRESSURE":
      return [
        "Quelle décision avez-vous défendue face à une forte opposition ?",
        "Comment réagissez-vous face à un board sceptique ?",
      ];

    case "CRISIS_TRANSFORMATION":
      return [
        "Comment avez-vous conduit une transformation en situation instable ?",
        "Comment embarquez-vous des équipes résistantes au changement ?",
      ];

    default:
      return ["Présentez votre parcours en 3 minutes avec votre fil stratégique."];
  }
}
