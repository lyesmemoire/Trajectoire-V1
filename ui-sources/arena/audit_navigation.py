#!/usr/bin/env python3
"""Audit navigation links across all pages"""

import re
import os

pages_to_check = [
    'index.html',
    'inscription/index.html',
    'connexion/index.html',
    'dashboard/index.html',
    'dashboard/cv/index.html',
    'simulations/index.html',
    'debrief/index.html',
    'progression/index.html',
    'historique/index.html'
]

critical_links = {
    'index.html': [
        ('inscription/index.html', 'Inscription'),
        ('connexion/index.html', 'Connexion')
    ],
    'inscription/index.html': [
        ('../connexion/index.html', 'Login link'),
        ('../dashboard/index.html', 'Redirect after signup')
    ],
    'connexion/index.html': [
        ('../inscription/index.html', 'Signup link'),
        ('../dashboard/index.html', 'Redirect after login')
    ],
    'dashboard/index.html': [
        ('../dashboard/cv/index.html', 'CV page'),
        ('../simulations/index.html', 'Simulations'),
        ('../debrief/index.html', 'Debriefs'),
        ('../progression/index.html', 'Progression'),
        ('../historique/index.html', 'Historique')
    ],
    'dashboard/cv/index.html': [
        ('../../simulations/index.html', 'Go to simulations'),
        ('../../dashboard/index.html', 'Back to dashboard')
    ],
    'simulations/index.html': [
        ('../debrief/index.html', 'Go to debrief'),
        ('../dashboard/index.html', 'Back to dashboard')
    ],
    'debrief/index.html': [
        ('../progression/index.html', 'Go to progression'),
        ('../dashboard/index.html', 'Back to dashboard')
    ],
    'progression/index.html': [
        ('../simulations/index.html', 'New simulation'),
        ('../dashboard/index.html', 'Back to dashboard')
    ],
    'historique/index.html': [
        ('../dashboard/index.html', 'Back to dashboard')
    ]
}

def check_link_exists(page_path, link_path):
    """Check if a linked file exists"""
    page_dir = os.path.dirname(page_path)
    if page_dir:
        full_path = os.path.join(page_dir, link_path)
    else:
        full_path = link_path
    
    # Normalize path
    full_path = os.path.normpath(full_path)
    return os.path.exists(full_path)

def audit_page(page_path, expected_links):
    """Audit a single page for expected links"""
    if not os.path.exists(page_path):
        return f"❌ Page not found: {page_path}", []
    
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    successes = []
    
    for link_path, description in expected_links:
        # Check if link exists in HTML
        if f'href="{link_path}"' in content or f"href='{link_path}'" in content:
            # Check if target file exists
            if check_link_exists(page_path, link_path):
                successes.append(f"  ✓ {description}: {link_path}")
            else:
                issues.append(f"  ❌ {description}: Link found but target file missing: {link_path}")
        else:
            issues.append(f"  ⚠️  {description}: Link not found in HTML: {link_path}")
    
    return issues, successes

print("=" * 80)
print("NAVIGATION AUDIT REPORT")
print("=" * 80)
print()

total_issues = 0
total_successes = 0

for page in pages_to_check:
    if page in critical_links:
        print(f"📄 {page}")
        issues, successes = audit_page(page, critical_links[page])
        
        for success in successes:
            print(success)
            total_successes += 1
        
        for issue in issues:
            print(issue)
            total_issues += 1
        
        print()

print("=" * 80)
print(f"SUMMARY: {total_successes} links OK, {total_issues} issues found")
print("=" * 80)

if total_issues == 0:
    print("✅ All navigation links are correct!")
else:
    print(f"⚠️  {total_issues} issues need attention")
