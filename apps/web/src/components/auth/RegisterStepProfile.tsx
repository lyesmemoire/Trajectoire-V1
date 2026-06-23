import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { FormField, Input, PasswordInput, Button } from "@/components/ui";

export function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score  = checks.filter(Boolean).length;
  const labels = ["", "Faible", "Moyen", "Fort", "Excellent"];
  const colors = ["", "bg-accent", "bg-warning", "bg-success", "bg-primary"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-border"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${score >= 3 ? "text-success" : "text-ink-muted"}`}>
        {score > 0 ? `Sécurité : ${labels[score]}` : ""}
      </p>
    </div>
  );
}

const ROLES = [
  "Cadre supérieur",
  "Directeur / Directrice",
  "Manager",
  "Chef de projet",
  "Consultant(e)",
  "Professionnel(le) en transition",
  "Autre",
];

export function RegisterStepProfile({
  data, onChange, onNext,
}: {
  data: any;
  onChange: (k: string, v: string | boolean) => void;
  onNext: () => void;
}) {
  const valid = !!(data.firstName && data.lastName && data.email && data.password.length >= 8);

  return (
    <motion.div
      key="step1"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      <motion.div variants={fadeInUp}>
        <h2 className="text-xl font-bold mb-1 text-ink">
          Créez votre compte
        </h2>
        <p className="text-sm text-ink-muted">
          Quelques informations pour commencer.
        </p>
      </motion.div>

      {/* Prénom + Nom */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
        <FormField label="Prénom" htmlFor="firstName">
          <Input
            id="firstName" type="text" autoComplete="given-name" required
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="Sophie"
          />
        </FormField>
        <FormField label="Nom" htmlFor="lastName">
          <Input
            id="lastName" type="text" autoComplete="family-name" required
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Martin"
          />
        </FormField>
      </motion.div>

      {/* Email */}
      <motion.div variants={fadeInUp}>
        <FormField label="Adresse email professionnelle" htmlFor="reg-email">
          <Input
            id="reg-email" type="email" autoComplete="email" required
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="vous@entreprise.com"
          />
        </FormField>
      </motion.div>

      {/* Role */}
      <motion.div variants={fadeInUp}>
        <FormField label="Votre fonction" htmlFor="role">
          <div className="relative">
            <select
              id="role"
              value={data.role}
              onChange={(e) => onChange("role", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200 appearance-none bg-background border border-border focus-visible:border-brand-primary focus-visible:ring-4 focus-visible:ring-brand-primary/10 ${
                data.role ? "text-ink" : "text-ink-muted"
              }`}
            >
              <option value="" disabled>Sélectionnez votre fonction</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </FormField>
      </motion.div>

      {/* Password */}
      <motion.div variants={fadeInUp}>
        <FormField label="Mot de passe" htmlFor="reg-password">
          <PasswordInput
            id="reg-password" autoComplete="new-password" required
            value={data.password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="Minimum 8 caractères"
          />
          <PasswordStrength password={data.password} />
        </FormField>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Button
          type="button" onClick={onNext} disabled={!valid}
          fullWidth variant="primary" className="py-4"
        >
          Continuer
        </Button>
      </motion.div>
    </motion.div>
  );
}
