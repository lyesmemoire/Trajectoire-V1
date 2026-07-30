// ===================================================================
// TECHNOLOGY CATALOG — Canonical Technology Names and Aliases
// ===================================================================

export interface TechnologyEntry {
  canonicalName: string;
  aliases: string[];
  category: "language" | "framework" | "platform" | "database" | "tool" | "cloud" | "other";
}

export const TechnologyCatalog: Map<string, TechnologyEntry> = new Map([
  // Languages
  ["javascript", { canonicalName: "JavaScript", aliases: ["js", "javascript"], category: "language" }],
  ["typescript", { canonicalName: "TypeScript", aliases: ["ts", "typescript"], category: "language" }],
  ["python", { canonicalName: "Python", aliases: ["python"], category: "language" }],
  ["java", { canonicalName: "Java", aliases: ["java"], category: "language" }],
  ["node", { canonicalName: "Node.js", aliases: ["node", "nodejs", "node.js"], category: "platform" }],
  ["go", { canonicalName: "Go", aliases: ["go", "golang"], category: "language" }],
  ["rust", { canonicalName: "Rust", aliases: ["rust"], category: "language" }],
  ["c++", { canonicalName: "C++", aliases: ["c++", "cpp"], category: "language" }],
  ["c#", { canonicalName: "C#", aliases: ["c#", "csharp"], category: "language" }],
  ["php", { canonicalName: "PHP", aliases: ["php"], category: "language" }],
  ["ruby", { canonicalName: "Ruby", aliases: ["ruby"], category: "language" }],
  ["swift", { canonicalName: "Swift", aliases: ["swift"], category: "language" }],
  ["kotlin", { canonicalName: "Kotlin", aliases: ["kotlin"], category: "language" }],
  ["scala", { canonicalName: "Scala", aliases: ["scala"], category: "language" }],
  
  // Frameworks
  ["react", { canonicalName: "React", aliases: ["react", "reactjs"], category: "framework" }],
  ["vue", { canonicalName: "Vue.js", aliases: ["vue", "vuejs"], category: "framework" }],
  ["angular", { canonicalName: "Angular", aliases: ["angular"], category: "framework" }],
  ["svelte", { canonicalName: "Svelte", aliases: ["svelte"], category: "framework" }],
  ["nextjs", { canonicalName: "Next.js", aliases: ["nextjs", "next.js"], category: "framework" }],
  ["nuxt", { canonicalName: "Nuxt.js", aliases: ["nuxt", "nuxtjs"], category: "framework" }],
  ["express", { canonicalName: "Express.js", aliases: ["express", "expressjs"], category: "framework" }],
  ["fastapi", { canonicalName: "FastAPI", aliases: ["fastapi"], category: "framework" }],
  ["django", { canonicalName: "Django", aliases: ["django"], category: "framework" }],
  ["flask", { canonicalName: "Flask", aliases: ["flask"], category: "framework" }],
  ["spring", { canonicalName: "Spring Boot", aliases: ["spring", "spring boot"], category: "framework" }],
  ["laravel", { canonicalName: "Laravel", aliases: ["laravel"], category: "framework" }],
  
  // Platforms / Cloud
  ["kubernetes", { canonicalName: "Kubernetes", aliases: ["kubernetes", "k8s", "k8"], category: "platform" }],
  ["docker", { canonicalName: "Docker", aliases: ["docker"], category: "platform" }],
  ["aws", { canonicalName: "Amazon Web Services", aliases: ["aws", "amazon web services"], category: "cloud" }],
  ["gcp", { canonicalName: "Google Cloud Platform", aliases: ["gcp", "google cloud"], category: "cloud" }],
  ["azure", { canonicalName: "Microsoft Azure", aliases: ["azure", "microsoft azure"], category: "cloud" }],
  ["ecs", { canonicalName: "Amazon ECS", aliases: ["ecs", "amazon ecs", "aws ecs"], category: "cloud" }],
  ["eks", { canonicalName: "Amazon EKS", aliases: ["eks", "amazon eks", "aws eks"], category: "cloud" }],
  ["gke", { canonicalName: "Google Kubernetes Engine", aliases: ["gke", "google kubernetes engine"], category: "cloud" }],
  ["aks", { canonicalName: "Azure Kubernetes Service", aliases: ["aks", "azure kubernetes service"], category: "cloud" }],
  ["lambda", { canonicalName: "AWS Lambda", aliases: ["lambda", "aws lambda"], category: "cloud" }],
  ["ec2", { canonicalName: "Amazon EC2", aliases: ["ec2", "amazon ec2"], category: "cloud" }],
  ["s3", { canonicalName: "Amazon S3", aliases: ["s3", "amazon s3"], category: "cloud" }],
  
  // Databases
  ["postgresql", { canonicalName: "PostgreSQL", aliases: ["postgresql", "postgres"], category: "database" }],
  ["mysql", { canonicalName: "MySQL", aliases: ["mysql"], category: "database" }],
  ["mongodb", { canonicalName: "MongoDB", aliases: ["mongodb", "mongo"], category: "database" }],
  ["redis", { canonicalName: "Redis", aliases: ["redis"], category: "database" }],
  ["elasticsearch", { canonicalName: "Elasticsearch", aliases: ["elasticsearch", "elastic"], category: "database" }],
  ["sqlite", { canonicalName: "SQLite", aliases: ["sqlite"], category: "database" }],
  ["oracle", { canonicalName: "Oracle Database", aliases: ["oracle"], category: "database" }],
  
  // Tools
  ["git", { canonicalName: "Git", aliases: ["git"], category: "tool" }],
  ["github", { canonicalName: "GitHub", aliases: ["github"], category: "tool" }],
  ["gitlab", { canonicalName: "GitLab", aliases: ["gitlab"], category: "tool" }],
  ["jenkins", { canonicalName: "Jenkins", aliases: ["jenkins"], category: "tool" }],
  ["terraform", { canonicalName: "Terraform", aliases: ["terraform"], category: "tool" }],
  ["ansible", { canonicalName: "Ansible", aliases: ["ansible"], category: "tool" }],
  ["kubernetes", { canonicalName: "Kubernetes", aliases: ["kubernetes", "k8s", "k8"], category: "platform" }],
  ["helm", { canonicalName: "Helm", aliases: ["helm"], category: "tool" }],
  ["prometheus", { canonicalName: "Prometheus", aliases: ["prometheus"], category: "tool" }],
  ["grafana", { canonicalName: "Grafana", aliases: ["grafana"], category: "tool" }],
  ["nginx", { canonicalName: "Nginx", aliases: ["nginx"], category: "tool" }],
  ["apache", { canonicalName: "Apache HTTP Server", aliases: ["apache", "httpd"], category: "tool" }],
]);
