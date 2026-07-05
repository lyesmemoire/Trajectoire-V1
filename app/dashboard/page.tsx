import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { ProgressWidget } from "@/components/dashboard/progress-widget";
import { TimelineWidget } from "@/components/dashboard/timeline-widget";
import { GoalsWidget } from "@/components/dashboard/goals-widget";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ListUserInterviewsQuery, InterviewReadModel } from "@/lib/interview/application/queries/list-user-interviews.query";
import { GetCareerProfileQuery, CareerProfileReadModel } from "@/lib/career/application/queries/get-career-profile.query";
import { ListUserCvsQuery, UserCvReadModel } from "@/lib/cv/application/queries/list-user-cvs.query";
import { GetWalletBalanceQuery } from "@/lib/billing/application/queries/get-wallet-balance.query";

export default async function DashboardHome() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  // Get user data directly from Supabase (using existing auth user)
  const userData = {
    displayName: user.user_metadata?.full_name || user.email?.split("@")[0],
    email: user.email,
  };

  // Get billing data via query
  const walletQuery = new GetWalletBalanceQuery();
  const walletHandler = new (await import("@/lib/billing/application/queries/get-wallet-balance.query")).GetWalletBalanceQueryHandler();
  const walletResult = await walletHandler.execute(walletQuery);
  const credits = walletResult.isSuccess() ? walletResult.unwrap() : 0;

  // Get interview data via query
  const interviewQuery = new ListUserInterviewsQuery();
  const interviewHandler = new (await import("@/lib/interview/application/queries/list-user-interviews.query")).ListUserInterviewsQueryHandler();
  const interviewResult = await interviewHandler.execute(interviewQuery);
  const interviews = interviewResult.isSuccess() ? interviewResult.unwrap() : [];

  // Get career data via query
  const careerQuery = new GetCareerProfileQuery();
  const careerHandler = new (await import("@/lib/career/application/queries/get-career-profile.query")).GetCareerProfileQueryHandler();
  const careerResult = await careerHandler.execute(careerQuery);
  const careerProfile = careerResult.isSuccess() ? careerResult.unwrap() : null;

  // Get CV data via query
  const cvQuery = new (await import("@/lib/cv/application/queries/list-user-cvs.query")).ListUserCvsQuery();
  const cvHandler = new (await import("@/lib/cv/application/queries/list-user-cvs.query")).ListUserCvsQueryHandler();
  const cvResult = await cvHandler.execute(cvQuery);
  const cvs = cvResult.isSuccess() ? cvResult.unwrap() : [];

  // Calculate stats
  const interviewsCompleted = interviews.filter(i => i.status === "completed").length;
  const interviewsThisMonth = interviews.filter(i => {
    const createdAt = new Date(i.createdAt);
    const now = new Date();
    return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
  }).length;

  const stats = {
    interviewsCompleted,
    interviewsThisMonth,
    credits,
    careerScore: careerProfile?.careerScore || null,
  };

  // Generate progress steps based on career profile
  const hasCareerProfile = !!careerProfile;
  const isIntermediate = careerProfile?.readinessLevel === "intermediate";
  const hasInterviews = interviewsCompleted > 0;
  const hasManyInterviews = interviewsCompleted >= 5;

  const progressSteps = [
    { id: "1", title: "Diagnostic initial", completed: hasCareerProfile, current: !hasCareerProfile },
    { id: "2", title: "Narrative structurée", completed: isIntermediate, current: isIntermediate },
    { id: "3", title: "Entraînement intensif", completed: hasInterviews, current: hasCareerProfile && !hasInterviews },
    { id: "4", title: "Validation finale", completed: hasManyInterviews, current: hasInterviews && !hasManyInterviews },
  ];

  // Generate timeline items from interviews
  const timelineItems = interviews.slice(0, 4).map((interview, index) => ({
    id: interview.id,
    title: `Session ${interview.persona}`,
    date: new Date(interview.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    time: new Date(interview.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    status: interview.status === "completed" ? "completed" as const : interview.status === "in_progress" ? "upcoming" as const : "pending" as const,
    type: "session" as const,
  }));

  // Generate goals from career profile
  const goals = [
    {
      id: "1",
      title: careerProfile?.targetRole || "Définir votre objectif",
      progress: careerProfile?.careerScore || 0,
      deadline: "En cours",
      priority: "high" as const,
    },
    {
      id: "2",
      title: `${interviewsCompleted}/5 simulations`,
      progress: Math.min((interviewsCompleted / 5) * 100, 100),
      deadline: "Objectif",
      priority: "medium" as const,
    },
    {
      id: "3",
      title: `${cvs.length} CV(s) créé(s)`,
      progress: cvs.length > 0 ? 100 : 0,
      deadline: "Prochain",
      priority: cvs.length > 0 ? "low" as const : "high" as const,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Bienvenue, {userData.displayName}
        </h1>
        <p className="text-gray-600 text-lg">
          Voici un aperçu de votre progression et de vos prochaines étapes.
        </p>
      </div>

      {/* Stats grid */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <StatsGrid stats={stats} />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
            <TimelineWidget items={timelineItems} />
          </div>
          <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
            <GoalsWidget goals={goals} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
            <ProgressWidget steps={progressSteps} />
          </div>
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
