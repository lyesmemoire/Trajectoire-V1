import { describe, it, expect } from "vitest"
import { translateAuthError, isEmailNotConfirmed, GENERIC_AUTH_ERROR } from "./auth-errors"
import { normalizeEmail, isValidEmail, validatePassword, MIN_PASSWORD_LENGTH } from "./credentials"

describe("translateAuthError", () => {
  it("traduit par code", () => {
    expect(translateAuthError({ code: "invalid_credentials", message: "Invalid login credentials" })).toBe(
      "E-mail ou mot de passe incorrect.",
    )
    expect(translateAuthError({ code: "over_email_send_rate_limit" })).toMatch(/Trop d'e-mails/)
  })

  it("traduit par fragment de message quand le code manque", () => {
    expect(translateAuthError({ message: "Invalid login credentials" })).toBe("E-mail ou mot de passe incorrect.")
    expect(translateAuthError({ message: "User already registered" })).toMatch(/compte existe déjà/)
    expect(translateAuthError({ message: "New password should be different from the old password." })).toMatch(/différent/)
    expect(translateAuthError({ message: "Password should be at least 6 characters." })).toMatch(/trop faible/)
  })

  it("statut 429 sans autre indice : trop de tentatives", () => {
    expect(translateAuthError({ status: 429, message: "" })).toMatch(/Trop de tentatives/)
  })

  it("erreur inconnue ou absente : message générique, jamais le texte brut", () => {
    expect(translateAuthError({ message: "PGRST301 something internal" })).toBe(GENERIC_AUTH_ERROR)
    expect(translateAuthError(null)).toBe(GENERIC_AUTH_ERROR)
  })

  it("isEmailNotConfirmed", () => {
    expect(isEmailNotConfirmed({ code: "email_not_confirmed" })).toBe(true)
    expect(isEmailNotConfirmed({ message: "Email not confirmed" })).toBe(true)
    expect(isEmailNotConfirmed({ code: "invalid_credentials" })).toBe(false)
    expect(isEmailNotConfirmed(undefined)).toBe(false)
  })
})

describe("credentials", () => {
  it("normalizeEmail : espaces et casse", () => {
    expect(normalizeEmail("  Jean.Dupont@Example.COM ")).toBe("jean.dupont@example.com")
  })

  it("isValidEmail", () => {
    expect(isValidEmail("a@b.fr")).toBe(true)
    expect(isValidEmail("a@b")).toBe(false)
    expect(isValidEmail("a b@c.fr")).toBe(false)
    expect(isValidEmail("")).toBe(false)
  })

  it("validatePassword : 8 caractères minimum, 72 maximum", () => {
    expect(MIN_PASSWORD_LENGTH).toBe(8)
    expect(validatePassword("1234567")).toMatch(/au moins 8/)
    expect(validatePassword("12345678")).toBeNull()
    expect(validatePassword("x".repeat(73))).toMatch(/72/)
  })
})
