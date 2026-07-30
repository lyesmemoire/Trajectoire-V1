export function generateShareCopy(data: any): string {
  const { label, percentile, viralTitle, stats } = data
  return `Je viens de passer mon entretien technique avec Trajectoire ! Profil: ${label} (${percentile}e percentile). ${viralTitle}. Clarté: ${stats.clarityScore}/100, Résilience au stress: ${stats.stressResilience}/100. #entretien #tech #carrière`
}
