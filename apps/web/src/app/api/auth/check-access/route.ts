// apps/web/src/app/api/auth/check-access/route.ts
//
// USAGE : Appelée uniquement par le middleware
// ACCÈS : Interne uniquement (vérification x-internal-request)
// RETOUR : { hasAccess: boolean, status: string, plan: string | null }

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkUserSubscription } from '@/lib/subscription/check-subscription'

export async function GET(request: NextRequest) {

  // Vérifier que c'est bien le middleware qui appelle
  const isInternal = request.headers.get('x-internal-request') === 'middleware'
  if (!isInternal) {
    return NextResponse.json(
      { error: 'Accès non autorisé' },
      { status: 403 }
    )
  }

  // Récupérer le user ID depuis les headers (mis par le middleware)
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    // Fallback : essayer via Supabase
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { hasAccess: false, status: 'unauthenticated', plan: null }
      )
    }

    const result = await checkUserSubscription(user.id)
    return NextResponse.json(result)
  }

  const result = await checkUserSubscription(userId)
  return NextResponse.json(result)
}
