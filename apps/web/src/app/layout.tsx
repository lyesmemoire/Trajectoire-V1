import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Trajectoire — Préparez vos entretiens sereinement",
  description: "Entraînez-vous à l'oral grâce à nos simulations réalistes et obtenez un retour détaillé.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-bg-primary text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
