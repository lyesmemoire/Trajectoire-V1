// @ts-nocheck
import disposableDomains from "disposable-email-domains";

export function validateEmail(email: string) {
  const normalized = email.toLowerCase().trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalized)) {
    return {
      valid: false,
      message: "Adresse email invalide",
    };
  }

  const domain = normalized.split("@")[1];

  if (disposableDomains.includes(domain!)) {
    return {
      valid: false,
      message: "Les emails temporaires ne sont pas autorisés",
    };
  }

  return {
    valid: true,
    message: null,
  };
}
