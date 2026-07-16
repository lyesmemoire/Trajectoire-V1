// @ts-nocheck
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { Calendar, TrendingUp, FileText, MessageSquare, Filter, Download } from "lucide-react";

export const metadata = {
  title: "Historique - Trajectoire",
};

export default async function HistoryPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/history");
  }

  // Mock data for history - in production, this would come from queries
  const interviewHistory = [
    {
      id: "1",
      type: "Simulation vocale",
      date: "2026-07-04",
      score: 78,
      duration: "15 min",
      persona: "McKinsey",
    },
    {
      id: "2",
      type: "Simulation vocale",
      date: "2026-07-02",
      score: 72,
      duration: "12 min",
      persona: "Google",
    },
    {
      id: "3",
      type: "Simulation vocale",
      date: "2026-06-28",
      score: 65,
      duration: "10 min",
      persona: "Amazon",
    },
  ];

  const cvHistory = [
    {
      id: "1",
      type: "Analyse ATS",
      date: "2026-07-03",
      score: 85,
      fileName: "CV_2026_v2.pdf",
    },
    {
      id: "2",
      type: "Analyse ATS",
      date: "2026-06-25",
      score: 72,
      fileName: "CV_2026_v1.pdf",
    },
  ];

  const averageScore = interviewHistory.length > 0
    ? Math.round(interviewHistory.reduce((acc, h) => acc + h.score, 0) / interviewHistory.length)
    : 0;

  const scoreTrend = interviewHistory.length >= 2
    ? interviewHistory[0]!.score - interviewHistory[interviewHistory.length - 1]!.score
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Historique
        </h1>
        <p className="text-gray-600">
          Suivez votre progression et visualisez vos performances au fil du temps.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Simulations</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{interviewHistory.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Analyses CV</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{cvHistory.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                scoreTrend > 0 ? "bg-green-100" : scoreTrend < 0 ? "bg-red-100" : "bg-gray-100"
              }`}>
                <TrendingUp className={`w-5 h-5 ${
                  scoreTrend > 0 ? "text-green-600" : scoreTrend < 0 ? "text-red-600" : "text-gray-600"
                }`} />
              </div>
              <span className="text-sm text-gray-500">Progression</span>
            </div>
            <div className={`text-3xl font-bold ${
              scoreTrend > 0 ? "text-green-600" : scoreTrend < 0 ? "text-red-600" : "text-gray-900"
            }`}>
              {scoreTrend > 0 ? "+" : ""}{scoreTrend}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interview History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Simulations vocales</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviewHistory.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item.score >= 80 ? "bg-green-100 text-green-600" :
                    item.score >= 60 ? "bg-blue-100 text-blue-600" :
                    "bg-orange-100 text-orange-600"
                  }`}>
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.persona}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span>•</span>
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      item.score >= 80 ? "text-green-600" :
                      item.score >= 60 ? "text-blue-600" :
                      "text-orange-600"
                    }`}>
                      {item.score}%
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CV History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Analyses CV</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cvHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item.score >= 80 ? "bg-green-100 text-green-600" :
                    item.score >= 60 ? "bg-blue-100 text-blue-600" :
                    "bg-orange-100 text-orange-600"
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.fileName}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      item.score >= 80 ? "text-green-600" :
                      item.score >= 60 ? "text-blue-600" :
                      "text-orange-600"
                    }`}>
                      {item.score}%
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/dashboard/interview-simulation">
            Nouvelle simulation
          </Link>
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exporter l'historique
        </Button>
      </div>
    </div>
  );
}
