import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json(
      { error: "Supabase env missing" },
      { status: 500 }
    )
  }

  let cookiesToSet: Array<{
    name: string
    value: string
    options: any
  }> = []

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

  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  const response = NextResponse.json({ ok: true })

  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })

  return response
}