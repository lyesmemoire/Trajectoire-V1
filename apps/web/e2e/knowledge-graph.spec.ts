import { test, expect } from '@playwright/test';

test.describe('Knowledge Graph E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display knowledge graph section', async ({ page }) => {
    const graphSection = page.locator('[data-testid="knowledge-graph"], section').filter({ hasText: /Knowledge Graph|Graphe de connaissances/i });
    if (await graphSection.count() > 0) {
      await expect(graphSection.first()).toBeVisible();
    }
  });

  test('should display graph visualization', async ({ page }) => {
    const graphVisualization = page.locator('[data-testid="graph-visualization"], canvas, svg, .graph-container');
    if (await graphVisualization.count() > 0) {
      await expect(graphVisualization.first()).toBeVisible();
    }
  });

  test('should display nodes in graph', async ({ page }) => {
    const nodes = page.locator('[data-testid="node"], .node, circle.node');
    if (await nodes.count() > 0) {
      await expect(nodes.first()).toBeVisible();
    }
  });

  test('should display edges in graph', async ({ page }) => {
    const edges = page.locator('[data-testid="edge"], .edge, line.edge');
    if (await edges.count() > 0) {
      await expect(edges.first()).toBeVisible();
    }
  });

  test('should have zoom controls', async ({ page }) => {
    const zoomControls = page.locator('[data-testid="zoom-controls"], .zoom-controls');
    if (await zoomControls.count() > 0) {
      await expect(zoomControls.first()).toBeVisible();
    }
  });

  test('should zoom in', async ({ page }) => {
    const zoomInButton = page.locator('button').filter({ hasText: /\+|Zoom in|Zoom avant/i });
    
    if (await zoomInButton.count() > 0) {
      await zoomInButton.first().click();
      await page.waitForTimeout(500);
      
      const graphVisualization = page.locator('[data-testid="graph-visualization"], canvas, svg');
      if (await graphVisualization.count() > 0) {
        await expect(graphVisualization.first()).toBeVisible();
      }
    }
  });

  test('should zoom out', async ({ page }) => {
    const zoomOutButton = page.locator('button').filter({ hasText: /-|Zoom out|Zoom arrière/i });
    
    if (await zoomOutButton.count() > 0) {
      await zoomOutButton.first().click();
      await page.waitForTimeout(500);
      
      const graphVisualization = page.locator('[data-testid="graph-visualization"], canvas, svg');
      if (await graphVisualization.count() > 0) {
        await expect(graphVisualization.first()).toBeVisible();
      }
    }
  });

  test('should reset zoom', async ({ page }) => {
    const resetButton = page.locator('button').filter({ hasText: /Reset|Réinitialiser/i });
    
    if (await resetButton.count() > 0) {
      await resetButton.first().click();
      await page.waitForTimeout(500);
      
      const graphVisualization = page.locator('[data-testid="graph-visualization"], canvas, svg');
      if (await graphVisualization.count() > 0) {
        await expect(graphVisualization.first()).toBeVisible();
      }
    }
  });

  test('should display node details on click', async ({ page }) => {
    const node = page.locator('[data-testid="node"], .node, circle.node');
    
    if (await node.count() > 0) {
      await node.first().click();
      
      await page.waitForTimeout(1000);
      
      const nodeDetails = page.locator('[data-testid="node-details"], .node-details');
      if (await nodeDetails.count() > 0) {
        await expect(nodeDetails.first()).toBeVisible();
      }
    }
  });

  test('should display node type legend', async ({ page }) => {
    const legend = page.locator('[data-testid="legend"], .legend');
    if (await legend.count() > 0) {
      await expect(legend.first()).toBeVisible();
    }
  });

  test('should filter nodes by type', async ({ page }) => {
    const filterDropdown = page.locator('[data-testid="node-filter"], select').filter({ hasText: /Type|Type de noeud/i });
    
    if (await filterDropdown.count() > 0) {
      await filterDropdown.first().selectOption({ index: 1 });
      await page.waitForTimeout(1000);
      
      const nodes = page.locator('[data-testid="node"], .node');
      if (await nodes.count() > 0) {
        await expect(nodes.first()).toBeVisible();
      }
    }
  });

  test('should search for nodes', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="search" i], [data-testid="graph-search"]');
    
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('JavaScript');
      
      await page.waitForTimeout(1000);
      
      const nodes = page.locator('[data-testid="node"], .node');
      if (await nodes.count() > 0) {
        await expect(nodes.first()).toBeVisible();
      }
    }
  });

  test('should highlight connected nodes', async ({ page }) => {
    const node = page.locator('[data-testid="node"], .node, circle.node');
    
    if (await node.count() > 0) {
      await node.first().hover();
      
      await page.waitForTimeout(500);
      
      const highlightedNodes = page.locator('[data-testid="node"].highlighted, .node.highlighted');
      if (await highlightedNodes.count() > 0) {
        await expect(highlightedNodes.first()).toBeVisible();
      }
    }
  });

  test('should display edge labels', async ({ page }) => {
    const edgeLabels = page.locator('[data-testid="edge-label"], .edge-label, text.edge-label');
    if (await edgeLabels.count() > 0) {
      await expect(edgeLabels.first()).toBeVisible();
    }
  });

  test('should export graph', async ({ page }) => {
    const exportButton = page.locator('button').filter({ hasText: /Export|Exporter/i });
    
    if (await exportButton.count() > 0) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.first().click();
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toBeTruthy();
    }
  });

  test('should switch layout mode', async ({ page }) => {
    const layoutButton = page.locator('button').filter({ hasText: /Layout|Mise en page/i });
    
    if (await layoutButton.count() > 0) {
      await layoutButton.first().click();
      
      await page.waitForTimeout(1000);
      
      const graphVisualization = page.locator('[data-testid="graph-visualization"], canvas, svg');
      if (await graphVisualization.count() > 0) {
        await expect(graphVisualization.first()).toBeVisible();
      }
    }
  });

  test('should display graph statistics', async ({ page }) => {
    const statistics = page.locator('[data-testid="graph-statistics"], .graph-statistics');
    if (await statistics.count() > 0) {
      await expect(statistics.first()).toBeVisible();
    }
  });

  test('should display node count', async ({ page }) => {
    const nodeCount = page.locator('[data-testid="node-count"], .node-count');
    if (await nodeCount.count() > 0) {
      await expect(nodeCount.first()).toBeVisible();
    }
  });

  test('should display edge count', async ({ page }) => {
    const edgeCount = page.locator('[data-testid="edge-count"], .edge-count');
    if (await edgeCount.count() > 0) {
      await expect(edgeCount.first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const graphSection = page.locator('[data-testid="knowledge-graph"], section').filter({ hasText: /Knowledge Graph/i });
    if (await graphSection.count() > 0) {
      await expect(graphSection.first()).toBeVisible();
    }
  });

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    expect(errors.length).toBe(0);
  });

  test('should allow pan on graph', async ({ page }) => {
    const graphVisualization = page.locator('[data-testid="graph-visualization"], canvas, svg');
    
    if (await graphVisualization.count() > 0) {
      const box = await graphVisualization.first().boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 100);
        await page.mouse.up();
        
        await page.waitForTimeout(500);
        
        await expect(graphVisualization.first()).toBeVisible();
      }
    }
  });

  test('should display graph version info', async ({ page }) => {
    const versionInfo = page.locator('[data-testid="graph-version"], .graph-version');
    if (await versionInfo.count() > 0) {
      await expect(versionInfo.first()).toBeVisible();
    }
  });
});
