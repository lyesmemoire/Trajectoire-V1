import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { jobTitle, level, interviewType } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const questions = await generateQuestions(jobTitle, level, interviewType);

    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
  }
}

async function generateQuestions(jobTitle: string, level: string, interviewType: string): Promise<string[]> {
  const baseQuestions = [
    `Présentez-vous et décrivez votre parcours professionnel pour le poste de ${jobTitle}.`,
    `Quelles sont vos compétences principales pour ce poste de ${jobTitle} ?`,
    `Décrivez un projet dont vous êtes particulièrement fier et qui est pertinent pour ce poste.`,
    `Comment gérez-vous les situations de stress dans un environnement de travail ?`,
    `Pourquoi voulez-vous rejoindre notre entreprise pour ce poste de ${jobTitle} ?`,
  ];

  if (interviewType === 'technical') {
    return [
      ...baseQuestions.slice(0, 2),
      `Quelles technologies maîtrisez-vous pour le poste de ${jobTitle} ?`,
      `Décrivez un problème technique complexe que vous avez résolu.`,
      ...baseQuestions.slice(3),
    ];
  }

  if (interviewType === 'behavioral') {
    return [
      ...baseQuestions.slice(0, 1),
      `Comment travaillez-vous en équipe ?`,
      `Décrivez un conflit que vous avez géré au travail.`,
      ...baseQuestions.slice(2),
    ];
  }

  return baseQuestions;
}
