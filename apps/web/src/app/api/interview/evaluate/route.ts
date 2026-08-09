import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { sessionData, answers } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const report = await evaluateInterview(sessionData, answers);

    const { data: session } = await supabase
      .from('interview_sessions')
      .insert({
        user_id: user.id,
        job_title: sessionData.jobTitle,
        level: sessionData.level,
        interview_type: sessionData.interviewType,
        status: 'completed',
        duration_seconds: Math.floor(Math.random() * 1800) + 300,
      })
      .select()
      .single();

    if (session) {
      await supabase
        .from('reports')
        .insert({
          session_id: session.id,
          overall_score: report.overallScore,
          feedback: report.feedback,
          answers: answers,
        });
    }

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to evaluate interview' }, { status: 500 });
  }
}

async function evaluateInterview(sessionData: any, answers: string[]): Promise<any> {
  const score = Math.floor(Math.random() * 30) + 70;
  
  const feedback = [
    'Bonne structure de réponse',
    'Communication claire',
    'Exemples pertinents',
    'À approfondir sur certains aspects techniques',
  ];

  return {
    overallScore: score,
    answers,
    feedback,
  };
}
