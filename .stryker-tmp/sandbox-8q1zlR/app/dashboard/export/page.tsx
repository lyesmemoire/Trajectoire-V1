// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { FileText, Download, Settings } from "lucide-react";
import Link from "next/link";

export default function ExportPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-text">Export PDF</h1>
        <p className="text-text-secondary mt-2">
          Exportez votre CV final au format PDF optimisé pour les recruteurs.
        </p>
      </div>

      {/* Export Options */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Export Standard</CardTitle>
                <p className="text-sm text-text-secondary mt-1">
                  Format PDF standard, compatible avec tous les ATS
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/cvs">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Export Personnalisé</CardTitle>
                <p className="text-sm text-text-secondary mt-1">
                  Configurez les options d'export (marges, format, etc.)
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/cvs">
                <Settings className="w-4 h-4 mr-2" />
                Configurer
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card variant="default">
        <CardContent className="p-6">
          <h3 className="font-semibold text-text mb-2">Conseils d'export</h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Utilisez le format PDF pour une compatibilité maximale avec les ATS
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Vérifiez que votre nom et vos coordonnées sont bien visibles
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Testez l'export avant de l'envoyer aux recruteurs
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
