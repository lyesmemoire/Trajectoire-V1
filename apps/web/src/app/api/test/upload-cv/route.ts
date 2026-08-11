import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function POST() {
  // Production guard: disable test CV upload in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Test endpoint disabled in production" }, { status: 403 });
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    let userId = user?.id;
    
    if (!userId) {
      const { data: { user: newUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'test@trajectoire.com',
        password: 'test123456',
      });
      
      if (signInError || !newUser) {
        return NextResponse.json({ error: 'Authentication failed', details: signInError?.message }, { status: 401 });
      }
      userId = newUser.id;
    }

    const cvPath = join(process.cwd(), '../../test_cv.txt');
    const cvContent = await readFile(cvPath, 'utf-8');

    const { data: cvData, error: cvError } = await supabase
      .from('c_v_analysis')
      .insert({
        user_id: userId,
        file_name: 'test_cv.txt',
        original_text: cvContent,
        optimized_text: cvContent,
        cv_data: { content: cvContent },
        ats_score_before: 50,
        ats_score_after: 75,
      })
      .select()
      .single();

    if (cvError) {
      return NextResponse.json({ error: 'CV insert failed', details: cvError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, cv: cvData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
