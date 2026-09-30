import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { isEmailNotConfirmed, translateAuthError } from "@/lib/auth/auth-errors"
import { isValidEmail, normalizeEmail } from "@/lib/auth/credentials"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json({ error: "Supabase env missing" }, { status: 500 })
  }

  let cookiesToSet: Array<{ name: string; value: string; options: any }> = []

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(newCookies) {
        cookiesToSet = newCookies
      },
    },
  })

  const body = (await request.json().catch(() => ({}))) as {
    email?: string
    password?: string
  }

  if (typeof body.email !== "string" || typeof body.password !== "string" || !body.email || !body.password) {
    return NextResponse.json({ error: "Renseignez votre e-mail et votre mot de passe." }, { status: 400 })
  }

  // Adresse normalisée (espaces, casse) : évite « e-mail incorrect » pour un simple espace collé.
  const email = normalizeEmail(body.email)
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Cette adresse e-mail n'est pas valide." }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: body.password,
  })

  if (error) {
    // Message français, jamais le texte brut de Supabase ; `code` permet à la page de
    // proposer le renvoi de l'e-mail de confirmation.
    return NextResponse.json(
      {
        error: translateAuthError(error),
        ...(isEmailNotConfirmed(error) ? { code: "email_not_confirmed" } : {}),
      },
      { status: 401 },
    )
  }

  const response = NextResponse.json({ user: data.user })
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })
  return response
}
