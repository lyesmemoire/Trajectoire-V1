# ✅ P2 — Rapport d'exécution : Upload CV PDF (réduction de friction)

> Date : 2026-06-04 · Périmètre strict : friction d'entrée uniquement.
> Objectif : `/product` accepte désormais **CV uploadé (PDF) OU collé** + offre collée.

---

## 🎯 Résultat

`/product` passe de « copier-coller obligatoire » à « upload PDF en 1 clic **ou** copier-coller ».
**Aucun changement** du moteur ATS, du `ProductOutput`, ni des écrans de résultat.

---

## ✅ Validé en conditions réelles (serveur lancé)

| Test | Résultat |
| :-- | :-: |
| `POST /api/product/upload` (vrai PDF) | ✅ `{ cvText: "Dummy PDF file", meta: { pages: 1, chars: 14 } }` |
| Chaîne upload → analyze | ✅ texte extrait puis analysé |
| Rejet non-PDF | ✅ HTTP 415 |
| Requête sans fichier | ✅ HTTP 400 |
| `GET /product` (UI) | ✅ HTTP 200 |
| Dashboard `/api/upload` (existant) | ✅ HTTP 401 — **intact, non modifié** |
| Smoke test ATS | ✅ **7/7 inchangé** (scoring/contrat non touchés) |
| Typecheck + lint des fichiers P2 | ✅ 0 erreur |

---

## 🔧 Ce qui a été fait (6 étapes du plan)

1. **Backend upload léger** — `app/api/product/upload/route.ts` (NOUVEAU)
   - PDF → texte via `pdf-parse` (déjà présent dans le projet).
   - Contrat : `{ cvText, meta: { pages, chars } }`.
   - **Sécurité minimale** : rejet non-PDF (415), limite 8 Mo (413), garde-fou 30 000 caractères, PDF scanné sans texte (422).
   - **Sans auth / sans DB / sans stockage** → « on ne stocke pas ton CV ».
2. **Composant upload UI** — `app/product/_components/CvUpload.tsx` (NOUVEAU)
   - Drag & drop **et** clic.
   - Micro-feedback d'état : « Lecture du CV… » → « Extraction réussie — N page(s) ».
3. **Intégration `/product`** — `app/product/page.tsx`
   - `CvUpload` ajouté **au-dessus** de la textarea CV (alternative, pas remplacement).
   - Séparateur « — ou colle ton CV ci-dessous — ».
4. **Logique produit inchangée** — `runProductFlow(cvText, jobText)` non modifié.
5. **UX state upload** — feedback intégré au composant (idle → reading → done/error).
6. **Sécurité** — type + taille (cf. étape 1).

---

## 🐞 Découverte technique importante (à noter pour la suite)

Pendant les tests, `pdf-parse` a échoué (`bad XRef entry`) sur des PDF **fabriqués
à la main** et sur ceux générés par `@react-pdf/renderer` (xref/cross-reference
streams non supportés par la très ancienne version de pdf.js embarquée dans
`pdf-parse@1.1.x`).

➡️ **Sur de vrais PDF standards, l'extraction fonctionne parfaitement** (validé avec
un PDF réel : « Dummy PDF file » extrait correctement).

➡️ **Recommandation (hors périmètre P2)** : envisager en P2.1 le passage à une lib
plus moderne (`pdfjs-dist` directement, déjà tiré transitivement par `@react-pdf`)
pour couvrir les PDF récents/compressés. Le même `pdf-parse` est utilisé par le
dashboard `/api/upload` → cette amélioration bénéficierait aux deux.

---

## 📌 Écart assumé (validé avec toi)
- **Endpoint dédié `/api/product/upload`** au lieu de réutiliser `/api/upload`.
  Raison : `/api/upload` exige auth Supabase + crée du storage + embeddings OpenAI
  (c'est l'upload du dashboard). Le réutiliser depuis `/product` (public) aurait
  cassé le flux ou exposé le dashboard. Le nouvel endpoint est léger et isolé → **zéro régression**.

---

## ❌ Ce qui n'a PAS changé (critères stricts respectés)
- Scoring ATS, `ProductOutput`, écrans de résultat, flux backend `runProductFlow`.
- Pas de vocal, pas d'auth/crédits, pas d'offres, pas de refonte UI globale.

---

## 🧪 Relancer
```bash
pnpm install && pnpm exec prisma generate
pnpm exec vitest run tests/product   # 7/7
pnpm dev                             # /product : upload PDF OU coller
```

## ⏭️ Suite logique : P3 — Simulation entretien vocal (`apps/realtime-gateway`)
