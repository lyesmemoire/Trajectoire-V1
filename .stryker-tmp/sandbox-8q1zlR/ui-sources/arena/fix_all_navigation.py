#!/usr/bin/env python3
"""Fix navigation links across all pages"""

import re

def fix_file(filepath, replacements):
    """Fix links in a file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Fixed {filepath}")

# Fix dashboard/cv/index.html
# From dashboard/cv/, we need to go up 2 levels to reach root pages
fix_file('dashboard/cv/index.html', [
    # Sidebar links
    ('<a href="../dashboard/index.html"', '<a href="../index.html"'),  # Logo and Dashboard
    ('<a href="../simulations/index.html"', '<a href="../../simulations/index.html"'),
    ('<a href="../debrief/index.html"', '<a href="../../debrief/index.html"'),
    ('<a href="../carriere/index.html"', '<a href="../../carriere/index.html"'),
    ('<a href="../abonnement/index.html"', '<a href="../../abonnement/index.html"'),
    ('<a href="../profil/index.html"', '<a href="../../profil/index.html"'),
    # CTA button
    ('<a href="../simulations/index.html" class="btn btn-primary btn-lg">', '<a href="../../simulations/index.html" class="btn btn-primary btn-lg">'),
    # Logout
    ('<a href="../connexion/index.html"', '<a href="../../connexion/index.html"'),
])

# Fix simulations/index.html
# From simulations/, we need to go up 1 level to reach dashboard/
fix_file('simulations/index.html', [
    ('<a href="../dashboard/index.html"', '<a href="../dashboard/index.html"'),  # Already correct
])

# Fix debrief/index.html
# From debrief/, we need to go up 1 level to reach other root pages
fix_file('debrief/index.html', [
    ('<a href="../progression/index.html"', '<a href="../progression/index.html"'),  # Already correct
])

# Add missing links to simulations/index.html
with open('simulations/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Check if the link to debrief exists after interview ends
if '../debrief/index.html' not in content:
    # Add it to the end screen
    content = content.replace(
        '<div class="end-content">',
        '<div class="end-content">\n                <a href="../debrief/index.html" class="btn btn-primary" style="margin-top: 20px;">Voir mon débrief</a>'
    )
    with open('simulations/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✓ Added debrief link to simulations/index.html")

# Add missing link to debrief/index.html
with open('debrief/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Check if the link to progression exists
if '../progression/index.html' not in content:
    # Add it to the CTA section
    content = content.replace(
        '<div class="final-cta-buttons">',
        '<div class="final-cta-buttons">\n                    <a href="../progression/index.html" class="btn btn-primary btn-lg">Voir ma progression</a>'
    )
    with open('debrief/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✓ Added progression link to debrief/index.html")

print("\n✅ All navigation links fixed!")
