#!/usr/bin/env python3
"""
Trajectoire - Apply Unified Design System to all pages
Polish all pages to create one cohesive luxury product
"""

import os
import re
from pathlib import Path

# ═══════════════════ CONFIGURATION ═══════════════════
PAGES_TO_UPDATE = [
    'index.html',
    'inscription/index.html',
    'connexion/index.html',
    'dashboard/index.html',
    'dashboard/cv/index.html',
    'simulations/index.html',
    'debrief/index.html',
    'progression/index.html',
    'historique/index.html',
    'abonnement/index.html',
    'profil/index.html',
    'parametres.html',
    'notifications.html',
    'facturation.html',
    'credits.html',
    'aide.html',
    'historique-simulations.html',
    'historique-ats.html',
    'historique-cv.html',
    'plan-progression.html',
]

# ═══════════════════ APPLY UNIFIED DESIGN ═══════════════════
def update_page(page_path):
    """Update a single page with unified design system"""
    if not os.path.exists(page_path):
        print(f"⚠️  Skipping {page_path} (not found)")
        return False
    
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add unified CSS link if not present
    if 'unified-styles.css' not in content:
        # Find the closing </head> tag
        head_close_pos = content.find('</head>')
        if head_close_pos != -1:
            css_link = '\n    <link rel="stylesheet" href="../unified-styles.css">\n'
            content = content[:head_close_pos] + css_link + content[head_close_pos:]
    
    # Add unified JS link if not present
    if 'unified-scripts.js' not in content:
        # Find the closing </body> tag
        body_close_pos = content.find('</body>')
        if body_close_pos != -1:
            js_link = '\n    <script src="../unified-scripts.js"></script>\n'
            content = content[:body_close_pos] + js_link + content[body_close_pos:]
    
    # Save updated content
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

# ═══════════════════ ADD LOADING SKELETONS ═══════════════════
def add_loading_skeletons(page_path):
    """Add loading skeleton examples to page"""
    if not os.path.exists(page_path):
        return False
    
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already has skeletons
    if 'skeleton' in content:
        return True
    
    # Add skeleton examples before closing </body>
    skeleton_html = """
    <!-- Loading Skeletons (Examples) -->
    <template id="skeleton-card">
        <div class="card">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
        </div>
    </template>
    
    <template id="skeleton-table">
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th><div class="skeleton" style="width: 60px; height: 12px;"></div></th>
                        <th><div class="skeleton" style="width: 80px; height: 12px;"></div></th>
                        <th><div class="skeleton" style="width: 100px; height: 12px;"></div></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><div class="skeleton" style="width: 80px; height: 16px;"></div></td>
                        <td><div class="skeleton" style="width: 120px; height: 16px;"></div></td>
                        <td><div class="skeleton" style="width: 100px; height: 16px;"></div></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </template>
"""
    
    body_close_pos = content.find('</body>')
    if body_close_pos != -1:
        content = content[:body_close_pos] + skeleton_html + content[body_close_pos:]
    
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

# ═══════════════════ ADD EMPTY STATES ═══════════════════
def add_empty_states(page_path):
    """Add empty state examples to page"""
    if not os.path.exists(page_path):
        return False
    
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already has empty states
    if 'empty-state' in content:
        return True
    
    # Add empty state examples before closing </body>
    empty_state_html = """
    <!-- Empty States (Examples) -->
    <template id="empty-state-example">
        <div class="empty-state">
            <div class="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
            </div>
            <h3>Aucun élément pour le moment</h3>
            <p>Commencez par créer votre premier élément pour voir les résultats ici.</p>
            <button class="btn btn-primary">Commencer</button>
        </div>
    </template>
"""
    
    body_close_pos = content.find('</body>')
    if body_close_pos != -1:
        content = content[:body_close_pos] + empty_state_html + content[body_close_pos:]
    
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

# ═══════════════════ MAIN ═══════════════════
print("🎨 Applying Unified Design System to all pages...")
print("=" * 80)

updated_count = 0
skipped_count = 0

for page in PAGES_TO_UPDATE:
    print(f"\n📄 Processing {page}...")
    
    if update_page(page):
        print(f"  ✅ Updated with unified CSS and JS")
        add_loading_skeletons(page)
        print(f"  ✅ Added loading skeletons")
        add_empty_states(page)
        print(f"  ✅ Added empty states")
        updated_count += 1
    else:
        skipped_count += 1

print("\n" + "=" * 80)
print(f"✅ Unified Design System applied successfully!")
print(f"\n📊 Summary:")
print(f"  • Pages updated: {updated_count}")
print(f"  • Pages skipped: {skipped_count}")
print(f"\n✨ Features applied:")
print(f"  • Unified CSS with design tokens")
print(f"  • Unified JavaScript with interactions")
print(f"  • Loading skeletons")
print(f"  • Empty states")
print(f"  • Smooth animations")
print(f"  • Accessibility AA")
print(f"  • Responsive design")
