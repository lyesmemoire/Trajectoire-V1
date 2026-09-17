"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";

import { createClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isAuthenticated?: boolean;
  userPlan?: "free" | "starter" | "pro" | "expert";
  userName?: string;
}

const navLinks = [
  {
    href: "/analyze",
    label: "Analyser",
  },
  {
    href: "/simulation",
    label: "Simulation",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/history",
    label: "Historique",
  },
  {
    href: "/pricing",
    label: "Tarifs",
  },
];

export function Navbar({
  isAuthenticated = false,
  userPlan = "free",
  userName,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const pathname = usePathname();

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("[Navbar] Logout failed:", error);
      }
    } catch (error) {
      console.error(
        "[Navbar] Unexpected logout error:",
        error,
      );
    } finally {
      window.location.assign("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-[73px] max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <div className="flex size-[26px] items-center justify-center rounded-[8px] bg-primary shadow-sm" aria-hidden="true">
             <div className="size-2 rounded-[2px] bg-white" />
          </div>
          <span className="font-sans text-[20px] font-bold tracking-tight text-foreground">
            Trajectoire
          </span>
        </Link>

        {isAuthenticated && (
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const active =
                pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "text-foreground"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        <div className="hidden items-center gap-4 lg:flex">
          {isAuthenticated ? (
            <>
              <Badge
                variant={
                  userPlan === "starter"
                    ? "free"
                    : userPlan
                }
              />

              {userName ? (
                <span className="text-sm text-foreground-muted">
                  {userName}
                </span>
              ) : null}

              <Link href="/settings">
                <Button
                  variant="ghost"
                  size="sm"
                >
                  Paramètres
                </Button>
              </Link>

              <button
                type="button"
                onClick={() =>
                  void handleLogout()
                }
                disabled={loggingOut}
                className="rounded-lg p-2 text-foreground-muted transition-colors duration-200 hover:bg-slate-100 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Se déconnecter"
              >
                <LogOut
                  size={18}
                  aria-hidden="true"
                />
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                >
                  Connexion
                </Button>
              </Link>

              <Link href="/signup">
                <Button
                  variant="primary"
                  size="sm"
                >
                  Commencer
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:hidden"
          onClick={() =>
            setMobileOpen(
              (current) => !current,
            )
          }
          aria-label={
            mobileOpen
              ? "Fermer le menu"
              : "Ouvrir le menu"
          }
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X
              size={22}
              aria-hidden="true"
            />
          ) : (
            <Menu
              size={22}
              aria-hidden="true"
            />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="space-y-4 border-t border-border bg-background/95 px-6 py-6 backdrop-blur-md lg:hidden">
          {isAuthenticated &&
            navLinks.map((link) => {
              const active =
                pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className={`block text-base font-medium ${
                    active
                      ? "text-foreground"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

          <div className="flex flex-col gap-3 border-t border-border pt-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      userPlan === "starter"
                        ? "free"
                        : userPlan
                    }
                  />

                  {userName ? (
                    <span className="text-sm text-foreground-muted">
                      {userName}
                    </span>
                  ) : null}
                </div>

                <Link
                  href="/settings"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="w-full"
                >
                  <Button
                    variant="secondary"
                    className="w-full"
                  >
                    Paramètres
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  className="w-full"
                  disabled={loggingOut}
                  onClick={() =>
                    void handleLogout()
                  }
                >
                  {loggingOut
                    ? "Déconnexion..."
                    : "Se déconnecter"}
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="w-full"
                >
                  <Button
                    variant="secondary"
                    className="w-full"
                  >
                    Connexion
                  </Button>
                </Link>

                <Link
                  href="/signup"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="w-full"
                >
                  <Button
                    variant="primary"
                    className="w-full"
                  >
                    Commencer
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}