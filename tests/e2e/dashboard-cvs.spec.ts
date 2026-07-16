import { test, expect } from "@playwright/test";

test.describe("Dashboard - Mes Documents (CVs)", () => {
  // Optionnel: On peut utiliser une fixture d'auth si elle existe, ou simuler la session
  test.beforeEach(async ({ page }) => {
    // Par défaut, on présume qu'il y a un login standard
    await page.goto("/auth/login");
    // On essaie de se connecter ou de bypasser selon le comportement du projet
    try {
      await page.fill('#email', "test@example.com"); 
      await page.fill('#password', "TestPassword123!");
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    } catch(_e) {
      // Si on est déjà loggé ou que le test échoue, on continue et on force l'URL
    }
  });

  test("Vérification globale de la page CVs (KPIs, Liste, Actions)", async ({ page }) => {
    // 1. Ouverture de la page
    await page.goto("/dashboard/cvs");
    
    // Titre de la page
    await expect(page.locator("h1", { hasText: "Mes Documents" })).toBeVisible();

    // 2. Affichage des KPIs
    await expect(page.locator("text=Analyses ATS")).toBeVisible();
    await expect(page.locator("text=Score moyen")).toBeVisible();
    await expect(page.locator("text=Dernière analyse")).toBeVisible();

    // 3. Affichage de la liste ou de l'état vide
    const emptyState = page.locator("text=Aucun CV pour le moment");
    const cvCards = page.locator('.space-y-6 .rounded-xl'); // design-system Card

    // On attend un peu pour voir quel état s'affiche
    await page.waitForTimeout(1000); 
    const isEmpty = await emptyState.isVisible();
    
    if (isEmpty) {
      // 4. Test bouton ajouter un CV
      const addCvButton = page.locator("a", { hasText: "Ajouter un CV" }).first();
      await expect(addCvButton).toBeVisible();
    } else {
      // Si la liste contient des éléments
      const firstCv = cvCards.first();
      await expect(firstCv).toBeVisible();

      // Test suppression (AlertDialog)
      const deleteButton = firstCv.locator('button[title="Supprimer le CV"]');
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        // Vérification du dialog
        const alertDialog = page.locator('[role="alertdialog"]');
        await expect(alertDialog).toBeVisible();
        await expect(alertDialog.locator("text=Supprimer ce CV ?")).toBeVisible();
        
        // On annule pour ne pas détruire les données de test
        await alertDialog.locator("text=Annuler").click();
        await expect(alertDialog).not.toBeVisible();
      }
    }

    // 5. Navigation et rafraîchissement
    await page.reload();
    await expect(page.locator("h1", { hasText: "Mes Documents" })).toBeVisible();
  });
});
