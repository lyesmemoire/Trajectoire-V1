// apps/web/src/app/api/user/subscription/route.ts
//
// Route authentifiée : statut d'accès premium de l'utilisateur connecté.

import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkUserSubscription } from '@/lib/subscription/check-subscription'

export async function GET(_request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    )
  }

  const result = await checkUserSubscription(user.id)
  return NextResponse.json(result)
}
