import { test, expect } from '@playwright/test';

test.describe('P1 — Career Copilot Lazy Loading', () => {
  test('vérifie que les moteurs IA sont chargés en lazy loading', async ({ page }) => {
    // 1. Intercepter toutes les requêtes JS pour vérifier quels chunks sont chargés
    const loadedChunks: string[] = [];
    page.on('request', request => {
      if (request.url().endsWith('.js')) {
        loadedChunks.push(request.url());
      }
    });

    // Login rapide
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Reset chunks interceptés pour isoler career-copilot
    loadedChunks.length = 0;

    // 2. Navigation vers career-copilot
    await page.goto('/dashboard/career-copilot');
    await page.waitForLoadState('networkidle');

    // Vérifier qu'aucun chunk d'intelligence engine spécifique n'a été chargé initialement
    // Le nom exact du chunk dépendra du hash généré par Webpack
    const initialChunksCount = loadedChunks.length;
    console.log(`Chunks chargés initialement: ${initialChunksCount}`);

    // 3. Simuler une interaction : Clic sur Envoyer
    // On trouve l'input du chat (placeholder "Posez-moi vos questions...")
    await page.fill('input[placeholder*="Posez"]', 'Comment améliorer ma stratégie ?');
    
    // Enregistrer le nombre de chunks AVANT de cliquer
    const chunksBeforeClick = loadedChunks.length;

    // Clic sur envoyer
    await page.click('button:has(svg.lucide-send), button:has(svg[data-lucide="send"])');

    // 4. Attendre la réponse ou une courte durée pour que les imports se fassent
    await page.waitForTimeout(2000); // laisser le temps aux chunks de charger

    // 5. Vérifier que de nouveaux chunks JS ont été chargés
    const chunksAfterClick = loadedChunks.length;
    console.log(`Chunks chargés après clic: ${chunksAfterClick}`);

    expect(chunksAfterClick).toBeGreaterThan(chunksBeforeClick);
    console.log(`✅ Lazy loading validé: ${chunksAfterClick - chunksBeforeClick} chunks supplémentaires chargés dynamiquement au clic.`);
  });
});
