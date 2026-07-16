// @ts-nocheck
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { BookOpen, MessageSquare, Target, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Préparation Entretien - Trajectoire",
};

export default async function InterviewPrepPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/interview-prep");
  }

  const categories = [
    {
      id: "common",
      title: "Questions courantes",
      description: "Les questions les plus posées en entretien",
      icon: MessageSquare,
      questions: 15,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "behavioral",
      title: "Questions comportementales",
      description: "STAR method et situations passées",
      icon: TrendingUp,
      questions: 12,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "technical",
      title: "Questions techniques",
      description: "Compétences et savoir-faire",
      icon: Target,
      questions: 10,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "company",
      title: "Questions spécifiques",
      description: "Adaptées à l'entreprise et au poste",
      icon: BookOpen,
      questions: 8,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const tips = [
    {
      id: "1",
      title: "Préparez vos exemples",
      description: "Ayez 3-4 exemples concrets de vos réussites prêts à être partagés",
      icon: CheckCircle2,
    },
    {
      id: "2",
      title: "Recherchez l'entreprise",
      description: "Comprenez leur culture, leurs produits et leurs défis",
      icon: BookOpen,
    },
    {
      id: "3",
      title: "Pratiquez à voix haute",
      description: "Entraînez-vous à répondre à haute voix pour gagner en confiance",
      icon: MessageSquare,
    },
    {
      id: "4",
      title: "Préparez vos questions",
      description: "Ayez des questions pertinentes à poser au recruteur",
      icon: Target,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Préparation Entretien
        </h1>
        <p className="text-gray-600">
          Maîtrisez chaque type de question avec nos guides et exercices pratiques.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button asChild size="lg" className="h-auto py-6">
          <Link href="/dashboard/interview-simulation">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Lancer une simulation</div>
                <div className="text-sm opacity-90">Pratiquez avec l'IA</div>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto" />
            </div>
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="h-auto py-6">
          <Link href="/dashboard/history">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Voir votre historique</div>
                <div className="text-sm text-gray-600">Progression et résultats</div>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
            </div>
          </Link>
        </Button>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Catégories de questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                <div className="text-sm font-medium text-gray-500">
                  {category.questions} questions
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Conseils pour réussir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip) => (
              <div key={tip.id} className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <tip.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Prêt à vous entraîner ?
              </h3>
              <p className="text-gray-600">
                Lancez une simulation vocale avec notre IA pour vous préparer efficacement.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/dashboard/interview-simulation">
                Commencer la simulation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
