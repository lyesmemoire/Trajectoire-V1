#!/usr/bin/env python3
"""
AUDIT COMPLET DU SITE TRAJECTOIRE
Vérifie TOUTES les routes, boutons, liens, navigation, breadcrumbs, CTA, redirections
"""

import os
import re
from pathlib import Path

# ═══════════════════ CONFIGURATION ═══════════════════
BASE_DIR = Path('/home/user')

# Toutes les pages à auditer
PAGES_TO_AUDIT = [
    'index.html',
    'inscription/index.html',
    'connexion/index.html',
    'dashboard/index.html',
    'dashboard/cv/index.html',
    'simulations/index.html',
    'debrief/index.html',
    'progression/index.html',
    'historique/index.html',
    'carriere/index.html',
    'cv/index.html',
    'interview/index.html',
    'abonnement/index.html',
    'profil/index.html',
    'ressources/index.html',
]

# Parcours utilisateur attendu
USER_JOURNEY = [
    ('Homepage', 'index.html'),
    ('Inscription', 'inscription/index.html'),
    ('Connexion', 'connexion/index.html'),
    ('Dashboard', 'dashboard/index.html'),
    ('Mon CV', 'dashboard/cv/index.html'),
    ('Simulations', 'simulations/index.html'),
    ('Débrief', 'debrief/index.html'),
    ('Progression', 'progression/index.html'),
    ('Historique', 'historique/index.html'),
    ('Abonnement', 'abonnement/index.html'),
    ('Profil', 'profil/index.html'),
]

# Liens critiques à vérifier
CRITICAL_LINKS = {
    'index.html': [
        ('inscription/index.html', 'Créer un compte'),
        ('connexion/index.html', 'Se connecter'),
    ],
    'inscription/index.html': [
        ('../connexion/index.html', 'Déjà inscrit ?'),
        ('../dashboard/index.html', 'Redirect après inscription'),
    ],
    'connexion/index.html': [
        ('../inscription/index.html', 'Pas encore de compte ?'),
        ('../dashboard/index.html', 'Redirect après connexion'),
    ],
    'dashboard/index.html': [
        ('../dashboard/cv/index.html', 'Mon CV'),
        ('../simulations/index.html', 'Simulations'),
        ('../debrief/index.html', 'Débrief'),
        ('../progression/index.html', 'Progression'),
        ('../historique/index.html', 'Historique'),
        ('../abonnement/index.html', 'Abonnement'),
        ('../profil/index.html', 'Profil'),
        ('../connexion/index.html', 'Déconnexion'),
    ],
    'dashboard/cv/index.html': [
        ('../../simulations/index.html', 'Lancer simulation'),
        ('../../dashboard/index.html', 'Retour dashboard'),
    ],
    'simulations/index.html': [
        ('../debrief/index.html', 'Voir débrief'),
    ],
    'debrief/index.html': [
        ('../progression/index.html', 'Voir progression'),
        ('../dashboard/index.html', 'Retour dashboard'),
    ],
    'progression/index.html': [
        ('../simulations/index.html', 'Nouvelle simulation'),
        ('../dashboard/index.html', 'Retour dashboard'),
    ],
    'historique/index.html': [
        ('../dashboard/index.html', 'Retour dashboard'),
        ('../simulations/index.html', 'Nouvelle simulation'),
    ],
}

# ═══════════════════ FONCTIONS D'AUDIT ═══════════════════

def extract_links(html_content):
    """Extrait tous les liens href du HTML"""
    pattern = r'href=["\']([^"\']+)["\']'
    return re.findall(pattern, html_content)

def extract_buttons(html_content):
    """Extrait tous les boutons du HTML"""
    # Boutons avec onclick
    onclick_pattern = r'<button[^>]*onclick=["\']([^"\']+)["\'][^>]*>'
    # Boutons avec type="submit"
    submit_pattern = r'<button[^>]*type=["\']submit["\'][^>]*>'
    # Boutons simples
    button_pattern = r'<button[^>]*>'
    
    onclicks = re.findall(onclick_pattern, html_content)
    submits = re.findall(submit_pattern, html_content)
    buttons = re.findall(button_pattern, html_content)
    
    return {
        'onclick': onclicks,
        'submit': submits,
        'all': buttons
    }

def extract_redirects(html_content):
    """Extrait toutes les redirections JavaScript"""
    patterns = [
        r'window\.location\.href\s*=\s*["\']([^"\']+)["\']',
        r'window\.location\s*=\s*["\']([^"\']+)["\']',
        r'window\.location\.replace\(["\']([^"\']+)["\']\)',
        r'window\.location\.assign\(["\']([^"\']+)["\']\)',
    ]
    
    redirects = []
    for pattern in patterns:
        redirects.extend(re.findall(pattern, html_content))
    
    return redirects

def check_link_exists(page_path, link_path):
    """Vérifie si un lien pointe vers un fichier existant"""
    page_dir = Path(page_path).parent
    target_path = (page_dir / link_path).resolve()
    
    # Normaliser le chemin
    try:
        target_path = target_path.relative_to(BASE_DIR)
        return (BASE_DIR / target_path).exists()
    except ValueError:
        return False

def check_breadcrumbs(html_content, page_name):
    """Vérifie la présence et la validité des breadcrumbs"""
    breadcrumb_pattern = r'class=["\']breadcrumb[^"\']*["\']'
    has_breadcrumb = bool(re.search(breadcrumb_pattern, html_content))
    
    if has_breadcrumb:
        links = extract_links(html_content)
        breadcrumb_links = [l for l in links if 'dashboard' in l or l == '../' or l == '../../']
        return {
            'present': True,
            'links': breadcrumb_links
        }
    
    return {'present': False, 'links': []}

def check_sidebar(html_content):
    """Vérifie la présence et la cohérence de la sidebar"""
    sidebar_pattern = r'class=["\']sidebar[^"\']*["\']'
    has_sidebar = bool(re.search(sidebar_pattern, html_content))
    
    if has_sidebar:
        links = extract_links(html_content)
        sidebar_links = [l for l in links if any(keyword in l for keyword in ['dashboard', 'cv', 'simulations', 'debrief', 'progression', 'historique', 'abonnement', 'profil'])]
        return {
            'present': True,
            'links': sidebar_links
        }
    
    return {'present': False, 'links': []}

def check_cta_buttons(html_content):
    """Vérifie les boutons CTA principaux"""
    cta_patterns = [
        r'class=["\'][^"\']*btn-primary[^"\']*["\']',
        r'class=["\'][^"\']*cta[^"\']*["\']',
    ]
    
    ctas = []
    for pattern in cta_patterns:
        matches = re.findall(pattern, html_content)
        ctas.extend(matches)
    
    return ctas

def audit_page(page_path):
    """Audit complet d'une page"""
    full_path = BASE_DIR / page_path
    
    if not full_path.exists():
        return {
            'exists': False,
            'error': 'Page non trouvée'
        }
    
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extraire toutes les informations
    links = extract_links(content)
    buttons = extract_buttons(content)
    redirects = extract_redirects(content)
    breadcrumbs = check_breadcrumbs(content, page_path)
    sidebar = check_sidebar(content)
    ctas = check_cta_buttons(content)
    
    # Vérifier les liens critiques
    critical_issues = []
    if page_path in CRITICAL_LINKS:
        for link, description in CRITICAL_LINKS[page_path]:
            # Vérifier si le lien existe dans le HTML
            if link not in content:
                # Vérifier si c'est une redirection JS
                if link not in redirects:
                    critical_issues.append({
                        'link': link,
                        'description': description,
                        'issue': 'Lien manquant dans HTML et pas de redirection JS'
                    })
    
    return {
        'exists': True,
        'links': links,
        'buttons': buttons,
        'redirects': redirects,
        'breadcrumbs': breadcrumbs,
        'sidebar': sidebar,
        'ctas': ctas,
        'critical_issues': critical_issues,
        'size': len(content)
    }

# ═══════════════════ EXÉCUTION DE L'AUDIT ═══════════════════

print("=" * 80)
print("AUDIT COMPLET DU SITE TRAJECTOIRE")
print("=" * 80)
print()

# 1. Vérifier l'existence de toutes les pages
print("1. VÉRIFICATION DE L'EXISTENCE DES PAGES")
print("-" * 80)
missing_pages = []
for page_name, page_path in USER_JOURNEY:
    full_path = BASE_DIR / page_path
    exists = full_path.exists()
    status = "✅" if exists else "❌"
    print(f"{status} {page_name:20s} ({page_path})")
    if not exists:
        missing_pages.append((page_name, page_path))

print()

# 2. Audit détaillé de chaque page
print("2. AUDIT DÉTAILLÉ DE CHAQUE PAGE")
print("-" * 80)

all_issues = []

for page_path in PAGES_TO_AUDIT:
    full_path = BASE_DIR / page_path
    if not full_path.exists():
        print(f"\n❌ {page_path} - PAGE NON TROUVÉE")
        all_issues.append(f"Page manquante: {page_path}")
        continue
    
    result = audit_page(page_path)
    
    print(f"\n📄 {page_path}")
    print(f"   Taille: {result['size']:,} bytes")
    print(f"   Liens: {len(result['links'])}")
    print(f"   Boutons: {len(result['buttons']['all'])}")
    print(f"   Redirects JS: {len(result['redirects'])}")
    print(f"   Breadcrumbs: {'✅' if result['breadcrumbs']['present'] else '❌'}")
    print(f"   Sidebar: {'✅' if result['sidebar']['present'] else '❌'}")
    print(f"   CTAs: {len(result['ctas'])}")
    
    if result['critical_issues']:
        print(f"   ⚠️  PROBLÈMES CRITIQUES:")
        for issue in result['critical_issues']:
            print(f"      - {issue['description']}: {issue['issue']}")
            all_issues.append(f"{page_path}: {issue['description']}")

print()

# 3. Vérification des redirections JavaScript
print("3. VÉRIFICATION DES REDIRECTIONS JAVASCRIPT")
print("-" * 80)

redirect_pages = [
    ('inscription/index.html', '../dashboard/index.html'),
    ('connexion/index.html', '../dashboard/index.html'),
]

for page_path, expected_redirect in redirect_pages:
    full_path = BASE_DIR / page_path
    if full_path.exists():
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        redirects = extract_redirects(content)
        has_redirect = expected_redirect in redirects
        
        status = "✅" if has_redirect else "❌"
        print(f"{status} {page_path}")
        print(f"   Redirect attendu: {expected_redirect}")
        print(f"   Redirects trouvés: {len(redirects)}")
        
        if not has_redirect:
            all_issues.append(f"{page_path}: Redirection vers {expected_redirect} manquante")

print()

# 4. Résumé des problèmes
print("4. RÉSUMÉ DES PROBLÈMES")
print("-" * 80)

if all_issues:
    print(f"⚠️  {len(all_issues)} problème(s) détecté(s):\n")
    for i, issue in enumerate(all_issues, 1):
        print(f"   {i}. {issue}")
else:
    print("✅ Aucun problème détecté !")

print()

# 5. Parcours utilisateur complet
print("5. PARCOURS UTILISATEUR COMPLET")
print("-" * 80)

print("\nParcours attendu:")
for i, (page_name, page_path) in enumerate(USER_JOURNEY, 1):
    full_path = BASE_DIR / page_path
    exists = full_path.exists()
    status = "✅" if exists else "❌"
    print(f"{i:2d}. {status} {page_name}")

print()
print("=" * 80)
print("FIN DE L'AUDIT")
print("=" * 80)

if all_issues:
    print(f"\n⚠️  {len(all_issues)} problème(s) à corriger avant de continuer.")
    print("\nListe des problèmes à corriger:")
    for i, issue in enumerate(all_issues, 1):
        print(f"{i}. {issue}")
else:
    print("\n✅ Tous les audits sont passés ! Le site est prêt.")
