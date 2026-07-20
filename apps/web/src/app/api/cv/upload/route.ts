// apps/web/src/app/api/cv/upload/route.ts
// CRÉATION L2.2 — 19 juillet 2026
// SOURCE : Adapté depuis /api/product/upload (legacy n'a pas cette route)
// RAISON : Séparation des responsabilités upload / analyze

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// ============================================================
// CONSTANTES
// ============================================================

const MAX_FILE_SIZE = 8 * 1024 * 1024  // 8 Mo — aligné sur /api/product/upload

const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'text/plain': 'TXT',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
}

// ============================================================
// HANDLER
// ============================================================

export async function POST(request: NextRequest) {

  // 1. Authentification
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    )
  }

  // 2. Récupération du fichier
  let formData: FormData

  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { error: 'Requête multipart invalide' },
      { status: 400 }
    )
  }

  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json(
      { error: 'Champ "file" absent de la requête' },
      { status: 400 }
    )
  }

  // 3. Validation type MIME
  if (!ALLOWED_TYPES[file.type]) {
    return NextResponse.json(
      {
        error: 'Format non supporté',
        accepted: Object.values(ALLOWED_TYPES),
        received: file.type || 'inconnu',
      },
      { status: 400 }
    )
  }

  // 4. Validation taille
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        error: 'Fichier trop volumineux',
        maxSize: '8 Mo',
        receivedSize: `${(file.size / 1024 / 1024).toFixed(2)} Mo`,
      },
      { status: 400 }
    )
  }

  if (file.size === 0) {
    return NextResponse.json(
      { error: 'Le fichier est vide' },
      { status: 400 }
    )
  }

  // 5. Extraction du texte
  let extractedText = ''

  try {
    if (file.type === 'application/pdf') {
      extractedText = await extractPDF(file)
    } else {
      // TXT et DOCX : lecture directe
      extractedText = await file.text()
    }
  } catch (err) {
    logger.error({
      userId: user.id,
      fileType: file.type,
      message: err instanceof Error ? err.message : 'Unknown error',
      event: 'CV upload — extraction failed'
    })
    return NextResponse.json(
      { error: 'Impossible de lire le fichier. Vérifiez qu\'il n\'est pas corrompu.' },
      { status: 422 }
    )
  }

  // 6. Validation du contenu extrait
  const cleanText = extractedText.trim()

  if (!cleanText || cleanText.length < 50) {
    return NextResponse.json(
      {
        error: 'Le fichier semble vide ou son contenu est illisible',
        hint: 'Assurez-vous que le PDF contient du texte sélectionnable (pas une image scannée)',
      },
      { status: 422 }
    )
  }

  // 7. Réponse — le texte extrait est prêt pour /api/cv/analyze
  return NextResponse.json({
    success: true,
    fileName: file.name,
    fileSize: file.size,
    fileType: ALLOWED_TYPES[file.type],
    textLength: cleanText.length,
    extractedText: cleanText,
  })
}

// ============================================================
// EXTRACTION PDF
// Utilise pdfjs-dist (installé) avec fallback pdf-parse
// ============================================================

async function extractPDF(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  // Tentative 1 : pdf-parse (plus simple, synchrone)
  try {
    const pdfParse = (await import('pdf-parse')).default
    const result = await pdfParse(buffer)

    if (result.text && result.text.trim().length > 10) {
      return result.text
    }
  } catch (err) {
    logger.warn({
      message: err instanceof Error ? err.message : 'Unknown',
      event: 'CV upload — pdf-parse failed, trying pdfjs-dist'
    })
  }

  // Tentative 2 : pdfjs-dist (fallback)
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
    const pdfDocument = await loadingTask.promise

    const textParts: string[] = []

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i)
      const textContent = await page.getTextContent()
      if (!textContent || !textContent.items) {
        continue
      }
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
      textParts.push(pageText)
    }

    return textParts.join('\n')

  } catch (err) {
    logger.error({
      message: err instanceof Error ? err.message : 'Unknown',
      event: 'CV upload — pdfjs-dist failed'
    })
    throw new Error('Échec de l\'extraction PDF avec les deux parsers disponibles')
  }
}
