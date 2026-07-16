#!/usr/bin/env python3
"""Update debrief/index.html with Progression and Historique links"""

# Read the file
with open('debrief/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update sidebar to add Progression and Historique links
old_sidebar = '''<a href="../debrief/index.html" class="sidebar-link active"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>Débrief</a></div>'''

new_sidebar = '''<a href="../debrief/index.html" class="sidebar-link active"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>Débrief</a><a href="../progression/index.html" class="sidebar-link"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>Progression</a><a href="../historique/index.html" class="sidebar-link"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Historique</a></div>'''

content = content.replace(old_sidebar, new_sidebar)

# Add CTA to progression before the closing body tag
cta_html = '''
    <!-- CTA to Progression -->
    <div style="margin-top: 48px; text-align: center; padding: 32px; background: linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(30, 64, 175, 0.02) 100%); border-radius: 16px;">
        <h3 style="font-size: 24px; margin-bottom: 12px; color: #111827;">Prêt à suivre votre progression ?</h3>
        <p style="font-size: 16px; color: #6B7280; margin-bottom: 24px;">Consultez votre évolution et vos objectifs personnalisés.</p>
        <a href="../progression/index.html" class="btn btn-primary" style="display: inline-flex; padding: 12px 32px; font-size: 16px;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 20px; height: 20px; margin-right: 8px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
            Voir ma progression
        </a>
    </div>
'''

# Find the closing main tag and add CTA before it
content = content.replace('</main>', cta_html + '\n    </main>')

# Write back
with open('debrief/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Updated debrief/index.html with Progression and Historique links")
