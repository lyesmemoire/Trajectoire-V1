import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';

export async function POST() {
  // Production guard: disable test CV upload via Prisma in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Test endpoint disabled in production" }, { status: 403 });
  }

  try {
    const cvPath = join(process.cwd(), '../../test_cv.txt');
    const cvContent = await readFile(cvPath, 'utf-8');

    const user = await prisma.user.findFirst({
      where: { email: 'test@trajectoire.com' }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cvData = await prisma.cVAnalysis.create({
      data: {
        userId: user.id,
        fileName: 'test_cv.txt',
        originalText: cvContent,
        optimizedText: cvContent,
        cvData: { content: cvContent },
        atsScoreBefore: 50,
        atsScoreAfter: 75,
      }
    });

    return NextResponse.json({ success: true, cv: cvData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
