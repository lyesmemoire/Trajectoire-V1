#!/usr/bin/env python3
"""
Trajectoire — Multi-page Web Application Generator
Generates all independent pages with consistent design system.
"""
import os

# ── Read base64 images ──────────────────────────────────────────────
with open('/tmp/hero_b64.txt', 'r') as f:
    hero_b64 = f.read().strip()
with open('/tmp/founder_b64.txt', 'r') as f:
    founder_b64 = f.read().strip()
with open('/tmp/signup_b64.txt', 'r') as f:
    signup_b64 = f.read().strip()

# ── Shared CSS Variables & Base Styles ──────────────────────────────
CSS_VARIABLES = """
        :root {
            --bg: #F8F6F3;
            --card: #FFFFFF;
            --text-primary: #111827;
            --text-secondary: #6B7280;
            --blue-primary: #1E40AF;
            --blue-hover: #2563EB;
            --gold-accent: #D4AF37;
            --border: #E5E7EB;
            --success: #16A34A;
            --error: #DC2626;
            --radius: 12px;
            --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
            --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04);
            --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04);
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --sidebar-width: 260px;
        }
"""

HEAD_COMMON = """
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
"""


# ═══════════════════════════════════════════════════════════════════
# 1. HOMEPAGE — /index.html
# ═══════════════════════════════════════════════════════════════════

def generate_homepage():
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
    {HEAD_COMMON}
    <meta name="description" content="Trajectoire — Préparez vos entretiens stratégiques avec méthode. Coaching premium pour cadres et dirigeants.">
    <title>Trajectoire | Préparation d'entretiens pour cadres dirigeants</title>
    <style>
        {CSS_VARIABLES}
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        html {{ scroll-behavior: smooth; }}
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: var(--bg);
            color: var(--text-primary);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }}
        h1,h2,h3,h4,h5,h6 {{
            font-family: 'Playfair Display', Georgia, serif;
            font-weight: 600; line-height: 1.2; letter-spacing: -0.02em;
        }}
        .container {{ max-width: 1280px; margin: 0 auto; padding: 0 24px; }}

        /* NAV */
        nav {{
            position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
            background: rgba(248,246,243,0.8);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
            transition: var(--transition);
        }}
        nav.scrolled {{ background: rgba(248,246,243,0.95); box-shadow: var(--shadow-sm); }}
        .nav-container {{
            max-width: 1280px; margin: 0 auto; padding: 16px 24px;
            display: flex; align-items: center; justify-content: space-between;
        }}
        .logo {{
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 24px; font-weight: 700; color: var(--text-primary);
            text-decoration: none; letter-spacing: -0.02em;
        }}
        .nav-menu {{ display: flex; gap: 32px; list-style: none; }}
        .nav-menu a {{
            color: var(--text-secondary); text-decoration: none;
            font-size: 15px; font-weight: 500; transition: var(--transition);
        }}
        .nav-menu a:hover {{ color: var(--text-primary); }}
        .nav-actions {{ display: flex; gap: 16px; align-items: center; }}
        .btn {{
            display: inline-flex; align-items: center; justify-content: center;
            padding: 12px 24px; border-radius: var(--radius);
            font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600;
            text-decoration: none; transition: var(--transition);
            cursor: pointer; border: none;
        }}
        .btn-ghost {{ background: transparent; color: var(--text-primary); }}
        .btn-ghost:hover {{ background: rgba(17,24,39,0.05); }}
        .btn-primary {{ background: var(--blue-primary); color: white; }}
        .btn-primary:hover {{
            background: var(--blue-hover); transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }}
        .btn-secondary {{
            background: var(--card); color: var(--text-primary);
            border: 1px solid var(--border);
        }}
        .btn-secondary:hover {{ background: var(--bg); border-color: var(--text-secondary); }}

        /* HERO */
        .hero {{ padding: 140px 0 80px; background: linear-gradient(180deg, var(--bg) 0%, rgba(248,246,243,0) 100%); }}
        .hero-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }}
        .hero-content h1 {{ font-size: 56px; line-height: 1.1; margin-bottom: 24px; }}
        .hero-content p {{ font-size: 18px; line-height: 1.7; color: var(--text-secondary); margin-bottom: 40px; max-width: 520px; }}
        .hero-buttons {{ display: flex; gap: 16px; margin-bottom: 48px; }}
        .trust-indicators {{ display: flex; gap: 32px; padding-top: 32px; border-top: 1px solid var(--border); }}
        .trust-item {{ display: flex; align-items: center; gap: 12px; }}
        .trust-icon {{ width: 20px; height: 20px; color: var(--success); }}
        .trust-text {{ font-size: 14px; color: var(--text-secondary); font-weight: 500; }}
        .hero-image img {{
            width: 100%; height: auto; border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
        }}

        /* STATS */
        .stats {{ padding: 80px 0; background: var(--card); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }}
        .stats-grid {{ display: grid; grid-template-columns: repeat(3,1fr); gap: 64px; }}
        .stat-item {{ text-align: center; }}
        .stat-number {{ font-family: 'Playfair Display', Georgia, serif; font-size: 48px; font-weight: 700; color: var(--blue-primary); margin-bottom: 12px; line-height: 1; }}
        .stat-label {{ font-size: 16px; color: var(--text-secondary); font-weight: 500; line-height: 1.5; }}

        /* SECTIONS */
        section {{ padding: 120px 0; }}
        .section-header {{ text-align: center; max-width: 680px; margin: 0 auto 80px; }}
        .section-label {{ display: inline-block; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--blue-primary); margin-bottom: 16px; }}
        .section-title {{ font-size: 42px; margin-bottom: 20px; }}
        .section-subtitle {{ font-size: 18px; color: var(--text-secondary); line-height: 1.7; }}

        /* WHY */
        .why-grid {{ display: grid; grid-template-columns: repeat(3,1fr); gap: 32px; }}
        .why-card {{
            background: var(--card); padding: 40px 32px; border-radius: var(--radius);
            border: 1px solid var(--border); transition: var(--transition);
        }}
        .why-card:hover {{ border-color: var(--blue-primary); box-shadow: var(--shadow-md); transform: translateY(-4px); }}
        .why-icon {{ width: 48px; height: 48px; background: rgba(30,64,175,0.08); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }}
        .why-icon svg {{ width: 24px; height: 24px; color: var(--blue-primary); }}
        .why-card h3 {{ font-size: 24px; margin-bottom: 16px; }}
        .why-card p {{ font-size: 16px; color: var(--text-secondary); line-height: 1.7; }}

        /* PROCESS */
        .process {{ background: var(--card); }}
        .timeline {{ max-width: 800px; margin: 0 auto; position: relative; }}
        .timeline::before {{ content: ''; position: absolute; left: 32px; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, var(--blue-primary) 0%, var(--border) 100%); }}
        .timeline-item {{ position: relative; padding-left: 88px; padding-bottom: 64px; }}
        .timeline-item:last-child {{ padding-bottom: 0; }}
        .timeline-number {{ position: absolute; left: 0; width: 64px; height: 64px; background: var(--blue-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; box-shadow: var(--shadow-md); }}
        .timeline-content h3 {{ font-size: 28px; margin-bottom: 12px; }}
        .timeline-content p {{ font-size: 16px; color: var(--text-secondary); line-height: 1.7; }}

        /* SKILLS */
        .skills-grid {{ display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }}
        .skill-card {{ background: var(--card); padding: 32px; border-radius: var(--radius); border: 1px solid var(--border); text-align: center; transition: var(--transition); }}
        .skill-card:hover {{ transform: translateY(-2px); box-shadow: var(--shadow-md); }}
        .skill-icon {{ width: 56px; height: 56px; margin: 0 auto 20px; background: rgba(212,175,55,0.1); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; }}
        .skill-icon svg {{ width: 28px; height: 28px; color: var(--gold-accent); }}
        .skill-card h3 {{ font-size: 20px; margin-bottom: 8px; }}

        /* TYPES */
        .types-grid {{ display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }}
        .type-card {{ background: var(--card); padding: 32px 24px; border-radius: var(--radius); border: 1px solid var(--border); text-align: center; transition: var(--transition); }}
        .type-card:hover {{ border-color: var(--blue-primary); background: rgba(30,64,175,0.02); }}
        .type-card h3 {{ font-size: 18px; font-weight: 600; }}

        /* TRUST */
        .trust {{ background: var(--card); text-align: center; }}
        .trust-content {{ max-width: 720px; margin: 0 auto; }}
        .trust-content p {{ font-size: 20px; color: var(--text-secondary); line-height: 1.7; font-style: italic; }}

        /* ABOUT */
        .about-grid {{ display: grid; grid-template-columns: 1fr 1.5fr; gap: 80px; align-items: center; }}
        .about-image img {{ width: 100%; height: auto; border-radius: var(--radius); box-shadow: var(--shadow-md); }}
        .about-content h2 {{ font-size: 36px; margin-bottom: 24px; }}
        .about-content p {{ font-size: 17px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 20px; }}
        .about-signature {{ margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border); }}
        .about-signature strong {{ display: block; font-size: 18px; margin-bottom: 4px; }}
        .about-signature span {{ font-size: 15px; color: var(--text-secondary); }}

        /* FAQ */
        .faq {{ background: var(--card); }}
        .faq-list {{ max-width: 800px; margin: 0 auto; }}
        .faq-item {{ border-bottom: 1px solid var(--border); }}
        .faq-question {{ width: 100%; padding: 24px 0; background: none; border: none; text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; font-size: 18px; font-weight: 600; color: var(--text-primary); transition: var(--transition); }}
        .faq-question:hover {{ color: var(--blue-primary); }}
        .faq-icon {{ width: 24px; height: 24px; transition: var(--transition); flex-shrink: 0; }}
        .faq-item.active .faq-icon {{ transform: rotate(45deg); }}
        .faq-answer {{ max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }}
        .faq-answer-content {{ padding: 0 0 24px 0; font-size: 16px; color: var(--text-secondary); line-height: 1.7; }}

        /* FINAL CTA */
        .final-cta {{ text-align: center; background: linear-gradient(180deg, var(--bg) 0%, rgba(30,64,175,0.03) 100%); }}
        .final-cta h2 {{ font-size: 48px; margin-bottom: 40px; max-width: 720px; margin-left: auto; margin-right: auto; }}
        .final-cta-buttons {{ display: flex; gap: 16px; justify-content: center; }}

        /* FOOTER */
        footer {{ background: var(--text-primary); color: white; padding: 80px 0 40px; }}
        .footer-grid {{ display: grid; grid-template-columns: 2fr repeat(4,1fr); gap: 64px; margin-bottom: 64px; }}
        .footer-brand p {{ font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.7; margin-top: 16px; max-width: 320px; }}
        .footer-column h4 {{ font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px; color: rgba(255,255,255,0.9); }}
        .footer-column ul {{ list-style: none; }}
        .footer-column li {{ margin-bottom: 12px; }}
        .footer-column a {{ color: rgba(255,255,255,0.7); text-decoration: none; font-size: 15px; transition: var(--transition); }}
        .footer-column a:hover {{ color: white; }}
        .footer-bottom {{ padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; }}
        .footer-bottom p {{ font-size: 14px; color: rgba(255,255,255,0.5); }}
        .social-link {{ color: rgba(255,255,255,0.7); transition: var(--transition); }}
        .social-link:hover {{ color: white; }}

        /* ANIMATIONS */
        .fade-in {{ opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }}
        .fade-in.visible {{ opacity: 1; transform: translateY(0); }}

        /* RESPONSIVE */
        @media (max-width: 1024px) {{
            .hero-grid {{ grid-template-columns: 1fr; gap: 48px; }}
            .hero-content h1 {{ font-size: 44px; }}
            .stats-grid {{ grid-template-columns: 1fr; gap: 40px; }}
            .why-grid, .skills-grid {{ grid-template-columns: 1fr; }}
            .types-grid {{ grid-template-columns: repeat(2,1fr); }}
            .about-grid {{ grid-template-columns: 1fr; gap: 48px; }}
            .footer-grid {{ grid-template-columns: 1fr 1fr; gap: 40px; }}
        }}
        @media (max-width: 768px) {{
            .nav-menu {{ display: none; }}
            .hero {{ padding: 100px 0 60px; }}
            .hero-content h1 {{ font-size: 36px; }}
            .hero-buttons {{ flex-direction: column; }}
            .trust-indicators {{ flex-direction: column; gap: 16px; }}
            section {{ padding: 80px 0; }}
            .section-title {{ font-size: 32px; }}
            .timeline::before {{ left: 24px; }}
            .timeline-number {{ width: 48px; height: 48px; font-size: 20px; }}
            .timeline-item {{ padding-left: 72px; }}
            .types-grid {{ grid-template-columns: 1fr; }}
            .final-cta h2 {{ font-size: 32px; }}
            .final-cta-buttons {{ flex-direction: column; }}
            .footer-grid {{ grid-template-columns: 1fr; }}
            .footer-bottom {{ flex-direction: column; gap: 20px; text-align: center; }}
        }}
    </style>
</head>
<body>
    <!-- NAVIGATION -->
    <nav id="navbar">
        <div class="nav-container">
            <a href="index.html" class="logo">Trajectoire</a>
            <ul class="nav-menu">
                <li><a href="#accueil">Accueil</a></li>
                <li><a href="#methode">Méthode</a></li>
                <li><a href="#accompagnement">Accompagnement</a></li>
                <li><a href="#tarifs">Tarifs</a></li>
                <li><a href="ressources/index.html">Ressources</a></li>
                <li><a href="#apropos">À propos</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <div class="nav-actions">
                <a href="connexion/index.html" class="btn btn-ghost">Connexion</a>
                <a href="inscription/index.html" class="btn btn-primary">Créer mon espace</a>
            </div>
        </div>
    </nav>

    <!-- HERO -->
    <section class="hero" id="accueil">
        <div class="container">
            <div class="hero-grid">
                <div class="hero-content fade-in">
                    <h1>Préparez vos entretiens stratégiques avec méthode.</h1>
                    <p>Préparez vos entretiens de management grâce à une approche structurée, des simulations réalistes et des retours personnalisés.</p>
                    <div class="hero-buttons">
                        <a href="inscription/index.html" class="btn btn-primary">Commencer maintenant</a>
                        <a href="#methode" class="btn btn-secondary">Découvrir la méthode</a>
                    </div>
                    <div class="trust-indicators">
                        <div class="trust-item">
                            <svg class="trust-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span class="trust-text">Confidentialité garantie</span>
                        </div>
                        <div class="trust-item">
                            <svg class="trust-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span class="trust-text">Accompagnement premium</span>
                        </div>
                        <div class="trust-item">
                            <svg class="trust-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span class="trust-text">Résultats mesurables</span>
                        </div>
                    </div>
                </div>
                <div class="hero-image fade-in">
                    <img src="data:image/jpeg;base64,{hero_b64}" alt="Cadre dirigeant préparant un entretien stratégique">
                </div>
            </div>
        </div>
    </section>

    <!-- STATS -->
    <section class="stats">
        <div class="container">
            <div class="stats-grid">
                <div class="stat-item fade-in"><div class="stat-number">+1800</div><div class="stat-label">cadres accompagnés</div></div>
                <div class="stat-item fade-in"><div class="stat-number">94%</div><div class="stat-label">déclarent être arrivés plus confiants</div></div>
                <div class="stat-item fade-in"><div class="stat-number">100%</div><div class="stat-label">Préparation adaptée à tous les niveaux de management</div></div>
            </div>
        </div>
    </section>

    <!-- WHY -->
    <section id="methode">
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-label">Notre approche</span>
                <h2 class="section-title">Pourquoi Trajectoire ?</h2>
                <p class="section-subtitle">Une méthode éprouvée pour transformer votre préparation en avantage décisif.</p>
            </div>
            <div class="why-grid">
                <div class="why-card fade-in">
                    <div class="why-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                    <h3>Méthode structurée</h3>
                    <p>Un cadre méthodologique rigoureux inspiré des meilleures pratiques du conseil en stratégie et du coaching exécutif.</p>
                </div>
                <div class="why-card fade-in">
                    <div class="why-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>
                    <h3>Simulations réalistes</h3>
                    <p>Des mises en situation immersives avec des coachs expérimentés qui reproduisent fidèlement la pression de l'entretien réel.</p>
                </div>
                <div class="why-card fade-in">
                    <div class="why-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></div>
                    <h3>Retours personnalisés</h3>
                    <p>Des analyses détaillées et des recommandations concrètes pour progresser rapidement et atteindre vos objectifs.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- PROCESS -->
    <section class="process">
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-label">Le processus</span>
                <h2 class="section-title">Comment ça fonctionne ?</h2>
                <p class="section-subtitle">Quatre étapes clés pour une préparation optimale.</p>
            </div>
            <div class="timeline">
                <div class="timeline-item fade-in"><div class="timeline-number">1</div><div class="timeline-content"><h3>Analyse</h3><p>Diagnostic approfondi de votre profil, de vos objectifs et du contexte spécifique de l'entretien.</p></div></div>
                <div class="timeline-item fade-in"><div class="timeline-number">2</div><div class="timeline-content"><h3>Préparation</h3><p>Construction d'une stratégie de communication sur mesure. Travail sur votre narrative et votre positionnement.</p></div></div>
                <div class="timeline-item fade-in"><div class="timeline-number">3</div><div class="timeline-content"><h3>Simulation</h3><p>Mises en situation réalistes avec des coachs expérimentés dans les conditions réelles de l'entretien.</p></div></div>
                <div class="timeline-item fade-in"><div class="timeline-number">4</div><div class="timeline-content"><h3>Débrief</h3><p>Analyse détaillée de votre performance. Recommandations actionnables et plan de progression personnalisé.</p></div></div>
            </div>
        </div>
    </section>

    <!-- SKILLS -->
    <section id="accompagnement">
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-label">Compétences développées</span>
                <h2 class="section-title">Ce que vous développez</h2>
                <p class="section-subtitle">Des compétences essentielles pour réussir vos entretiens et accélérer votre carrière.</p>
            </div>
            <div class="skills-grid">
                <div class="skill-card fade-in"><div class="skill-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div><h3>Leadership</h3></div>
                <div class="skill-card fade-in"><div class="skill-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg></div><h3>Communication</h3></div>
                <div class="skill-card fade-in"><div class="skill-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div><h3>Impact</h3></div>
                <div class="skill-card fade-in"><div class="skill-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div><h3>Gestion du stress</h3></div>
                <div class="skill-card fade-in"><div class="skill-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg></div><h3>Argumentation</h3></div>
                <div class="skill-card fade-in"><div class="skill-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></div><h3>Vision stratégique</h3></div>
            </div>
        </div>
    </section>

    <!-- TYPES -->
    <section>
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-label">Types d'entretiens</span>
                <h2 class="section-title">Pour quels entretiens ?</h2>
                <p class="section-subtitle">Une préparation adaptée à chaque contexte professionnel.</p>
            </div>
            <div class="types-grid">
                <div class="type-card fade-in"><h3>Comité exécutif</h3></div>
                <div class="type-card fade-in"><h3>Manager</h3></div>
                <div class="type-card fade-in"><h3>Directeur</h3></div>
                <div class="type-card fade-in"><h3>Conseil d'administration</h3></div>
                <div class="type-card fade-in"><h3>Conseil</h3></div>
                <div class="type-card fade-in"><h3>Promotion interne</h3></div>
                <div class="type-card fade-in"><h3>Entretien international</h3></div>
                <div class="type-card fade-in"><h3>Poste de direction</h3></div>
            </div>
        </div>
    </section>

    <!-- TRUST -->
    <section class="trust">
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-label">Ils nous font confiance</span>
                <h2 class="section-title">Une communauté exigeante</h2>
            </div>
            <div class="trust-content fade-in">
                <p>Cadres accompagnés issus de grands groupes, cabinets de conseil et entreprises en forte croissance.</p>
            </div>
        </div>
    </section>

    <!-- ABOUT -->
    <section id="apropos">
        <div class="container">
            <div class="about-grid">
                <div class="about-image fade-in">
                    <img src="data:image/jpeg;base64,{founder_b64}" alt="Portrait de la fondatrice de Trajectoire">
                </div>
                <div class="about-content fade-in">
                    <span class="section-label">À propos</span>
                    <h2>Une vision, une méthode, des résultats</h2>
                    <p>Après 15 ans d'expérience en conseil en stratégie et en coaching exécutif auprès de dirigeants de grands groupes, j'ai constaté un besoin crucial : celui d'une préparation rigoureuse et personnalisée aux entretiens stratégiques.</p>
                    <p>Trajectoire est née de cette conviction : chaque entretien important mérite une préparation à la hauteur des enjeux. Notre approche combine l'exigence du conseil en stratégie, la bienveillance du coaching et la précision de l'analyse comportementale.</p>
                    <p>Notre mission est simple : vous donner les moyens d'arriver confiant, préparé et performant lors de vos entretiens les plus décisifs.</p>
                    <div class="about-signature">
                        <strong>Marie Laurent</strong>
                        <span>Fondatrice &amp; Directrice Générale</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ -->
    <section class="faq" id="tarifs">
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-label">Questions fréquentes</span>
                <h2 class="section-title">Tout ce que vous devez savoir</h2>
            </div>
            <div class="faq-list">
                <div class="faq-item fade-in">
                    <button class="faq-question"><span>Combien de temps dure une préparation complète ?</span><svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
                    <div class="faq-answer"><div class="faq-answer-content">Une préparation complète s'étend généralement sur 2 à 4 semaines, selon la complexité de l'entretien et vos objectifs.</div></div>
                </div>
                <div class="faq-item fade-in">
                    <button class="faq-question"><span>Qui sont les coachs qui m'accompagnent ?</span><svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
                    <div class="faq-answer"><div class="faq-answer-content">Nos coachs sont d'anciens dirigeants, partenaires de cabinets de conseil ou DRH de grands groupes avec une certification en coaching exécutif.</div></div>
                </div>
                <div class="faq-item fade-in">
                    <button class="faq-question"><span>La confidentialité est-elle garantie ?</span><svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
                    <div class="faq-answer"><div class="faq-answer-content">Absolument. Toutes les informations partagées restent strictement confidentielles. Nous signons systématiquement des accords de confidentialité.</div></div>
                </div>
                <div class="faq-item fade-in">
                    <button class="faq-question"><span>Quels sont les tarifs ?</span><svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
                    <div class="faq-answer"><div class="faq-answer-content">Nos tarifs varient selon le niveau de personnalisation. Nous proposons des formules à partir de 1 500 € pour une préparation complète. Un devis détaillé vous est fourni après un premier échange.</div></div>
                </div>
            </div>
        </div>
    </section>

    <!-- FINAL CTA -->
    <section class="final-cta" id="contact">
        <div class="container">
            <h2 class="fade-in">Votre prochain entretien mérite une préparation à la hauteur.</h2>
            <div class="final-cta-buttons fade-in">
                <a href="inscription/index.html" class="btn btn-primary">Créer mon espace</a>
                <a href="connexion/index.html" class="btn btn-secondary">Réserver un échange</a>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="index.html" class="logo" style="color:white;">Trajectoire</a>
                    <p>La plateforme de préparation aux entretiens stratégiques pour cadres et dirigeants exigeants.</p>
                </div>
                <div class="footer-column"><h4>Produit</h4><ul><li><a href="#methode">Méthode</a></li><li><a href="#accompagnement">Accompagnement</a></li><li><a href="#tarifs">Tarifs</a></li><li><a href="#">Témoignages</a></li></ul></div>
                <div class="footer-column"><h4>Entreprise</h4><ul><li><a href="#apropos">À propos</a></li><li><a href="#">Carrières</a></li><li><a href="#">Presse</a></li><li><a href="#contact">Contact</a></li></ul></div>
                <div class="footer-column"><h4>Ressources</h4><ul><li><a href="ressources/index.html">Blog</a></li><li><a href="ressources/index.html">Guides</a></li><li><a href="#tarifs">FAQ</a></li><li><a href="#">Webinaires</a></li></ul></div>
                <div class="footer-column"><h4>Légal</h4><ul><li><a href="#">Mentions légales</a></li><li><a href="#">Confidentialité</a></li><li><a href="#">CGU</a></li><li><a href="#">Cookies</a></li></ul></div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Trajectoire. Tous droits réservés.</p>
                <a href="#" class="social-link" aria-label="LinkedIn"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            </div>
        </div>
    </footer>

    <script>
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {{
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }});
        const observer = new IntersectionObserver((entries) => {{
            entries.forEach(entry => {{ if (entry.isIntersecting) entry.target.classList.add('visible'); }});
        }}, {{ threshold: 0.1, rootMargin: '0px 0px -50px 0px' }});
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        document.querySelectorAll('.faq-question').forEach(button => {{
            button.addEventListener('click', () => {{
                const item = button.parentElement;
                const answer = item.querySelector('.faq-answer');
                const content = answer.querySelector('.faq-answer-content');
                const isActive = item.classList.contains('active');
                document.querySelectorAll('.faq-item').forEach(otherItem => {{
                    if (otherItem !== item) {{ otherItem.classList.remove('active'); otherItem.querySelector('.faq-answer').style.maxHeight = '0'; }}
                }});
                if (isActive) {{ item.classList.remove('active'); answer.style.maxHeight = '0'; }}
                else {{ item.classList.add('active'); answer.style.maxHeight = content.scrollHeight + 'px'; }}
            }});
        }});
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {{
            anchor.addEventListener('click', function(e) {{
                const href = this.getAttribute('href');
                if (href === '#') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) window.scrollTo({{ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' }});
            }});
        }});
    </script>
</body>
</html>'''


# ═══════════════════════════════════════════════════════════════════
# 2. INSCRIPTION — /inscription/index.html
# ═══════════════════════════════════════════════════════════════════

def generate_inscription():
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
    {HEAD_COMMON}
    <meta name="description" content="Trajectoire — Créez votre espace de préparation aux entretiens stratégiques.">
    <title>Créer mon espace | Trajectoire</title>
    <style>
        {CSS_VARIABLES}
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        html, body {{ height: 100%; }}
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg); color: var(--text-primary);
            line-height: 1.6; -webkit-font-smoothing: antialiased;
        }}
        .signup-page {{ display: flex; min-height: 100vh; }}
        .left-panel {{ width: 45%; position: relative; overflow: hidden; display: flex; align-items: flex-end; }}
        .left-panel img {{ position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; opacity: 0; transform: scale(1.05); animation: imageReveal 1.2s cubic-bezier(0.4,0,0.2,1) 0.1s forwards; }}
        @keyframes imageReveal {{ to {{ opacity: 1; transform: scale(1); }} }}
        .left-overlay {{ position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(17,24,39,0) 40%, rgba(17,24,39,0.55) 100%); z-index: 1; }}
        .left-content {{ position: relative; z-index: 2; padding: 48px; color: white; opacity: 0; transform: translateY(20px); animation: fadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.6s forwards; }}
        .left-quote {{ font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 500; line-height: 1.4; margin-bottom: 20px; max-width: 420px; opacity: 0.95; }}
        .left-author {{ font-size: 14px; font-weight: 500; opacity: 0.75; letter-spacing: 0.02em; }}
        .right-panel {{ width: 55%; display: flex; align-items: center; justify-content: center; padding: 48px; position: relative; }}
        .form-wrapper {{ width: 100%; max-width: 480px; }}
        .form-card {{ background: var(--card); border-radius: var(--radius); padding: 48px 40px; box-shadow: 0 4px 32px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04); border: 1px solid rgba(229,231,235,0.5); opacity: 0; transform: translateY(20px); animation: fadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s forwards; }}
        @keyframes fadeUp {{ to {{ opacity: 1; transform: translateY(0); }} }}
        .logo {{ font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 700; color: var(--text-primary); text-decoration: none; letter-spacing: -0.02em; display: inline-block; margin-bottom: 32px; }}
        .logo-dot {{ display: inline-block; width: 6px; height: 6px; background: var(--gold-accent); border-radius: 50%; margin-left: 2px; vertical-align: super; }}
        .form-headline {{ font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 600; line-height: 1.25; margin-bottom: 12px; letter-spacing: -0.02em; }}
        .form-subtitle {{ font-size: 15px; color: var(--text-secondary); line-height: 1.65; margin-bottom: 32px; }}
        .form-row {{ display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }}
        .form-group {{ margin-bottom: 20px; }}
        .form-label {{ display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.01em; }}
        .form-input {{ width: 100%; padding: 13px 16px; font-family: 'Inter', sans-serif; font-size: 15px; color: var(--text-primary); background: var(--bg); border: 1.5px solid var(--border); border-radius: 10px; outline: none; transition: var(--transition); }}
        .form-input::placeholder {{ color: #9CA3AF; }}
        .form-input:hover {{ border-color: #D1D5DB; }}
        .form-input:focus {{ border-color: var(--blue-primary); background: var(--card); box-shadow: 0 0 0 3px rgba(30,64,175,0.1); }}
        .form-input.error {{ border-color: var(--error); }}
        .password-wrapper {{ position: relative; }}
        .password-toggle {{ position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 4px; display: flex; transition: var(--transition); }}
        .password-toggle:hover {{ color: var(--text-primary); }}
        .password-toggle svg {{ width: 18px; height: 18px; }}
        .password-strength {{ display: flex; gap: 4px; margin-top: 8px; }}
        .strength-bar {{ flex: 1; height: 3px; background: var(--border); border-radius: 2px; transition: var(--transition); }}
        .strength-bar.active.weak {{ background: var(--error); }}
        .strength-bar.active.medium {{ background: var(--gold-accent); }}
        .strength-bar.active.strong {{ background: var(--success); }}
        .form-checkbox {{ display: flex; align-items: flex-start; gap: 12px; margin-bottom: 28px; cursor: pointer; }}
        .form-checkbox input {{ display: none; }}
        .checkbox-custom {{ width: 20px; height: 20px; min-width: 20px; border: 1.5px solid var(--border); border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: var(--transition); margin-top: 1px; background: var(--bg); }}
        .checkbox-custom svg {{ width: 12px; height: 12px; color: white; opacity: 0; transform: scale(0.8); transition: var(--transition); }}
        .form-checkbox input:checked + .checkbox-custom {{ background: var(--blue-primary); border-color: var(--blue-primary); }}
        .form-checkbox input:checked + .checkbox-custom svg {{ opacity: 1; transform: scale(1); }}
        .checkbox-text {{ font-size: 13px; color: var(--text-secondary); line-height: 1.5; }}
        .checkbox-text a {{ color: var(--blue-primary); text-decoration: none; font-weight: 500; }}
        .checkbox-text a:hover {{ text-decoration: underline; }}
        .btn-primary {{ width: 100%; padding: 15px 24px; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; color: white; background: var(--blue-primary); border: none; border-radius: 10px; cursor: pointer; transition: var(--transition); position: relative; overflow: hidden; }}
        .btn-primary:hover {{ background: var(--blue-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(30,64,175,0.25); }}
        .btn-primary:disabled {{ opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }}
        .btn-primary .btn-loader {{ display: none; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin: 0 auto; }}
        @keyframes spin {{ to {{ transform: rotate(360deg); }} }}
        .btn-primary.loading .btn-text {{ display: none; }}
        .btn-primary.loading .btn-loader {{ display: block; }}
        .divider {{ display: flex; align-items: center; gap: 16px; margin: 24px 0; }}
        .divider-line {{ flex: 1; height: 1px; background: var(--border); }}
        .divider-text {{ font-size: 13px; color: var(--text-secondary); font-weight: 500; }}
        .social-buttons {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }}
        .btn-social {{ display: flex; align-items: center; justify-content: center; gap: 10px; padding: 13px 16px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: var(--text-primary); background: var(--card); border: 1.5px solid var(--border); border-radius: 10px; cursor: pointer; transition: var(--transition); }}
        .btn-social:hover {{ border-color: #D1D5DB; background: var(--bg); }}
        .btn-social svg {{ width: 20px; height: 20px; flex-shrink: 0; }}
        .login-link {{ text-align: center; margin-top: 20px; font-size: 14px; color: var(--text-secondary); }}
        .login-link a {{ color: var(--blue-primary); text-decoration: none; font-weight: 600; }}
        .login-link a:hover {{ text-decoration: underline; }}
        .reassurance {{ text-align: center; margin-top: 28px; padding-top: 24px; border-top: 1px solid var(--border); }}
        .reassurance-items {{ display: flex; flex-direction: column; gap: 8px; }}
        .reassurance-item {{ display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; color: var(--text-secondary); }}
        .reassurance-item svg {{ width: 14px; height: 14px; color: var(--success); flex-shrink: 0; }}
        .signup-footer {{ position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; gap: 24px; }}
        .signup-footer a {{ font-size: 12px; color: var(--text-secondary); text-decoration: none; transition: var(--transition); opacity: 0.7; }}
        .signup-footer a:hover {{ opacity: 1; color: var(--text-primary); }}
        .field-error {{ font-size: 12px; color: var(--error); margin-top: 6px; display: none; }}
        .field-error.visible {{ display: block; }}

        @media (max-width: 1024px) {{
            .left-panel {{ width: 40%; }} .right-panel {{ width: 60%; padding: 36px; }}
            .left-quote {{ font-size: 22px; }} .left-content {{ padding: 36px; }}
        }}
        @media (max-width: 768px) {{
            .signup-page {{ flex-direction: column; }}
            .left-panel {{ width: 100%; height: 280px; min-height: 280px; }}
            .right-panel {{ width: 100%; padding: 24px; }}
            .form-card {{ padding: 32px 24px; box-shadow: none; border: none; background: transparent; }}
            .form-row {{ grid-template-columns: 1fr; gap: 0; }}
            .left-content {{ padding: 24px; }} .left-quote {{ font-size: 20px; }}
            .social-buttons {{ grid-template-columns: 1fr; }}
            .signup-footer {{ position: relative; bottom: auto; left: auto; transform: none; justify-content: center; padding: 24px 0 32px; }}
        }}
    </style>
</head>
<body>
    <div class="signup-page">
        <div class="left-panel">
            <img src="data:image/jpeg;base64,{signup_b64}" alt="Cadre dirigeant préparant sa stratégie d'entretien">
            <div class="left-overlay"></div>
            <div class="left-content">
                <p class="left-quote">« La préparation est la clé de toute réussite. Chaque entretien est une opportunité de démontrer votre valeur. »</p>
                <p class="left-author">— Philosophie Trajectoire</p>
            </div>
        </div>
        <div class="right-panel">
            <div class="form-wrapper">
                <div class="form-card">
                    <a href="../index.html" class="logo">Trajectoire<span class="logo-dot"></span></a>
                    <h1 class="form-headline">Créez votre espace de préparation.</h1>
                    <p class="form-subtitle">Commencez à préparer vos prochains entretiens avec une méthode structurée et un accompagnement personnalisé.</p>
                    <div class="social-buttons">
                        <button type="button" class="btn-social"><svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg><span>Google</span></button>
                        <button type="button" class="btn-social"><svg viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg><span>Microsoft</span></button>
                    </div>
                    <div class="divider"><div class="divider-line"></div><span class="divider-text">ou</span><div class="divider-line"></div></div>
                    <form id="signupForm" novalidate>
                        <div class="form-row">
                            <div class="form-group"><label class="form-label" for="firstName">Prénom</label><input type="text" id="firstName" class="form-input" placeholder="Marie" required><div class="field-error" id="firstNameError">Veuillez renseigner votre prénom.</div></div>
                            <div class="form-group"><label class="form-label" for="lastName">Nom</label><input type="text" id="lastName" class="form-input" placeholder="Laurent" required><div class="field-error" id="lastNameError">Veuillez renseigner votre nom.</div></div>
                        </div>
                        <div class="form-group"><label class="form-label" for="email">Adresse e-mail</label><input type="email" id="email" class="form-input" placeholder="marie.laurent@entreprise.fr" required><div class="field-error" id="emailError">Veuillez renseigner une adresse e-mail valide.</div></div>
                        <div class="form-group"><label class="form-label" for="password">Mot de passe</label><div class="password-wrapper"><input type="password" id="password" class="form-input" placeholder="Minimum 8 caractères" required minlength="8"><button type="button" class="password-toggle" id="togglePassword"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button></div><div class="password-strength"><div class="strength-bar" id="str1"></div><div class="strength-bar" id="str2"></div><div class="strength-bar" id="str3"></div><div class="strength-bar" id="str4"></div></div><div class="field-error" id="passwordError">Le mot de passe doit contenir au moins 8 caractères.</div></div>
                        <div class="form-group"><label class="form-label" for="confirmPassword">Confirmer le mot de passe</label><div class="password-wrapper"><input type="password" id="confirmPassword" class="form-input" placeholder="Retapez votre mot de passe" required><button type="button" class="password-toggle" id="toggleConfirmPassword"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button></div><div class="field-error" id="confirmPasswordError">Les mots de passe ne correspondent pas.</div></div>
                        <label class="form-checkbox"><input type="checkbox" id="terms" required><div class="checkbox-custom"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><span class="checkbox-text">J'accepte les <a href="#">Conditions Générales</a> et la <a href="#">Politique de confidentialité</a>.</span></label>
                        <button type="submit" class="btn-primary" id="submitBtn"><span class="btn-text">Créer mon espace</span><div class="btn-loader"></div></button>
                    </form>
                    <p class="login-link">Déjà inscrit ? <a href="../connexion/index.html">Se connecter</a></p>
                    <div class="reassurance"><div class="reassurance-items"><div class="reassurance-item"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg><span>Vos données restent confidentielles.</span></div><div class="reassurance-item"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg><span>Aucun engagement.</span></div></div></div>
                </div>
            </div>
            <div class="signup-footer"><a href="#">Mentions légales</a><a href="#">Confidentialité</a><a href="#">CGU</a></div>
        </div>
    </div>
    <script>
        function setupPasswordToggle(toggleId, inputId) {{
            document.getElementById(toggleId).addEventListener('click', () => {{
                const input = document.getElementById(inputId);
                input.type = input.type === 'password' ? 'text' : 'password';
            }});
        }}
        setupPasswordToggle('togglePassword', 'password');
        setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');
        const passwordInput = document.getElementById('password');
        const bars = [document.getElementById('str1'), document.getElementById('str2'), document.getElementById('str3'), document.getElementById('str4')];
        passwordInput.addEventListener('input', () => {{
            const val = passwordInput.value; let strength = 0;
            if (val.length >= 8) strength++;
            if (/[a-z]/.test(val) && /[A-Z]/.test(val)) strength++;
            if (/[0-9]/.test(val)) strength++;
            if (/[^a-zA-Z0-9]/.test(val)) strength++;
            const cls = strength <= 1 ? 'weak' : strength <= 2 ? 'medium' : 'strong';
            bars.forEach((bar, i) => {{ bar.classList.remove('active','weak','medium','strong'); if (i < strength) bar.classList.add('active', cls); }});
        }});
        const form = document.getElementById('signupForm');
        const submitBtn = document.getElementById('submitBtn');
        function showError(id, errId) {{ document.getElementById(id).classList.add('error'); document.getElementById(errId).classList.add('visible'); }}
        function clearError(id, errId) {{ document.getElementById(id).classList.remove('error'); document.getElementById(errId).classList.remove('visible'); }}
        ['firstName','lastName','email','password','confirmPassword'].forEach(id => {{
            document.getElementById(id).addEventListener('input', () => clearError(id, id + 'Error'));
        }});
        form.addEventListener('submit', (e) => {{
            e.preventDefault(); let valid = true;
            const fn = document.getElementById('firstName').value.trim();
            const ln = document.getElementById('lastName').value.trim();
            const em = document.getElementById('email').value.trim();
            const pw = document.getElementById('password').value;
            const cpw = document.getElementById('confirmPassword').value;
            if (!fn) {{ showError('firstName','firstNameError'); valid = false; }}
            if (!ln) {{ showError('lastName','lastNameError'); valid = false; }}
            if (!em || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(em)) {{ showError('email','emailError'); valid = false; }}
            if (pw.length < 8) {{ showError('password','passwordError'); valid = false; }}
            if (pw !== cpw) {{ showError('confirmPassword','confirmPasswordError'); valid = false; }}
            if (valid) {{
                submitBtn.classList.add('loading'); submitBtn.disabled = true;
                setTimeout(() => {{ window.location.href = '../dashboard/index.html'; }}, 1500);
            }}
        }});
    </script>
</body>
</html>'''


# ═══════════════════════════════════════════════════════════════════
# 3. CONNEXION — /connexion/index.html
# ═══════════════════════════════════════════════════════════════════

def generate_connexion():
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
    {HEAD_COMMON}
    <meta name="description" content="Trajectoire — Connectez-vous à votre espace de préparation.">
    <title>Connexion | Trajectoire</title>
    <style>
        {CSS_VARIABLES}
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        html, body {{ height: 100%; }}
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg); color: var(--text-primary);
            line-height: 1.6; -webkit-font-smoothing: antialiased;
        }}
        .login-page {{ display: flex; min-height: 100vh; }}
        .left-panel {{ width: 45%; position: relative; overflow: hidden; display: flex; align-items: flex-end; }}
        .left-panel img {{ position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; opacity: 0; transform: scale(1.05); animation: imageReveal 1.2s cubic-bezier(0.4,0,0.2,1) 0.1s forwards; }}
        @keyframes imageReveal {{ to {{ opacity: 1; transform: scale(1); }} }}
        .left-overlay {{ position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(17,24,39,0) 40%, rgba(17,24,39,0.55) 100%); z-index: 1; }}
        .left-content {{ position: relative; z-index: 2; padding: 48px; color: white; opacity: 0; transform: translateY(20px); animation: fadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.6s forwards; }}
        .left-quote {{ font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 500; line-height: 1.4; margin-bottom: 20px; max-width: 420px; opacity: 0.95; }}
        .left-author {{ font-size: 14px; font-weight: 500; opacity: 0.75; letter-spacing: 0.02em; }}
        .right-panel {{ width: 55%; display: flex; align-items: center; justify-content: center; padding: 48px; position: relative; }}
        .form-wrapper {{ width: 100%; max-width: 440px; }}
        .form-card {{ background: var(--card); border-radius: var(--radius); padding: 48px 40px; box-shadow: 0 4px 32px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04); border: 1px solid rgba(229,231,235,0.5); opacity: 0; transform: translateY(20px); animation: fadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s forwards; }}
        @keyframes fadeUp {{ to {{ opacity: 1; transform: translateY(0); }} }}
        .logo {{ font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 700; color: var(--text-primary); text-decoration: none; letter-spacing: -0.02em; display: inline-block; margin-bottom: 32px; }}
        .logo-dot {{ display: inline-block; width: 6px; height: 6px; background: var(--gold-accent); border-radius: 50%; margin-left: 2px; vertical-align: super; }}
        .form-headline {{ font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 600; line-height: 1.25; margin-bottom: 12px; letter-spacing: -0.02em; }}
        .form-subtitle {{ font-size: 15px; color: var(--text-secondary); line-height: 1.65; margin-bottom: 36px; }}
        .form-group {{ margin-bottom: 20px; }}
        .form-label {{ display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.01em; }}
        .form-input {{ width: 100%; padding: 13px 16px; font-family: 'Inter', sans-serif; font-size: 15px; color: var(--text-primary); background: var(--bg); border: 1.5px solid var(--border); border-radius: 10px; outline: none; transition: var(--transition); }}
        .form-input::placeholder {{ color: #9CA3AF; }}
        .form-input:hover {{ border-color: #D1D5DB; }}
        .form-input:focus {{ border-color: var(--blue-primary); background: var(--card); box-shadow: 0 0 0 3px rgba(30,64,175,0.1); }}
        .form-input.error {{ border-color: var(--error); }}
        .password-wrapper {{ position: relative; }}
        .password-toggle {{ position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 4px; display: flex; transition: var(--transition); }}
        .password-toggle:hover {{ color: var(--text-primary); }}
        .password-toggle svg {{ width: 18px; height: 18px; }}
        .form-row-actions {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }}
        .remember-me {{ display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: var(--text-secondary); }}
        .remember-me input {{ display: none; }}
        .remember-check {{ width: 18px; height: 18px; border: 1.5px solid var(--border); border-radius: 5px; display: flex; align-items: center; justify-content: center; transition: var(--transition); background: var(--bg); }}
        .remember-check svg {{ width: 10px; height: 10px; color: white; opacity: 0; transform: scale(0.8); transition: var(--transition); }}
        .remember-me input:checked + .remember-check {{ background: var(--blue-primary); border-color: var(--blue-primary); }}
        .remember-me input:checked + .remember-check svg {{ opacity: 1; transform: scale(1); }}
        .forgot-link {{ font-size: 13px; color: var(--blue-primary); text-decoration: none; font-weight: 500; }}
        .forgot-link:hover {{ text-decoration: underline; }}
        .btn-primary {{ width: 100%; padding: 15px 24px; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; color: white; background: var(--blue-primary); border: none; border-radius: 10px; cursor: pointer; transition: var(--transition); position: relative; overflow: hidden; }}
        .btn-primary:hover {{ background: var(--blue-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(30,64,175,0.25); }}
        .btn-primary:disabled {{ opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }}
        .btn-primary .btn-loader {{ display: none; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin: 0 auto; }}
        @keyframes spin {{ to {{ transform: rotate(360deg); }} }}
        .btn-primary.loading .btn-text {{ display: none; }}
        .btn-primary.loading .btn-loader {{ display: block; }}
        .divider {{ display: flex; align-items: center; gap: 16px; margin: 24px 0; }}
        .divider-line {{ flex: 1; height: 1px; background: var(--border); }}
        .divider-text {{ font-size: 13px; color: var(--text-secondary); font-weight: 500; }}
        .social-buttons {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }}
        .btn-social {{ display: flex; align-items: center; justify-content: center; gap: 10px; padding: 13px 16px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: var(--text-primary); background: var(--card); border: 1.5px solid var(--border); border-radius: 10px; cursor: pointer; transition: var(--transition); }}
        .btn-social:hover {{ border-color: #D1D5DB; background: var(--bg); }}
        .btn-social svg {{ width: 20px; height: 20px; flex-shrink: 0; }}
        .signup-link {{ text-align: center; margin-top: 20px; font-size: 14px; color: var(--text-secondary); }}
        .signup-link a {{ color: var(--blue-primary); text-decoration: none; font-weight: 600; }}
        .signup-link a:hover {{ text-decoration: underline; }}
        .login-footer {{ position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; gap: 24px; }}
        .login-footer a {{ font-size: 12px; color: var(--text-secondary); text-decoration: none; opacity: 0.7; }}
        .login-footer a:hover {{ opacity: 1; color: var(--text-primary); }}
        .field-error {{ font-size: 12px; color: var(--error); margin-top: 6px; display: none; }}
        .field-error.visible {{ display: block; }}

        @media (max-width: 1024px) {{
            .left-panel {{ width: 40%; }} .right-panel {{ width: 60%; padding: 36px; }}
            .left-quote {{ font-size: 22px; }} .left-content {{ padding: 36px; }}
        }}
        @media (max-width: 768px) {{
            .login-page {{ flex-direction: column; }}
            .left-panel {{ width: 100%; height: 280px; min-height: 280px; }}
            .right-panel {{ width: 100%; padding: 24px; }}
            .form-card {{ padding: 32px 24px; box-shadow: none; border: none; background: transparent; }}
            .social-buttons {{ grid-template-columns: 1fr; }}
            .login-footer {{ position: relative; bottom: auto; left: auto; transform: none; justify-content: center; padding: 24px 0 32px; }}
        }}
    </style>
</head>
<body>
    <div class="login-page">
        <div class="left-panel">
            <img src="data:image/jpeg;base64,{signup_b64}" alt="Cadre dirigeant dans un bureau premium">
            <div class="left-overlay"></div>
            <div class="left-content">
                <p class="left-quote">« Reprenez votre préparation là où vous l'avez laissée. Chaque session vous rapproche de votre objectif. »</p>
                <p class="left-author">— Trajectoire</p>
            </div>
        </div>
        <div class="right-panel">
            <div class="form-wrapper">
                <div class="form-card">
                    <a href="../index.html" class="logo">Trajectoire<span class="logo-dot"></span></a>
                    <h1 class="form-headline">Bon retour.</h1>
                    <p class="form-subtitle">Connectez-vous pour accéder à votre espace de préparation et poursuivre votre progression.</p>
                    <div class="social-buttons">
                        <button type="button" class="btn-social"><svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg><span>Google</span></button>
                        <button type="button" class="btn-social"><svg viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg><span>Microsoft</span></button>
                    </div>
                    <div class="divider"><div class="divider-line"></div><span class="divider-text">ou</span><div class="divider-line"></div></div>
                    <form id="loginForm" novalidate>
                        <div class="form-group"><label class="form-label" for="email">Adresse e-mail</label><input type="email" id="email" class="form-input" placeholder="marie.laurent@entreprise.fr" required><div class="field-error" id="emailError">Veuillez renseigner une adresse e-mail valide.</div></div>
                        <div class="form-group"><label class="form-label" for="password">Mot de passe</label><div class="password-wrapper"><input type="password" id="password" class="form-input" placeholder="Votre mot de passe" required><button type="button" class="password-toggle" id="togglePassword"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button></div><div class="field-error" id="passwordError">Veuillez renseigner votre mot de passe.</div></div>
                        <div class="form-row-actions">
                            <label class="remember-me"><input type="checkbox" checked><div class="remember-check"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><span>Se souvenir de moi</span></label>
                            <a href="#" class="forgot-link">Mot de passe oublié ?</a>
                        </div>
                        <button type="submit" class="btn-primary" id="submitBtn"><span class="btn-text">Se connecter</span><div class="btn-loader"></div></button>
                    </form>
                    <p class="signup-link">Pas encore de compte ? <a href="../inscription/index.html">Créer un compte</a></p>
                </div>
            </div>
            <div class="login-footer"><a href="#">Mentions légales</a><a href="#">Confidentialité</a><a href="#">CGU</a></div>
        </div>
    </div>
    <script>
        document.getElementById('togglePassword').addEventListener('click', () => {{
            const input = document.getElementById('password');
            input.type = input.type === 'password' ? 'text' : 'password';
        }});
        const form = document.getElementById('loginForm');
        const submitBtn = document.getElementById('submitBtn');
        function showError(id, errId) {{ document.getElementById(id).classList.add('error'); document.getElementById(errId).classList.add('visible'); }}
        function clearError(id, errId) {{ document.getElementById(id).classList.remove('error'); document.getElementById(errId).classList.remove('visible'); }}
        ['email','password'].forEach(id => {{
            document.getElementById(id).addEventListener('input', () => clearError(id, id + 'Error'));
        }});
        form.addEventListener('submit', (e) => {{
            e.preventDefault(); let valid = true;
            const em = document.getElementById('email').value.trim();
            const pw = document.getElementById('password').value;
            if (!em || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(em)) {{ showError('email','emailError'); valid = false; }}
            if (!pw) {{ showError('password','passwordError'); valid = false; }}
            if (valid) {{
                submitBtn.classList.add('loading'); submitBtn.disabled = true;
                setTimeout(() => {{ window.location.href = '../dashboard/index.html'; }}, 1500);
            }}
        }});
    </script>
</body>
</html>'''


# ═══════════════════════════════════════════════════════════════════
# 4-11. APP PAGES (Dashboard, CV, Carrière, etc.)
# ═══════════════════════════════════════════════════════════════════

def app_page_css():
    return f"""
        {CSS_VARIABLES}
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg); color: var(--text-primary);
            line-height: 1.6; -webkit-font-smoothing: antialiased;
        }}
        h1,h2,h3,h4 {{ font-family: 'Playfair Display', Georgia, serif; font-weight: 600; letter-spacing: -0.02em; }}
        .app-layout {{ display: flex; min-height: 100vh; }}

        /* SIDEBAR */
        .sidebar {{
            width: var(--sidebar-width); background: var(--card);
            border-right: 1px solid var(--border);
            display: flex; flex-direction: column;
            position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
        }}
        .sidebar-logo {{
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 20px; font-weight: 700; color: var(--text-primary);
            text-decoration: none; padding: 24px 24px 32px;
            display: block; letter-spacing: -0.02em;
        }}
        .sidebar-logo-dot {{ display: inline-block; width: 5px; height: 5px; background: var(--gold-accent); border-radius: 50%; margin-left: 2px; vertical-align: super; }}
        .sidebar-nav {{ flex: 1; padding: 0 12px; overflow-y: auto; }}
        .sidebar-section {{ margin-bottom: 24px; }}
        .sidebar-section-label {{ font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-secondary); padding: 0 12px; margin-bottom: 8px; }}
        .sidebar-link {{
            display: flex; align-items: center; gap: 12px;
            padding: 10px 12px; border-radius: 8px;
            font-size: 14px; font-weight: 500;
            color: var(--text-secondary); text-decoration: none;
            transition: var(--transition); margin-bottom: 2px;
        }}
        .sidebar-link:hover {{ background: var(--bg); color: var(--text-primary); }}
        .sidebar-link.active {{ background: rgba(30,64,175,0.08); color: var(--blue-primary); font-weight: 600; }}
        .sidebar-link svg {{ width: 20px; height: 20px; flex-shrink: 0; }}
        .sidebar-footer {{ padding: 16px 12px; border-top: 1px solid var(--border); }}
        .sidebar-user {{
            display: flex; align-items: center; gap: 12px;
            padding: 10px 12px; border-radius: 8px;
            text-decoration: none; transition: var(--transition);
        }}
        .sidebar-user:hover {{ background: var(--bg); }}
        .sidebar-avatar {{
            width: 36px; height: 36px; border-radius: 50%;
            background: var(--blue-primary); color: white;
            display: flex; align-items: center; justify-content: center;
            font-size: 14px; font-weight: 600; flex-shrink: 0;
        }}
        .sidebar-user-info {{ flex: 1; min-width: 0; }}
        .sidebar-user-name {{ font-size: 14px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }}
        .sidebar-user-role {{ font-size: 12px; color: var(--text-secondary); }}

        /* MAIN */
        .main-content {{ margin-left: var(--sidebar-width); flex: 1; min-height: 100vh; }}
        .top-bar {{
            padding: 16px 32px; background: var(--card);
            border-bottom: 1px solid var(--border);
            display: flex; align-items: center; justify-content: space-between;
        }}
        .top-bar-title {{ font-size: 14px; color: var(--text-secondary); font-weight: 500; }}
        .top-bar-actions {{ display: flex; gap: 12px; align-items: center; }}
        .btn {{ display: inline-flex; align-items: center; justify-content: center; padding: 10px 20px; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; transition: var(--transition); cursor: pointer; border: none; }}
        .btn-primary {{ background: var(--blue-primary); color: white; }}
        .btn-primary:hover {{ background: var(--blue-hover); transform: translateY(-1px); box-shadow: var(--shadow-md); }}
        .btn-secondary {{ background: var(--card); color: var(--text-primary); border: 1px solid var(--border); }}
        .btn-secondary:hover {{ background: var(--bg); }}
        .page-content {{ padding: 32px; max-width: 1200px; }}
        .page-header {{ margin-bottom: 32px; }}
        .page-header h1 {{ font-size: 32px; margin-bottom: 8px; }}
        .page-header p {{ font-size: 16px; color: var(--text-secondary); }}

        /* CARDS */
        .card {{ background: var(--card); border-radius: var(--radius); border: 1px solid var(--border); padding: 24px; transition: var(--transition); }}
        .card:hover {{ box-shadow: var(--shadow-sm); }}
        .stats-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }}
        .stat-card {{ background: var(--card); border-radius: var(--radius); border: 1px solid var(--border); padding: 24px; }}
        .stat-card-label {{ font-size: 13px; color: var(--text-secondary); font-weight: 500; margin-bottom: 8px; }}
        .stat-card-value {{ font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 700; color: var(--text-primary); }}
        .stat-card-change {{ font-size: 12px; color: var(--success); font-weight: 600; margin-top: 4px; }}

        .grid-2 {{ display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }}
        .grid-3 {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }}

        .card-header {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }}
        .card-title {{ font-size: 18px; font-weight: 600; }}
        .card-link {{ font-size: 13px; color: var(--blue-primary); text-decoration: none; font-weight: 500; }}
        .card-link:hover {{ text-decoration: underline; }}

        .list-item {{ display: flex; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--border); }}
        .list-item:last-child {{ border-bottom: none; }}
        .list-item-icon {{ width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }}
        .list-item-icon svg {{ width: 20px; height: 20px; }}
        .list-item-content {{ flex: 1; }}
        .list-item-title {{ font-size: 14px; font-weight: 600; margin-bottom: 2px; }}
        .list-item-desc {{ font-size: 13px; color: var(--text-secondary); }}
        .list-item-meta {{ font-size: 12px; color: var(--text-secondary); white-space: nowrap; }}
        .badge {{ display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }}
        .badge-blue {{ background: rgba(30,64,175,0.08); color: var(--blue-primary); }}
        .badge-green {{ background: rgba(22,163,74,0.08); color: var(--success); }}
        .badge-gold {{ background: rgba(212,175,55,0.1); color: #B8960C; }}

        .progress-bar {{ height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin-top: 8px; }}
        .progress-fill {{ height: 100%; border-radius: 3px; transition: width 0.8s ease; }}

        .empty-state {{ text-align: center; padding: 64px 32px; }}
        .empty-state svg {{ width: 48px; height: 48px; color: var(--text-secondary); margin-bottom: 16px; opacity: 0.5; }}
        .empty-state h3 {{ font-size: 20px; margin-bottom: 8px; }}
        .empty-state p {{ font-size: 15px; color: var(--text-secondary); margin-bottom: 24px; }}

        /* FADE */
        .fade-in {{ opacity: 0; transform: translateY(20px); animation: fadeUp 0.6s ease forwards; }}
        @keyframes fadeUp {{ to {{ opacity: 1; transform: translateY(0); }} }}
        .fade-in:nth-child(2) {{ animation-delay: 0.1s; }}
        .fade-in:nth-child(3) {{ animation-delay: 0.2s; }}
        .fade-in:nth-child(4) {{ animation-delay: 0.3s; }}

        @media (max-width: 1024px) {{
            .sidebar {{ display: none; }}
            .main-content {{ margin-left: 0; }}
            .stats-grid {{ grid-template-columns: repeat(2, 1fr); }}
            .grid-2, .grid-3 {{ grid-template-columns: 1fr; }}
        }}
    """

def sidebar_html(active_page):
    pages = [
        ('dashboard', 'Tableau de bord', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>'),
        ('cv', 'Mes CV', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'),
        ('carriere', 'Analyse de carrière', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>'),
        ('simulations', 'Simulations', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'),
        ('interview', 'Entretien en direct', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>'),
        ('debrief', 'Débrief', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>'),
    ]
    pages2 = [
        ('abonnement', 'Abonnement', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>'),
        ('profil', 'Profil', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>'),
        ('ressources', 'Ressources', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>'),
    ]
    
    nav_html = '<nav class="sidebar-nav">'
    nav_html += '<div class="sidebar-section"><div class="sidebar-section-label">Préparation</div>'
    for page_id, label, icon in pages:
        active = ' active' if page_id == active_page else ''
        nav_html += f'<a href="../{page_id}/index.html" class="sidebar-link{active}"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>{label}</a>'
    nav_html += '</div>'
    nav_html += '<div class="sidebar-section"><div class="sidebar-section-label">Compte</div>'
    for page_id, label, icon in pages2:
        active = ' active' if page_id == active_page else ''
        nav_html += f'<a href="../{page_id}/index.html" class="sidebar-link{active}"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>{label}</a>'
    nav_html += '</div></nav>'
    
    footer_html = '''<div class="sidebar-footer">
        <a href="../profil/index.html" class="sidebar-user">
            <div class="sidebar-avatar">ML</div>
            <div class="sidebar-user-info">
                <div class="sidebar-user-name">Marie Laurent</div>
                <div class="sidebar-user-role">Directrice Marketing</div>
            </div>
        </a>
    </div>'''
    
    return f'''<aside class="sidebar">
        <a href="../dashboard/index.html" class="sidebar-logo">Trajectoire<span class="sidebar-logo-dot"></span></a>
        {nav_html}
        {footer_html}
    </aside>'''


def generate_dashboard():
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
    {HEAD_COMMON}
    <title>Tableau de bord | Trajectoire</title>
    <style>{app_page_css()}</style>
</head>
<body>
<div class="app-layout">
    {sidebar_html('dashboard')}
    <main class="main-content">
        <div class="top-bar">
            <span class="top-bar-title">Tableau de bord</span>
            <div class="top-bar-actions">
                <a href="../simulations/index.html" class="btn btn-primary">Nouvelle simulation</a>
            </div>
        </div>
        <div class="page-content">
            <div class="page-header fade-in">
                <h1>Bonjour, Marie</h1>
                <p>Voici un résumé de votre progression et de vos prochaines étapes.</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card fade-in"><div class="stat-card-label">Simulations réalisées</div><div class="stat-card-value">12</div><div class="stat-card-change">+3 ce mois</div></div>
                <div class="stat-card fade-in"><div class="stat-card-label">Score moyen</div><div class="stat-card-value">87%</div><div class="stat-card-change">+5% vs. mois dernier</div></div>
                <div class="stat-card fade-in"><div class="stat-card-label">Heures de préparation</div><div class="stat-card-value">24h</div><div class="stat-card-change">+6h ce mois</div></div>
                <div class="stat-card fade-in"><div class="stat-card-label">Compétences maîtrisées</div><div class="stat-card-value">5/6</div><div class="stat-card-change">Vision stratégique en cours</div></div>
            </div>
            <div class="grid-2">
                <div class="card fade-in">
                    <div class="card-header"><h3 class="card-title">Prochaines étapes</h3><a href="../simulations/index.html" class="card-link">Tout voir</a></div>
                    <div class="list-item">
                        <div class="list-item-icon" style="background: rgba(30,64,175,0.08);"><svg fill="none" stroke="var(--blue-primary)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg></div>
                        <div class="list-item-content"><div class="list-item-title">Simulation — Entretien Directeur Marketing</div><div class="list-item-desc">Préparation recommandée avant le 12 juillet</div></div>
                        <span class="badge badge-blue">À faire</span>
                    </div>
                    <div class="list-item">
                        <div class="list-item-icon" style="background: rgba(212,175,55,0.1);"><svg fill="none" stroke="var(--gold-accent)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div>
                        <div class="list-item-content"><div class="list-item-title">Débrief de la simulation #11</div><div class="list-item-desc">Votre analyse détaillée est disponible</div></div>
                        <span class="badge badge-gold">Nouveau</span>
                    </div>
                    <div class="list-item">
                        <div class="list-item-icon" style="background: rgba(22,163,74,0.08);"><svg fill="none" stroke="var(--success)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                        <div class="list-item-content"><div class="list-item-title">Module Leadership — Terminé</div><div class="list-item-desc">Score : 92% — Excellent</div></div>
                        <span class="badge badge-green">Terminé</span>
                    </div>
                </div>
                <div class="card fade-in">
                    <div class="card-header"><h3 class="card-title">Progression des compétences</h3><a href="../carriere/index.html" class="card-link">Analyse complète</a></div>
                    <div style="margin-bottom: 20px;"><div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span style="font-size:14px; font-weight:500;">Leadership</span><span style="font-size:13px; color:var(--text-secondary);">92%</span></div><div class="progress-bar"><div class="progress-fill" style="width:92%; background: var(--blue-primary);"></div></div></div>
                    <div style="margin-bottom: 20px;"><div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span style="font-size:14px; font-weight:500;">Communication</span><span style="font-size:13px; color:var(--text-secondary);">88%</span></div><div class="progress-bar"><div class="progress-fill" style="width:88%; background: var(--blue-primary);"></div></div></div>
                    <div style="margin-bottom: 20px;"><div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span style="font-size:14px; font-weight:500;">Impact</span><span style="font-size:13px; color:var(--text-secondary);">85%</span></div><div class="progress-bar"><div class="progress-fill" style="width:85%; background: var(--blue-primary);"></div></div></div>
                    <div style="margin-bottom: 20px;"><div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span style="font-size:14px; font-weight:500;">Gestion du stress</span><span style="font-size:13px; color:var(--text-secondary);">78%</span></div><div class="progress-bar"><div class="progress-fill" style="width:78%; background: var(--gold-accent);"></div></div></div>
                    <div style="margin-bottom: 20px;"><div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span style="font-size:14px; font-weight:500;">Argumentation</span><span style="font-size:13px; color:var(--text-secondary);">90%</span></div><div class="progress-bar"><div class="progress-fill" style="width:90%; background: var(--blue-primary);"></div></div></div>
                    <div><div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span style="font-size:14px; font-weight:500;">Vision stratégique</span><span style="font-size:13px; color:var(--text-secondary);">65%</span></div><div class="progress-bar"><div class="progress-fill" style="width:65%; background: var(--gold-accent);"></div></div></div>
                </div>
            </div>
        </div>
    </main>
</div>
</body>
</html>'''


def generate_app_page(page_id, title, subtitle, content_html):
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
    {HEAD_COMMON}
    <title>{title} | Trajectoire</title>
    <style>{app_page_css()}</style>
</head>
<body>
<div class="app-layout">
    {sidebar_html(page_id)}
    <main class="main-content">
        <div class="top-bar">
            <span class="top-bar-title">{title}</span>
            <div class="top-bar-actions">
                <a href="../dashboard/index.html" class="btn btn-secondary">Retour au tableau de bord</a>
            </div>
        </div>
        <div class="page-content">
            <div class="page-header fade-in">
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>
            {content_html}
        </div>
    </main>
</div>
</body>
</html>'''


def generate_cv():
    content = '''
    <div class="grid-2">
        <div class="card fade-in">
            <div class="card-header"><h3 class="card-title">CV Principal</h3><span class="badge badge-green">À jour</span></div>
            <div style="padding: 24px 0; text-align: center; border: 2px dashed var(--border); border-radius: var(--radius); margin-bottom: 16px;">
                <svg width="40" height="40" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24" style="margin-bottom: 12px; opacity: 0.5;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <p style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">CV_Directrice_Marketing_2026.pdf</p>
                <p style="font-size: 13px; color: var(--text-secondary);">Dernière mise à jour : 28 juin 2026</p>
            </div>
            <div style="display: flex; gap: 12px;">
                <button class="btn btn-primary" style="flex:1;">Remplacer</button>
                <button class="btn btn-secondary" style="flex:1;">Télécharger</button>
            </div>
        </div>
        <div class="card fade-in">
            <div class="card-header"><h3 class="card-title">CV Secondaire</h3><span class="badge badge-blue">Version conseil</span></div>
            <div style="padding: 24px 0; text-align: center; border: 2px dashed var(--border); border-radius: var(--radius); margin-bottom: 16px;">
                <svg width="40" height="40" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24" style="margin-bottom: 12px; opacity: 0.5;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <p style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">CV_Consultante_Senior_2026.pdf</p>
                <p style="font-size: 13px; color: var(--text-secondary);">Dernière mise à jour : 15 mai 2026</p>
            </div>
            <div style="display: flex; gap: 12px;">
                <button class="btn btn-primary" style="flex:1;">Remplacer</button>
                <button class="btn btn-secondary" style="flex:1;">Télécharger</button>
            </div>
        </div>
    </div>
    <div class="card fade-in" style="margin-top: 24px;">
        <div class="card-header"><h3 class="card-title">Analyse automatique de votre CV</h3></div>
        <p style="font-size: 15px; color: var(--text-secondary); margin-bottom: 20px;">Notre analyse identifie les points forts et les axes d'amélioration de votre CV pour maximiser votre impact en entretien.</p>
        <div class="grid-3">
            <div style="padding: 16px; background: var(--bg); border-radius: 10px;">
                <div style="font-size: 24px; font-weight: 700; color: var(--success); margin-bottom: 4px;">92/100</div>
                <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">Structure</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Clarté et organisation exemplaires</div>
            </div>
            <div style="padding: 16px; background: var(--bg); border-radius: 10px;">
                <div style="font-size: 24px; font-weight: 700; color: var(--blue-primary); margin-bottom: 4px;">85/100</div>
                <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">Impact</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Résultats chiffrés bien présents</div>
            </div>
            <div style="padding: 16px; background: var(--bg); border-radius: 10px;">
                <div style="font-size: 24px; font-weight: 700; color: var(--gold-accent); margin-bottom: 4px;">78/100</div>
                <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">Mots-clés</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Quelques ajustements recommandés</div>
            </div>
        </div>
    </div>'''
    return generate_app_page('cv', 'Mes CV', 'Gérez vos CV et bénéficiez d\'analyses personnalisées pour optimiser votre candidature.', content)


def generate_carriere():
    content = '''
    <div class="card fade-in" style="margin-bottom: 24px;">
        <div class="card-header"><h3 class="card-title">Votre trajectoire professionnelle</h3></div>
        <div style="position: relative; padding-left: 24px; border-left: 2px solid var(--border);">
            <div style="margin-bottom: 32px; position: relative;"><div style="position: absolute; left: -31px; width: 14px; height: 14px; background: var(--blue-primary); border-radius: 50%; border: 3px solid var(--card);"></div><div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">2023 — Présent</div><div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Directrice Marketing — Groupe LVMH</div><div style="font-size: 14px; color: var(--text-secondary);">Pilotage de la stratégie digitale. Équipe de 15 personnes. Budget 8M€.</div></div>
            <div style="margin-bottom: 32px; position: relative;"><div style="position: absolute; left: -31px; width: 14px; height: 14px; background: var(--blue-primary); border-radius: 50%; border: 3px solid var(--card);"></div><div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">2019 — 2023</div><div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Responsable Communication — BNP Paribas</div><div style="font-size: 14px; color: var(--text-secondary);">Stratégie de marque et communication corporate. Équipe de 8 personnes.</div></div>
            <div style="margin-bottom: 32px; position: relative;"><div style="position: absolute; left: -31px; width: 14px; height: 14px; background: var(--gold-accent); border-radius: 50%; border: 3px solid var(--card);"></div><div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">2016 — 2019</div><div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Consultante Senior — McKinsey &amp; Company</div><div style="font-size: 14px; color: var(--text-secondary);">Missions de transformation digitale et stratégie marketing.</div></div>
            <div style="position: relative;"><div style="position: absolute; left: -31px; width: 14px; height: 14px; background: var(--border); border-radius: 50%; border: 3px solid var(--card);"></div><div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">2014 — 2016</div><div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">MBA — HEC Paris</div><div style="font-size: 14px; color: var(--text-secondary);">Spécialisation Marketing &amp; Stratégie.</div></div>
        </div>
    </div>
    <div class="grid-2">
        <div class="card fade-in">
            <div class="card-header"><h3 class="card-title">Forces identifiées</h3></div>
            <div class="list-item"><div class="list-item-content"><div class="list-item-title">Leadership d'équipe</div><div class="list-item-desc">Expérience confirmée en management d'équipes pluridisciplinaires</div></div></div>
            <div class="list-item"><div class="list-item-content"><div class="list-item-title">Vision stratégique</div><div class="list-item-desc">Capacité à aligner les initiatives marketing sur les objectifs business</div></div></div>
            <div class="list-item"><div class="list-item-content"><div class="list-item-title">Excellence opérationnelle</div><div class="list-item-desc">Rigueur méthodologique issue du conseil en stratégie</div></div></div>
        </div>
        <div class="card fade-in">
            <div class="card-header"><h3 class="card-title">Axes de développement</h3></div>
            <div class="list-item"><div class="list-item-content"><div class="list-item-title">Prise de parole en public</div><div class="list-item-desc">Renforcer votre aisance lors des présentations exécutives</div></div></div>
            <div class="list-item"><div class="list-item-content"><div class="list-item-title">Négociation salariale</div><div class="list-item-desc">Structurer votre argumentation pour les discussions de rémunération</div></div></div>
            <div class="list-item"><div class="list-item-content"><div class="list-item-title">Rayonnement international</div><div class="list-item-desc">Développer votre positionnement pour des rôles à dimension globale</div></div></div>
        </div>
    </div>'''
    return generate_app_page('carriere', 'Analyse de carrière', 'Comprenez votre parcours et identifiez vos leviers de progression.', content)


def generate_simulations():
    content = '''
    <div style="display: flex; gap: 16px; margin-bottom: 24px;">
        <button class="btn btn-primary">Lancer une nouvelle simulation</button>
        <button class="btn btn-secondary">Filtrer par type</button>
    </div>
    <div class="card fade-in">
        <div class="card-header"><h3 class="card-title">Historique des simulations</h3></div>
        <div class="list-item">
            <div class="list-item-icon" style="background: rgba(22,163,74,0.08);"><svg fill="none" stroke="var(--success)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            <div class="list-item-content"><div class="list-item-title">Entretien VP Marketing — L'Oréal</div><div class="list-item-desc">Simulation complète avec débrief détaillé</div></div>
            <div style="text-align: right;"><div class="list-item-meta">2 juillet 2026</div><div style="margin-top: 4px;"><span class="badge badge-green">Score : 92%</span></div></div>
        </div>
        <div class="list-item">
            <div class="list-item-icon" style="background: rgba(30,64,175,0.08);"><svg fill="none" stroke="var(--blue-primary)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            <div class="list-item-content"><div class="list-item-title">Comité de direction — Promotion interne</div><div class="list-item-desc">Focus sur la vision stratégique et le leadership</div></div>
            <div style="text-align: right;"><div class="list-item-meta">25 juin 2026</div><div style="margin-top: 4px;"><span class="badge badge-blue">Score : 85%</span></div></div>
        </div>
        <div class="list-item">
            <div class="list-item-icon" style="background: rgba(212,175,55,0.1);"><svg fill="none" stroke="var(--gold-accent)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            <div class="list-item-content"><div class="list-item-title">Entretien Cabinet de conseil — Partner track</div><div class="list-item-desc">Mise en situation avec étude de cas</div></div>
            <div style="text-align: right;"><div class="list-item-meta">18 juin 2026</div><div style="margin-top: 4px;"><span class="badge badge-gold">Score : 78%</span></div></div>
        </div>
    </div>'''
    return generate_app_page('simulations', 'Simulations', 'Rejouez vos entretiens dans des conditions réalistes et mesurez votre progression.', content)


def generate_interview():
    content = '''
    <div class="card fade-in" style="text-align: center; padding: 64px 32px;">
        <svg width="64" height="64" fill="none" stroke="var(--blue-primary)" viewBox="0 0 24 24" style="margin-bottom: 24px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
        <h2 style="font-size: 28px; margin-bottom: 12px;">Entretien en direct</h2>
        <p style="font-size: 16px; color: var(--text-secondary); max-width: 520px; margin: 0 auto 32px; line-height: 1.7;">Lancez une session de simulation en conditions réelles. Votre coach jouera le rôle de l'intervieweur et adaptera les questions à votre contexte.</p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary" style="padding: 14px 32px;">Démarrer une session</button>
            <button class="btn btn-secondary" style="padding: 14px 32px;">Planifier avec un coach</button>
        </div>
    </div>
    <div class="grid-3" style="margin-top: 24px;">
        <div class="card fade-in" style="text-align: center;">
            <div style="font-size: 32px; margin-bottom: 8px;">🎯</div>
            <h3 style="font-size: 16px; margin-bottom: 8px;">Questions ciblées</h3>
            <p style="font-size: 13px; color: var(--text-secondary);">Adaptées à votre poste et votre secteur</p>
        </div>
        <div class="card fade-in" style="text-align: center;">
            <div style="font-size: 32px; margin-bottom: 8px;">⏱️</div>
            <h3 style="font-size: 16px; margin-bottom: 8px;">Durée réaliste</h3>
            <p style="font-size: 13px; color: var(--text-secondary);">45 à 60 minutes comme un vrai entretien</p>
        </div>
        <div class="card fade-in" style="text-align: center;">
            <div style="font-size: 32px; margin-bottom: 8px;">📊</div>
            <h3 style="font-size: 16px; margin-bottom: 8px;">Analyse instantanée</h3>
            <p style="font-size: 13px; color: var(--text-secondary);">Retour détaillé à la fin de chaque session</p>
        </div>
    </div>'''
    return generate_app_page('interview', 'Entretien en direct', 'Simulez un entretien réel avec un coach expérimenté.', content)


def generate_debrief():
    content = '''
    <div class="card fade-in" style="margin-bottom: 24px;">
        <div class="card-header"><h3 class="card-title">Dernier débrief — Entretien VP Marketing</h3><span class="badge badge-green">Score global : 92%</span></div>
        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 20px;">Simulation réalisée le 2 juillet 2026 — Durée : 52 minutes</p>
        <div class="grid-3">
            <div style="padding: 16px; background: var(--bg); border-radius: 10px;"><div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">Clarté du discours</div><div style="font-size: 24px; font-weight: 700; color: var(--success);">95%</div></div>
            <div style="padding: 16px; background: var(--bg); border-radius: 10px;"><div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">Posture &amp; présence</div><div style="font-size: 24px; font-weight: 700; color: var(--blue-primary);">90%</div></div>
            <div style="padding: 16px; background: var(--bg); border-radius: 10px;"><div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">Gestion du stress</div><div style="font-size: 24px; font-weight: 700; color: var(--blue-primary);">88%</div></div>
        </div>
    </div>
    <div class="grid-2">
        <div class="card fade-in">
            <div class="card-header"><h3 class="card-title">Points forts</h3></div>
            <div class="list-item"><div class="list-item-content"><div class="list-item-title">Narrative personnelle convaincante</div><div class="list-item-desc">Votre parcours est raconté de manière cohérente et engageante</div></div></div>
            <div class="list-item"><div class="list-item-content"><div class="list-item-title">Exemples concrets et chiffrés</div><div class="list-item-desc">Vous illustrez vos propos avec des résultats tangibles</div></div></div>
            <div class="list-item"><div class="list-item-content"><div class="list-item-title">Écoute active</div><div class="list-item-desc">Vous reformulez et rebondissez avec pertinence</div></div></div>
        </div>
        <div class="card fade-in">
            <div class="card-header"><h3 class="card-title">Axes d'amélioration</h3></div>
            <div class="list-item"><div class="list-item-content"><div class="list-item-title">Questions de négociation salariale</div><div class="list-item-desc">Préparer des arguments plus structurés sur la rémunération</div></div></div>
            <div class="list-item"><div class="list-item-content"><div class="list-item-title">Gestion des silences</div><div class="list-item-desc">Apprendre à utiliser les pauses comme outil de conviction</div></div></div>
            <div class="list-item"><div class="list-item-content"><div class="list-item-title">Projection à long terme</div><div class="list-item-desc">Exprimer une vision plus claire de votre évolution souhaitée</div></div></div>
        </div>
    </div>'''
    return generate_app_page('debrief', 'Débrief personnalisé', 'Analysez vos performances avec des retours détaillés et des recommandations actionnables.', content)


def generate_abonnement():
    content = '''
    <div class="card fade-in" style="margin-bottom: 24px;">
        <div class="card-header"><h3 class="card-title">Votre abonnement actuel</h3><span class="badge badge-blue">Premium</span></div>
        <div class="grid-3">
            <div><div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">Formule</div><div style="font-size: 18px; font-weight: 600;">Premium Exécutif</div></div>
            <div><div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">Prochain prélèvement</div><div style="font-size: 18px; font-weight: 600;">15 août 2026</div></div>
            <div><div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">Montant</div><div style="font-size: 18px; font-weight: 600;">299 € / mois</div></div>
        </div>
    </div>
    <div class="grid-3">
        <div class="card fade-in" style="border: 1px solid var(--border);">
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Essentiel</div>
            <div style="font-size: 28px; font-weight: 700; margin-bottom: 16px; font-family: 'Playfair Display', serif;">99 €<span style="font-size: 14px; font-weight: 400; color: var(--text-secondary);"> / mois</span></div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">5 simulations par mois</div>
            <button class="btn btn-secondary" style="width: 100%;">Rétrograder</button>
        </div>
        <div class="card fade-in" style="border: 2px solid var(--blue-primary); position: relative;">
            <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%);"><span class="badge badge-blue">Actuel</span></div>
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Premium</div>
            <div style="font-size: 28px; font-weight: 700; margin-bottom: 16px; font-family: 'Playfair Display', serif;">299 €<span style="font-size: 14px; font-weight: 400; color: var(--text-secondary);"> / mois</span></div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">Simulations illimitées + coach dédié</div>
            <button class="btn btn-primary" style="width: 100%;">Gérer</button>
        </div>
        <div class="card fade-in" style="border: 1px solid var(--border);">
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Exécutif</div>
            <div style="font-size: 28px; font-weight: 700; margin-bottom: 16px; font-family: 'Playfair Display', serif;">599 €<span style="font-size: 14px; font-weight: 400; color: var(--text-secondary);"> / mois</span></div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">Tout Premium + coaching 1-to-1 hebdomadaire</div>
            <button class="btn btn-secondary" style="width: 100%;">Améliorer</button>
        </div>
    </div>'''
    return generate_app_page('abonnement', 'Abonnement', 'Gérez votre formule et vos préférences de facturation.', content)


def generate_profil():
    content = '''
    <div class="grid-2">
        <div class="card fade-in">
            <div class="card-header"><h3 class="card-title">Informations personnelles</h3></div>
            <div style="margin-bottom: 16px;"><label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px;">Prénom</label><div style="padding: 12px 16px; background: var(--bg); border-radius: 10px; font-size: 15px;">Marie</div></div>
            <div style="margin-bottom: 16px;"><label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px;">Nom</label><div style="padding: 12px 16px; background: var(--bg); border-radius: 10px; font-size: 15px;">Laurent</div></div>
            <div style="margin-bottom: 16px;"><label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px;">Adresse e-mail</label><div style="padding: 12px 16px; background: var(--bg); border-radius: 10px; font-size: 15px;">marie.laurent@entreprise.fr</div></div>
            <div style="margin-bottom: 16px;"><label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px;">Poste actuel</label><div style="padding: 12px 16px; background: var(--bg); border-radius: 10px; font-size: 15px;">Directrice Marketing</div></div>
            <button class="btn btn-secondary" style="margin-top: 8px;">Modifier mes informations</button>
        </div>
        <div class="card fade-in">
            <div class="card-header"><h3 class="card-title">Préférences</h3></div>
            <div style="margin-bottom: 16px;"><label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px;">Objectif professionnel</label><div style="padding: 12px 16px; background: var(--bg); border-radius: 10px; font-size: 15px;">VP Marketing — Grand groupe international</div></div>
            <div style="margin-bottom: 16px;"><label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px;">Secteur de prédilection</label><div style="padding: 12px 16px; background: var(--bg); border-radius: 10px; font-size: 15px;">Luxe, FMCG, Tech</div></div>
            <div style="margin-bottom: 16px;"><label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px;">Langue de préparation</label><div style="padding: 12px 16px; background: var(--bg); border-radius: 10px; font-size: 15px;">Français &amp; Anglais</div></div>
            <div style="margin-bottom: 16px;"><label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px;">Notifications</label><div style="padding: 12px 16px; background: var(--bg); border-radius: 10px; font-size: 15px;">Activées — E-mail uniquement</div></div>
            <button class="btn btn-secondary" style="margin-top: 8px;">Modifier mes préférences</button>
        </div>
    </div>
    <div class="card fade-in" style="margin-top: 24px;">
        <div class="card-header"><h3 class="card-title">Sécurité</h3></div>
        <div class="list-item"><div class="list-item-content"><div class="list-item-title">Mot de passe</div><div class="list-item-desc">Dernière modification : 15 mai 2026</div></div><button class="btn btn-secondary" style="padding: 8px 16px; font-size: 13px;">Modifier</button></div>
        <div class="list-item"><div class="list-item-content"><div class="list-item-title">Authentification à deux facteurs</div><div class="list-item-desc">Non activée</div></div><button class="btn btn-secondary" style="padding: 8px 16px; font-size: 13px;">Activer</button></div>
        <div class="list-item"><div class="list-item-content"><div class="list-item-title">Sessions actives</div><div class="list-item-desc">2 appareils connectés</div></div><button class="btn btn-secondary" style="padding: 8px 16px; font-size: 13px;">Gérer</button></div>
    </div>'''
    return generate_app_page('profil', 'Profil', 'Gérez vos informations personnelles et vos préférences.', content)


def generate_ressources():
    content = '''
    <div class="grid-3">
        <div class="card fade-in" style="cursor: pointer;">
            <div style="height: 140px; background: linear-gradient(135deg, rgba(30,64,175,0.08), rgba(30,64,175,0.02)); border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;"><svg width="40" height="40" fill="none" stroke="var(--blue-primary)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg></div>
            <span class="badge badge-blue" style="margin-bottom: 8px;">Guide</span>
            <h3 style="font-size: 16px; margin-bottom: 8px;">Les 10 questions les plus posées en entretien de direction</h3>
            <p style="font-size: 13px; color: var(--text-secondary);">12 min de lecture</p>
        </div>
        <div class="card fade-in" style="cursor: pointer;">
            <div style="height: 140px; background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.02)); border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;"><svg width="40" height="40" fill="none" stroke="var(--gold-accent)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
            <span class="badge badge-gold" style="margin-bottom: 8px;">Article</span>
            <h3 style="font-size: 16px; margin-bottom: 8px;">Comment structurer votre narrative de leader</h3>
            <p style="font-size: 13px; color: var(--text-secondary);">8 min de lecture</p>
        </div>
        <div class="card fade-in" style="cursor: pointer;">
            <div style="height: 140px; background: linear-gradient(135deg, rgba(22,163,74,0.08), rgba(22,163,74,0.02)); border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;"><svg width="40" height="40" fill="none" stroke="var(--success)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            <span class="badge badge-green" style="margin-bottom: 8px;">Étude de cas</span>
            <h3 style="font-size: 16px; margin-bottom: 8px;">Réussir un entretien de comité exécutif : retour d'expérience</h3>
            <p style="font-size: 13px; color: var(--text-secondary);">15 min de lecture</p>
        </div>
        <div class="card fade-in" style="cursor: pointer;">
            <div style="height: 140px; background: linear-gradient(135deg, rgba(30,64,175,0.08), rgba(30,64,175,0.02)); border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;"><svg width="40" height="40" fill="none" stroke="var(--blue-primary)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
            <span class="badge badge-blue" style="margin-bottom: 8px;">Guide</span>
            <h3 style="font-size: 16px; margin-bottom: 8px;">Négocier sa rémunération : le guide complet</h3>
            <p style="font-size: 13px; color: var(--text-secondary);">18 min de lecture</p>
        </div>
        <div class="card fade-in" style="cursor: pointer;">
            <div style="height: 140px; background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.02)); border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;"><svg width="40" height="40" fill="none" stroke="var(--gold-accent)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/></svg></div>
            <span class="badge badge-gold" style="margin-bottom: 8px;">Article</span>
            <h3 style="font-size: 16px; margin-bottom: 8px;">Préparer un entretien international : codes culturels</h3>
            <p style="font-size: 13px; color: var(--text-secondary);">10 min de lecture</p>
        </div>
        <div class="card fade-in" style="cursor: pointer;">
            <div style="height: 140px; background: linear-gradient(135deg, rgba(22,163,74,0.08), rgba(22,163,74,0.02)); border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;"><svg width="40" height="40" fill="none" stroke="var(--success)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div>
            <span class="badge badge-green" style="margin-bottom: 8px;">Template</span>
            <h3 style="font-size: 16px; margin-bottom: 8px;">Modèle de préparation : checklist avant l'entretien</h3>
            <p style="font-size: 13px; color: var(--text-secondary);">5 min de lecture</p>
        </div>
    </div>'''
    return generate_app_page('ressources', 'Ressources', 'Articles, guides et templates pour approfondir votre préparation.', content)


# ═══════════════════════════════════════════════════════════════════
# GENERATE ALL FILES
# ═══════════════════════════════════════════════════════════════════

pages = {
    'index.html': generate_homepage(),
    'inscription/index.html': generate_inscription(),
    'connexion/index.html': generate_connexion(),
    'dashboard/index.html': generate_dashboard(),
    'cv/index.html': generate_cv(),
    'carriere/index.html': generate_carriere(),
    'simulations/index.html': generate_simulations(),
    'interview/index.html': generate_interview(),
    'debrief/index.html': generate_debrief(),
    'abonnement/index.html': generate_abonnement(),
    'profil/index.html': generate_profil(),
    'ressources/index.html': generate_ressources(),
}

for path, content in pages.items():
    os.makedirs(os.path.dirname(path) if os.path.dirname(path) else '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    size_kb = len(content) / 1024
    print(f"  ✓ {path:<35} ({size_kb:.0f} Ko)")

print(f"\n✅ {len(pages)} pages générées avec succès.")
