// ===================================================================
// COMPANY CATALOG — Canonical Company Names and Aliases
// ===================================================================

export interface CompanyEntry {
  canonicalName: string;
  aliases: string[];
  category: "tech" | "aerospace" | "automotive" | "finance" | "healthcare" | "retail" | "other";
}

export const CompanyCatalog: Map<string, CompanyEntry> = new Map([
  ["airbus", { canonicalName: "Airbus", aliases: ["airbus"], category: "aerospace" }],
  ["boeing", { canonicalName: "Boeing", aliases: ["boeing"], category: "aerospace" }],
  ["safran", { canonicalName: "Safran", aliases: ["safran"], category: "aerospace" }],
  ["thales", { canonicalName: "Thales", aliases: ["thales"], category: "aerospace" }],
  ["dassault", { canonicalName: "Dassault Aviation", aliases: ["dassault", "dassault aviation"], category: "aerospace" }],
  
  ["google", { canonicalName: "Google", aliases: ["google", "alphabet"], category: "tech" }],
  ["microsoft", { canonicalName: "Microsoft", aliases: ["microsoft"], category: "tech" }],
  ["amazon", { canonicalName: "Amazon", aliases: ["amazon"], category: "tech" }],
  ["meta", { canonicalName: "Meta", aliases: ["meta", "facebook"], category: "tech" }],
  ["apple", { canonicalName: "Apple", aliases: ["apple"], category: "tech" }],
  ["netflix", { canonicalName: "Netflix", aliases: ["netflix"], category: "tech" }],
  ["spotify", { canonicalName: "Spotify", aliases: ["spotify"], category: "tech" }],
  ["uber", { canonicalName: "Uber", aliases: ["uber"], category: "tech" }],
  ["airbnb", { canonicalName: "Airbnb", aliases: ["airbnb"], category: "tech" }],
  
  ["renault", { canonicalName: "Renault", aliases: ["renault"], category: "automotive" }],
  ["peugeot", { canonicalName: "Peugeot", aliases: ["peugeot", "psa"], category: "automotive" }],
  ["volkswagen", { canonicalName: "Volkswagen", aliases: ["volkswagen", "vw"], category: "automotive" }],
  ["tesla", { canonicalName: "Tesla", aliases: ["tesla"], category: "automotive" }],
  ["bmw", { canonicalName: "BMW", aliases: ["bmw"], category: "automotive" }],
  ["mercedes", { canonicalName: "Mercedes-Benz", aliases: ["mercedes", "mercedes-benz"], category: "automotive" }],
  
  ["bnpparibas", { canonicalName: "BNP Paribas", aliases: ["bnp", "bnp paribas"], category: "finance" }],
  ["societegenerale", { canonicalName: "Société Générale", aliases: ["société générale", "socgen"], category: "finance" }],
  ["creditagricole", { canonicalName: "Crédit Agricole", aliases: ["crédit agricole"], category: "finance" }],
  ["hsbc", { canonicalName: "HSBC", aliases: ["hsbc"], category: "finance" }],
  ["jpmorgan", { canonicalName: "JPMorgan Chase", aliases: ["jpmorgan", "jpm"], category: "finance" }],
  ["goldman", { canonicalName: "Goldman Sachs", aliases: ["goldman", "goldman sachs"], category: "finance" }],
  
  ["sanofi", { canonicalName: "Sanofi", aliases: ["sanofi"], category: "healthcare" }],
  ["pfizer", { canonicalName: "Pfizer", aliases: ["pfizer"], category: "healthcare" }],
  ["astrazeneca", { canonicalName: "AstraZeneca", aliases: ["astrazeneca"], category: "healthcare" }],
  ["novartis", { canonicalName: "Novartis", aliases: ["novartis"], category: "healthcare" }],
]);
