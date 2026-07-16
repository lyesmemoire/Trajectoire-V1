import { NextResponse } from "next/server";

export async function GET() {
  throw new Error("Sentry test - Erreur volontaire générée pour vérifier l'intégration Sentry.");
  
  // Le code ci-dessous ne sera jamais exécuté
  return NextResponse.json({ status: "ok" });
}
