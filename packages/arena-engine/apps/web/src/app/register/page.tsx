"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const passwordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = passwordStrength(password);
  const strengthLabels = ["", "Faible", "Moyen", "Bon", "Excellent"];
  const strengthColors = ["", "#f59e0b", "#3b82f6", "#10b981", "#10b981"];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 style={styles.title}>C'est fait ! 🎉</h1>
          <p style={styles.subtitle}>
            Un lien de confirmation a été envoyé à{" "}
            <span style={{ color: "#6366f1", fontWeight: 600 }}>{email}</span>
          </p>
          <p style={styles.helperText}>
            Vérifie ta boîte mail (et tes spams) pour activer ton compte.
          </p>
          <a href="/login" style={styles.linkButton}>
            Retour à la connexion
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:focus {
          border-color: #818cf8 !important;
          box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.15) !important;
          outline: none;
        }
        button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(99, 102, 241, 0.35) !important;
        }
        .input-field::placeholder {
          color: #a5b4fc;
          opacity: 0.6;
        }
      `}</style>

      {/* Decorative blobs */}
      <div style={{ ...styles.blob, ...styles.blob1 }} />
      <div style={{ ...styles.blob, ...styles.blob2 }} />

      <div
        style={{
          ...styles.card,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Logo */}
        <div style={styles.logoWrapper}>
          <div style={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5z"
                fill="url(#logoGradient)"
              />
              <path
                d="M2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span style={styles.logoText}>Trajectoire</span>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Bienvenue 👋</h1>
          <p style={styles.subtitle}>
            Crée ton compte en 30 secondes et commence à t'entraîner sereinement.
          </p>
        </div>

        {/* Encouraging message */}
        <div style={styles.encouragementBox}>
          <span style={styles.encouragementIcon}>💪</span>
          <span style={styles.encouragementText}>
            Tu es sur le point de rejoindre des milliers de candidats qui
            décrochent leur job de rêve.
          </span>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="2" />
              <path
                d="M12 8v4M12 16h.01"
                stroke="#dc2626"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>📧 Ton email</label>
            <input
              type="email"
              placeholder="toi@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>🔒 Choisis un mot de passe</label>
            <input
              type="password"
              placeholder="6 caractères minimum"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input-field"
              style={styles.input}
            />
            {password.length > 0 && (
              <div style={styles.strengthWrapper}>
                <div style={styles.strengthBar}>
                  <div
                    style={{
                      ...styles.strengthFill,
                      width: `${(strength / 4) * 100}%`,
                      background: strengthColors[strength],
                    }}
                  />
                </div>
                <span
                  style={{
                    ...styles.strengthLabel,
                    color: strengthColors[strength],
                  }}
                >
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>✨ Confirme ton mot de passe</label>
            <input
              type="password"
              placeholder="Retape-le pour être sûr"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="input-field"
              style={{
                ...styles.input,
                borderColor:
                  confirmPassword.length > 0 &&
                  password === confirmPassword
                    ? "#10b981"
                    : confirmPassword.length > 0
                    ? "#f59e0b"
                    : "#e0e7ff",
              }}
            />
            {confirmPassword.length > 0 && (
              <span
                style={{
                  fontSize: "12px",
                  color:
                    password === confirmPassword ? "#10b981" : "#f59e0b",
                  marginTop: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {password === confirmPassword ? "✓ Parfait !" : "⏳ Encore un effort"}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.8 : 1,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? (
              <span style={styles.buttonContent}>
                <span style={styles.spinner} />
                On y est presque...
              </span>
            ) : (
              <span style={styles.buttonContent}>
                Créer mon compte gratuitement
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </button>
        </form>

        {/* Trust line */}
        <div style={styles.trustLine}>
          <span>🛡️ Tes données sont sécurisées et ne seront jamais partagées</span>
        </div>

        {/* Footer */}
        <p style={styles.footer}>
          Déjà un compte ?{" "}
          <a href="/login" style={styles.link}>
            Connecte-toi ici
          </a>
        </p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #faf5ff 0%, #ede9fe 30%, #e0e7ff 70%, #ddd6fe 100%)",
    padding: "40px 20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
    position: "relative",
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(60px)",
    opacity: 0.4,
    pointerEvents: "none",
  },
  blob1: {
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, #c7d2fe 0%, transparent 70%)",
    top: "-100px",
    left: "-100px",
    animation: "float 8s ease-in-out infinite",
  },
  blob2: {
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, #fbcfe8 0%, transparent 70%)",
    bottom: "-50px",
    right: "-50px",
    animation: "float 10s ease-in-out infinite",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "48px 40px",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    boxShadow:
      "0 25px 50px -12px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)",
    position: "relative",
    zIndex: 1,
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "32px",
  },
  logoIcon: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
  },
  logoText: {
    fontSize: "22px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.02em",
  },
  header: {
    marginBottom: "24px",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1e1b4b",
    margin: "0 0 8px 0",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: "15px",
    color: "#6b7280",
    margin: 0,
    lineHeight: "1.5",
  },
  encouragementBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "24px",
  },
  encouragementIcon: {
    fontSize: "20px",
  },
  encouragementText: {
    fontSize: "13px",
    color: "#166534",
    lineHeight: "1.5",
    fontWeight: "500",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#4338ca",
    letterSpacing: "0.01em",
  },
  input: {
    background: "#ffffff",
    border: "2px solid #e0e7ff",
    borderRadius: "12px",
    padding: "14px 16px",
    fontSize: "15px",
    color: "#1e1b4b",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  strengthWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "6px",
  },
  strengthBar: {
    flex: 1,
    height: "4px",
    background: "#e0e7ff",
    borderRadius: "2px",
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: "2px",
    transition: "all 0.3s ease",
  },
  strengthLabel: {
    fontSize: "11px",
    fontWeight: "600",
    minWidth: "60px",
    textAlign: "right",
  },
  button: {
    background:
      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "16px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
    transition: "all 0.2s ease",
    boxShadow: "0 8px 20px rgba(99, 102, 241, 0.25)",
    fontFamily: "inherit",
    letterSpacing: "-0.01em",
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  trustLine: {
    marginTop: "20px",
    padding: "12px",
    background: "#f5f3ff",
    borderRadius: "10px",
    textAlign: "center",
  },
  trustLineText: {
    fontSize: "12px",
    color: "#6366f1",
    fontWeight: "500",
  },
  footer: {
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
    margin: "20px 0 0 0",
  },
  link: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: "700",
  },
  successCard: {
    width: "100%",
    maxWidth: "460px",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "48px 40px",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.2)",
    textAlign: "center",
  },
  successIconWrapper: {
    width: "80px",
    height: "80px",
    margin: "0 auto 24px",
    background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "float 3s ease-in-out infinite",
  },
  helperText: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "8px",
  },
  linkButton: {
    display: "inline-block",
    marginTop: "24px",
    padding: "14px 28px",
    background:
      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 8px 20px rgba(99, 102, 241, 0.25)",
  },
};

// Fix: trustLine style was incomplete, override
styles.trustLine = {
  ...styles.trustLine,
  marginTop: "20px",
  padding: "12px",
  background: "#f5f3ff",
  borderRadius: "10px",
  textAlign: "center" as const,
};