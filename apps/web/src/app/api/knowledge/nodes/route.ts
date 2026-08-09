import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: nodes } = await supabase
      .from('knowledge_nodes')
      .select('*')
      .eq('user_id', user.id)
      .limit(50);

    return NextResponse.json({ nodes: nodes || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch nodes' }, { status: 500 });
  }
}
