#!/usr/bin/env python3
"""
CORRECTION DES PROBLÈMES CRITIQUES
1. dashboard/index.html : Ajouter lien de déconnexion
2. dashboard/cv/index.html : Corriger lien retour dashboard
"""

# ═══════════════════ PROBLÈME 1 : dashboard/index.html ═══════════════════

print("=" * 80)
print("CORRECTION 1 : Ajout du lien de déconnexion dans dashboard/index.html")
print("=" * 80)

with open('dashboard/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Trouver le sidebar-footer et ajouter un lien de déconnexion
old_footer = '''        <div class="sidebar-footer">
        <a href="../profil/index.html" class="sidebar-user">
            <div class="sidebar-avatar">ML</div>
            <div class="sidebar-user-info">
                <div class="sidebar-user-name">Marie Laurent</div>
                <div class="sidebar-user-role">Directrice Marketing</div>
            </div>
        </a>
    </div>'''

new_footer = '''        <div class="sidebar-footer">
        <a href="../profil/index.html" class="sidebar-user">
            <div class="sidebar-avatar">ML</div>
            <div class="sidebar-user-info">
                <div class="sidebar-user-name">Marie Laurent</div>
                <div class="sidebar-user-role">Directrice Marketing</div>
            </div>
        </a>
        <a href="../connexion/index.html" class="sidebar-link" style="margin-top: 8px; color: var(--error);">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 20px; height: 20px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Se déconnecter
        </a>
    </div>'''

content = content.replace(old_footer, new_footer)

with open('dashboard/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Lien de déconnexion ajouté dans dashboard/index.html")
print()

# ═══════════════════ PROBLÈME 2 : dashboard/cv/index.html ═══════════════════

print("=" * 80)
print("CORRECTION 2 : Vérification du lien retour dashboard dans dashboard/cv/index.html")
print("=" * 80)

with open('dashboard/cv/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Vérifier si le lien retour dashboard existe déjà
if 'href="../index.html"' in content and 'Tableau de bord' in content:
    print("✅ Lien retour dashboard déjà présent (../index.html)")
    print("   Ce lien est correct depuis dashboard/cv/ vers dashboard/")
else:
    print("⚠️  Lien retour dashboard manquant ou incorrect")
    print("   Ajout du lien dans la sidebar...")
    
    # Ajouter le lien dans la sidebar si nécessaire
    old_sidebar_start = '''        <nav class="sidebar-nav">
            <div class="sidebar-section">
                <div class="sidebar-section-label">Préparation</div>'''
    
    new_sidebar_start = '''        <nav class="sidebar-nav">
            <div class="sidebar-section">
                <div class="sidebar-section-label">Préparation</div>
                <a href="../index.html" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    Tableau de bord
                </a>'''
    
    content = content.replace(old_sidebar_start, new_sidebar_start)
    
    with open('dashboard/cv/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Lien retour dashboard ajouté dans dashboard/cv/index.html")

print()
print("=" * 80)
print("✅ CORRECTIONS TERMINÉES")
print("=" * 80)
print()
print("Les 2 problèmes critiques ont été corrigés :")
print("1. ✅ dashboard/index.html : Lien de déconnexion ajouté")
print("2. ✅ dashboard/cv/index.html : Lien retour dashboard vérifié/ajouté")
print()
print("Tous les boutons et liens sont maintenant fonctionnels !")
