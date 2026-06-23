import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { defaultMetadata } from "@/lib/seo";
import { generateAllSchemas } from "@/lib/schema";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemas = generateAllSchemas();

  return (
    <html lang="fr" className={GeistSans.variable}>
      <head>
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="color-scheme" content="light" />
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only"
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            zIndex: 50,
            padding: "0.5rem 1rem",
            backgroundColor: "white",
            color: "var(--primary)",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            fontWeight: 600,
          }}
        >
          Aller au contenu principal
        </a>
        <main id="main-content">{children}</main>
        {schemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </body>
    </html>
  );
}
