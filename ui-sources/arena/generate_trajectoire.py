#!/usr/bin/env python3
"""Generate the Trajectoire premium homepage"""

import base64

# Read the base64 encoded images
with open('/tmp/hero_b64.txt', 'r') as f:
    hero_b64 = f.read().strip()

with open('/tmp/founder_b64.txt', 'r') as f:
    founder_b64 = f.read().strip()

html = f'''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Trajectoire - Préparez vos entretiens stratégiques avec méthode. Coaching premium pour cadres et dirigeants.">
    <title>Trajectoire | Préparation d'entretiens pour cadres dirigeants</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {{
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
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }}

        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        html {{
            scroll-behavior: smooth;
        }}

        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: var(--bg);
            color: var(--text-primary);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }}

        h1, h2, h3, h4, h5, h6 {{
            font-family: 'Playfair Display', Georgia, serif;
            font-weight: 600;
            line-height: 1.2;
            letter-spacing: -0.02em;
        }}

        .container {{
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
        }}

        /* NAVIGATION */
        nav {{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(248, 246, 243, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
            transition: var(--transition);
        }}

        nav.scrolled {{
            background: rgba(248, 246, 243, 0.95);
            box-shadow: var(--shadow-sm);
        }}

        .nav-container {{
            max-width: 1280px;
            margin: 0 auto;
            padding: 16px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }}

        .logo {{
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 24px;
            font-weight: 700;
            color: var(--text-primary);
            text-decoration: none;
            letter-spacing: -0.02em;
        }}

        .nav-menu {{
            display: flex;
            gap: 32px;
            list-style: none;
        }}

        .nav-menu a {{
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            transition: var(--transition);
        }}

        .nav-menu a:hover {{
            color: var(--text-primary);
        }}

        .nav-actions {{
            display: flex;
            gap: 16px;
            align-items: center;
        }}

        .btn {{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            border-radius: var(--radius);
            font-family: 'Inter', sans-serif;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;
            transition: var(--transition);
            cursor: pointer;
            border: none;
        }}

        .btn-ghost {{
            background: transparent;
            color: var(--text-primary);
        }}

        .btn-ghost:hover {{
            background: rgba(17, 24, 39, 0.05);
        }}

        .btn-primary {{
            background: var(--blue-primary);
            color: white;
        }}

        .btn-primary:hover {{
            background: var(--blue-hover);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }}

        .btn-secondary {{
            background: var(--card);
            color: var(--text-primary);
            border: 1px solid var(--border);
        }}

        .btn-secondary:hover {{
            background: var(--bg);
            border-color: var(--text-secondary);
        }}

        /* HERO SECTION */
        .hero {{
            padding: 140px 0 80px;
            background: linear-gradient(180deg, var(--bg) 0%, rgba(248, 246, 243, 0) 100%);
        }}

        .hero-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            align-items: center;
        }}

        .hero-content h1 {{
            font-size: 56px;
            line-height: 1.1;
            margin-bottom: 24px;
            color: var(--text-primary);
        }}

        .hero-content p {{
            font-size: 18px;
            line-height: 1.7;
            color: var(--text-secondary);
            margin-bottom: 40px;
            max-width: 520px;
        }}

        .hero-buttons {{
            display: flex;
            gap: 16px;
            margin-bottom: 48px;
        }}

        .trust-indicators {{
            display: flex;
            gap: 32px;
            padding-top: 32px;
            border-top: 1px solid var(--border);
        }}

        .trust-item {{
            display: flex;
            align-items: center;
            gap: 12px;
        }}

        .trust-icon {{
            width: 20px;
            height: 20px;
            color: var(--success);
        }}

        .trust-text {{
            font-size: 14px;
            color: var(--text-secondary);
            font-weight: 500;
        }}

        .hero-image {{
            position: relative;
        }}

        .hero-image img {{
            width: 100%;
            height: auto;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
        }}

        /* STATS SECTION */
        .stats {{
            padding: 80px 0;
            background: var(--card);
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
        }}

        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 64px;
        }}

        .stat-item {{
            text-align: center;
        }}

        .stat-number {{
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 48px;
            font-weight: 700;
            color: var(--blue-primary);
            margin-bottom: 12px;
            line-height: 1;
        }}

        .stat-label {{
            font-size: 16px;
            color: var(--text-secondary);
            font-weight: 500;
            line-height: 1.5;
        }}

        /* SECTION STYLES */
        section {{
            padding: 120px 0;
        }}

        .section-header {{
            text-align: center;
            max-width: 680px;
            margin: 0 auto 80px;
        }}

        .section-label {{
            display: inline-block;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--blue-primary);
            margin-bottom: 16px;
        }}

        .section-title {{
            font-size: 42px;
            margin-bottom: 20px;
            color: var(--text-primary);
        }}

        .section-subtitle {{
            font-size: 18px;
            color: var(--text-secondary);
            line-height: 1.7;
        }}

        /* WHY TRAJECTOIRE */
        .why-grid {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
        }}

        .why-card {{
            background: var(--card);
            padding: 40px 32px;
            border-radius: var(--radius);
            border: 1px solid var(--border);
            transition: var(--transition);
        }}

        .why-card:hover {{
            border-color: var(--blue-primary);
            box-shadow: var(--shadow-md);
            transform: translateY(-4px);
        }}

        .why-icon {{
            width: 48px;
            height: 48px;
            background: rgba(30, 64, 175, 0.08);
            border-radius: var(--radius);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
        }}

        .why-icon svg {{
            width: 24px;
            height: 24px;
            color: var(--blue-primary);
        }}

        .why-card h3 {{
            font-size: 24px;
            margin-bottom: 16px;
            color: var(--text-primary);
        }}

        .why-card p {{
            font-size: 16px;
            color: var(--text-secondary);
            line-height: 1.7;
        }}

        /* HOW IT WORKS */
        .process {{
            background: var(--card);
        }}

        .timeline {{
            max-width: 800px;
            margin: 0 auto;
            position: relative;
        }}

        .timeline::before {{
            content: '';
            position: absolute;
            left: 32px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(180deg, var(--blue-primary) 0%, var(--border) 100%);
        }}

        .timeline-item {{
            position: relative;
            padding-left: 88px;
            padding-bottom: 64px;
        }}

        .timeline-item:last-child {{
            padding-bottom: 0;
        }}

        .timeline-number {{
            position: absolute;
            left: 0;
            width: 64px;
            height: 64px;
            background: var(--blue-primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 24px;
            font-weight: 700;
            box-shadow: var(--shadow-md);
        }}

        .timeline-content h3 {{
            font-size: 28px;
            margin-bottom: 12px;
            color: var(--text-primary);
        }}

        .timeline-content p {{
            font-size: 16px;
            color: var(--text-secondary);
            line-height: 1.7;
        }}

        /* SKILLS */
        .skills-grid {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
        }}

        .skill-card {{
            background: var(--card);
            padding: 32px;
            border-radius: var(--radius);
            border: 1px solid var(--border);
            text-align: center;
            transition: var(--transition);
        }}

        .skill-card:hover {{
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }}

        .skill-icon {{
            width: 56px;
            height: 56px;
            margin: 0 auto 20px;
            background: rgba(212, 175, 55, 0.1);
            border-radius: var(--radius);
            display: flex;
            align-items: center;
            justify-content: center;
        }}

        .skill-icon svg {{
            width: 28px;
            height: 28px;
            color: var(--gold-accent);
        }}

        .skill-card h3 {{
            font-size: 20px;
            margin-bottom: 8px;
            color: var(--text-primary);
        }}

        /* INTERVIEW TYPES */
        .types-grid {{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }}

        .type-card {{
            background: var(--card);
            padding: 32px 24px;
            border-radius: var(--radius);
            border: 1px solid var(--border);
            text-align: center;
            transition: var(--transition);
        }}

        .type-card:hover {{
            border-color: var(--blue-primary);
            background: rgba(30, 64, 175, 0.02);
        }}

        .type-card h3 {{
            font-size: 18px;
            color: var(--text-primary);
            font-weight: 600;
        }}

        /* TRUST SECTION */
        .trust {{
            background: var(--card);
            text-align: center;
        }}

        .trust-content {{
            max-width: 720px;
            margin: 0 auto;
        }}

        .trust-content p {{
            font-size: 20px;
            color: var(--text-secondary);
            line-height: 1.7;
            font-style: italic;
        }}

        /* ABOUT SECTION */
        .about-grid {{
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 80px;
            align-items: center;
        }}

        .about-image img {{
            width: 100%;
            height: auto;
            border-radius: var(--radius);
            box-shadow: var(--shadow-md);
        }}

        .about-content h2 {{
            font-size: 36px;
            margin-bottom: 24px;
        }}

        .about-content p {{
            font-size: 17px;
            color: var(--text-secondary);
            line-height: 1.8;
            margin-bottom: 20px;
        }}

        .about-signature {{
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid var(--border);
        }}

        .about-signature strong {{
            display: block;
            font-size: 18px;
            color: var(--text-primary);
            margin-bottom: 4px;
        }}

        .about-signature span {{
            font-size: 15px;
            color: var(--text-secondary);
        }}

        /* FAQ */
        .faq {{
            background: var(--card);
        }}

        .faq-list {{
            max-width: 800px;
            margin: 0 auto;
        }}

        .faq-item {{
            border-bottom: 1px solid var(--border);
        }}

        .faq-question {{
            width: 100%;
            padding: 24px 0;
            background: none;
            border: none;
            text-align: left;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Inter', sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            transition: var(--transition);
        }}

        .faq-question:hover {{
            color: var(--blue-primary);
        }}

        .faq-icon {{
            width: 24px;
            height: 24px;
            transition: var(--transition);
            flex-shrink: 0;
        }}

        .faq-item.active .faq-icon {{
            transform: rotate(45deg);
        }}

        .faq-answer {{
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }}

        .faq-answer-content {{
            padding: 0 0 24px 0;
            font-size: 16px;
            color: var(--text-secondary);
            line-height: 1.7;
        }}

        /* FINAL CTA */
        .final-cta {{
            text-align: center;
            background: linear-gradient(180deg, var(--bg) 0%, rgba(30, 64, 175, 0.03) 100%);
        }}

        .final-cta h2 {{
            font-size: 48px;
            margin-bottom: 40px;
            max-width: 720px;
            margin-left: auto;
            margin-right: auto;
        }}

        .final-cta-buttons {{
            display: flex;
            gap: 16px;
            justify-content: center;
        }}

        /* FOOTER */
        footer {{
            background: var(--text-primary);
            color: white;
            padding: 80px 0 40px;
        }}

        .footer-grid {{
            display: grid;
            grid-template-columns: 2fr repeat(4, 1fr);
            gap: 64px;
            margin-bottom: 64px;
        }}

        .footer-brand p {{
            font-size: 15px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.7;
            margin-top: 16px;
            max-width: 320px;
        }}

        .footer-column h4 {{
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 20px;
            color: rgba(255, 255, 255, 0.9);
        }}

        .footer-column ul {{
            list-style: none;
        }}

        .footer-column li {{
            margin-bottom: 12px;
        }}

        .footer-column a {{
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            font-size: 15px;
            transition: var(--transition);
        }}

        .footer-column a:hover {{
            color: white;
        }}

        .footer-bottom {{
            padding-top: 40px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .footer-bottom p {{
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
        }}

        .social-link {{
            color: rgba(255, 255, 255, 0.7);
            transition: var(--transition);
        }}

        .social-link:hover {{
            color: white;
        }}

        /* ANIMATIONS */
        .fade-in {{
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }}

        .fade-in.visible {{
            opacity: 1;
            transform: translateY(0);
        }}

        /* RESPONSIVE */
        @media (max-width: 1024px) {{
            .hero-grid {{
                grid-template-columns: 1fr;
                gap: 48px;
            }}

            .hero-content h1 {{
                font-size: 44px;
            }}

            .stats-grid {{
                grid-template-columns: 1fr;
                gap: 40px;
            }}

            .why-grid,
            .skills-grid {{
                grid-template-columns: 1fr;
            }}

            .types-grid {{
                grid-template-columns: repeat(2, 1fr);
            }}

            .about-grid {{
                grid-template-columns: 1fr;
                gap: 48px;
            }}

            .footer-grid {{
                grid-template-columns: 1fr 1fr;
                gap: 40px;
            }}
        }}

        @media (max-width: 768px) {{
            .nav-menu {{
                display: none;
            }}

            .hero {{
                padding: 100px 0 60px;
            }}

            .hero-content h1 {{
                font-size: 36px;
            }}

            .hero-buttons {{
                flex-direction: column;
            }}

            .trust-indicators {{
                flex-direction: column;
                gap: 16px;
            }}

            section {{
                padding: 80px 0;
            }}

            .section-title {{
                font-size: 32px;
            }}

            .timeline::before {{
                left: 24px;
            }}

            .timeline-number {{
                width: 48px;
                height: 48px;
                font-size: 20px;
            }}

            .timeline-item {{
                padding-left: 72px;
            }}

            .types-grid {{
                grid-template-columns: 1fr;
            }}

            .final-cta h2 {{
                font-size: 32px;
            }}

            .final-cta-buttons {{
                flex-direction: column;
            }}

            .footer-grid {{
                grid-template-columns: 1fr;
            }}

            .footer-bottom {{
                flex-direction: column;
                gap: 20px;
                text-align: center;
            }}
        }}
    </style>
</head>
<body>
    <!-- NAVIGATION -->
    <nav id="navbar">
        <div class="nav-container">
            <a href="#" class="logo">Trajectoire</a>
            <ul class="nav-menu">
                <li><a href="#accueil">Accueil</a></li>
                <li><a href="#methode">Méthode</a></li>
                <li><a href="#accompagnement">Accompagnement</a></li>
                <li><a href="#tarifs">Tarifs</a></li>
                <li><a href="#ressources">Ressources</a></li>
                <li><a href="#apropos">À propos</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <div class="nav-actions">
                <a href="#" class="btn btn-ghost">Connexion</a>
                <a href="#" class="btn btn-primary">Créer mon espace</a>
            </div>
        </div>
    </nav>

    <!-- HERO SECTION -->
    <section class="hero" id="accueil">
        <div class="container">
            <div class="hero-grid">
                <div class="hero-content fade-in">
                    <h1>Préparez vos entretiens stratégiques avec méthode.</h1>
                    <p>Préparez vos entretiens de management grâce à une approche structurée, des simulations réalistes et des retours personnalisés.</p>
                    <div class="hero-buttons">
                        <a href="#" class="btn btn-primary">Commencer maintenant</a>
                        <a href="#methode" class="btn btn-secondary">Découvrir la méthode</a>
                    </div>
                    <div class="trust-indicators">
                        <div class="trust-item">
                            <svg class="trust-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span class="trust-text">Confidentialité garantie</span>
                        </div>
                        <div class="trust-item">
                            <svg class="trust-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span class="trust-text">Accompagnement premium</span>
                        </div>
                        <div class="trust-item">
                            <svg class="trust-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
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

    <!-- STATS SECTION -->
    <section class="stats">
        <div class="container">
            <div class="stats-grid">
                <div class="stat-item fade-in">
                    <div class="stat-number">+1800</div>
                    <div class="stat-label">cadres accompagnés</div>
                </div>
                <div class="stat-item fade-in">
                    <div class="stat-number">94%</div>
                    <div class="stat-label">déclarent être arrivés plus confiants</div>
                </div>
                <div class="stat-item fade-in">
                    <div class="stat-number">100%</div>
                    <div class="stat-label">Préparation adaptée à tous les niveaux de management</div>
                </div>
            </div>
        </div>
    </section>

    <!-- WHY TRAJECTOIRE -->
    <section id="methode">
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-label">Notre approche</span>
                <h2 class="section-title">Pourquoi Trajectoire ?</h2>
                <p class="section-subtitle">Une méthode éprouvée pour transformer votre préparation en avantage décisif.</p>
            </div>
            <div class="why-grid">
                <div class="why-card fade-in">
                    <div class="why-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3>Méthode structurée</h3>
                    <p>Un cadre méthodologique rigoureux inspiré des meilleures pratiques du conseil en stratégie et du coaching exécutif.</p>
                </div>
                <div class="why-card fade-in">
                    <div class="why-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <h3>Simulations réalistes</h3>
                    <p>Des mises en situation immersives avec des coachs expérimentés qui reproduisent fidèlement la pression de l'entretien réel.</p>
                </div>
                <div class="why-card fade-in">
                    <div class="why-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <h3>Retours personnalisés</h3>
                    <p>Des analyses détaillées et des recommandations concrètes pour progresser rapidement et atteindre vos objectifs.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="process">
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-label">Le processus</span>
                <h2 class="section-title">Comment ça fonctionne ?</h2>
                <p class="section-subtitle">Quatre étapes clés pour une préparation optimale.</p>
            </div>
            <div class="timeline">
                <div class="timeline-item fade-in">
                    <div class="timeline-number">1</div>
                    <div class="timeline-content">
                        <h3>Analyse</h3>
                        <p>Diagnostic approfondi de votre profil, de vos objectifs et du contexte spécifique de l'entretien. Identification des enjeux et des points de vigilance.</p>
                    </div>
                </div>
                <div class="timeline-item fade-in">
                    <div class="timeline-number">2</div>
                    <div class="timeline-content">
                        <h3>Préparation</h3>
                        <p>Construction d'une stratégie de communication sur mesure. Travail sur votre narrative, vos exemples clés et votre positionnement.</p>
                    </div>
                </div>
                <div class="timeline-item fade-in">
                    <div class="timeline-number">3</div>
                    <div class="timeline-content">
                        <h3>Simulation</h3>
                        <p>Mises en situation réalistes avec des coachs expérimentés. Reproduction fidèle des conditions réelles de l'entretien.</p>
                    </div>
                </div>
                <div class="timeline-item fade-in">
                    <div class="timeline-number">4</div>
                    <div class="timeline-content">
                        <h3>Débrief</h3>
                        <p>Analyse détaillée de votre performance. Recommandations actionnables et plan de progression personnalisé.</p>
                    </div>
                </div>
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
                <div class="skill-card fade-in">
                    <div class="skill-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h3>Leadership</h3>
                </div>
                <div class="skill-card fade-in">
                    <div class="skill-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                    </div>
                    <h3>Communication</h3>
                </div>
                <div class="skill-card fade-in">
                    <div class="skill-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                    </div>
                    <h3>Impact</h3>
                </div>
                <div class="skill-card fade-in">
                    <div class="skill-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                    </div>
                    <h3>Gestion du stress</h3>
                </div>
                <div class="skill-card fade-in">
                    <div class="skill-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                        </svg>
                    </div>
                    <h3>Argumentation</h3>
                </div>
                <div class="skill-card fade-in">
                    <div class="skill-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    </div>
                    <h3>Vision stratégique</h3>
                </div>
            </div>
        </div>
    </section>

    <!-- INTERVIEW TYPES -->
    <section>
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-label">Types d'entretiens</span>
                <h2 class="section-title">Pour quels entretiens ?</h2>
                <p class="section-subtitle">Une préparation adaptée à chaque contexte professionnel.</p>
            </div>
            <div class="types-grid">
                <div class="type-card fade-in">
                    <h3>Comité exécutif</h3>
                </div>
                <div class="type-card fade-in">
                    <h3>Manager</h3>
                </div>
                <div class="type-card fade-in">
                    <h3>Directeur</h3>
                </div>
                <div class="type-card fade-in">
                    <h3>Conseil d'administration</h3>
                </div>
                <div class="type-card fade-in">
                    <h3>Conseil</h3>
                </div>
                <div class="type-card fade-in">
                    <h3>Promotion interne</h3>
                </div>
                <div class="type-card fade-in">
                    <h3>Entretien international</h3>
                </div>
                <div class="type-card fade-in">
                    <h3>Poste de direction</h3>
                </div>
            </div>
        </div>
    </section>

    <!-- TRUST SECTION -->
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

    <!-- ABOUT SECTION -->
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
                        <span>Fondatrice & Directrice Générale</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ -->
    <section class="faq" id="ressources">
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-label">Questions fréquentes</span>
                <h2 class="section-title">Tout ce que vous devez savoir</h2>
            </div>
            <div class="faq-list">
                <div class="faq-item fade-in">
                    <button class="faq-question">
                        <span>Combien de temps dure une préparation complète ?</span>
                        <svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </button>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            Une préparation complète s'étend généralement sur 2 à 4 semaines, selon la complexité de l'entretien et vos objectifs. Nous adaptons le rythme à vos contraintes professionnelles pour une préparation optimale sans surcharge.
                        </div>
                    </div>
                </div>
                <div class="faq-item fade-in">
                    <button class="faq-question">
                        <span>Qui sont les coachs qui m'accompagnent ?</span>
                        <svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </button>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            Nos coachs sont d'anciens dirigeants, partenaires de cabinets de conseil ou DRH de grands groupes. Ils possèdent tous une double expertise : une expérience significative en entreprise et une certification en coaching exécutif.
                        </div>
                    </div>
                </div>
                <div class="faq-item fade-in">
                    <button class="faq-question">
                        <span>Comment se déroule une simulation d'entretien ?</span>
                        <svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </button>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            La simulation reproduit fidèlement les conditions réelles de votre entretien. Un coach expérimenté joue le rôle de l'intervieweur en suivant un scénario personnalisé. La séance est suivie d'un débrief approfondi avec des recommandations concrètes.
                        </div>
                    </div>
                </div>
                <div class="faq-item fade-in">
                    <button class="faq-question">
                        <span>La confidentialité est-elle garantie ?</span>
                        <svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </button>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            Absolument. La confidentialité est au cœur de notre engagement. Toutes les informations partagées restent strictement confidentielles. Nous signons systématiquement des accords de confidentialité et nos coachs sont tenus au secret professionnel.
                        </div>
                    </div>
                </div>
                <div class="faq-item fade-in">
                    <button class="faq-question">
                        <span>Puis-je préparer un entretien en urgence ?</span>
                        <svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </button>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            Oui, nous proposons des formats accélérés pour les entretiens imminents. En 48 à 72 heures, nous pouvons mettre en place une préparation intensive et efficace. Contactez-nous directement pour évaluer la faisabilité.
                        </div>
                    </div>
                </div>
                <div class="faq-item fade-in">
                    <button class="faq-question">
                        <span>Quels sont les tarifs ?</span>
                        <svg class="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </button>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            Nos tarifs varient selon le niveau de personnalisation et la durée de l'accompagnement. Nous proposons des formules à partir de 1500€ pour une préparation complète. Un devis détaillé vous est fourni après un premier échange pour comprendre vos besoins spécifiques.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FINAL CTA -->
    <section class="final-cta" id="contact">
        <div class="container">
            <h2 class="fade-in">Votre prochain entretien mérite une préparation à la hauteur.</h2>
            <div class="final-cta-buttons fade-in">
                <a href="#" class="btn btn-primary">Créer mon espace</a>
                <a href="#" class="btn btn-secondary">Réserver un échange</a>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="#" class="logo" style="color: white;">Trajectoire</a>
                    <p>La plateforme de préparation aux entretiens stratégiques pour cadres et dirigeants exigeants.</p>
                </div>
                <div class="footer-column">
                    <h4>Produit</h4>
                    <ul>
                        <li><a href="#methode">Méthode</a></li>
                        <li><a href="#accompagnement">Accompagnement</a></li>
                        <li><a href="#tarifs">Tarifs</a></li>
                        <li><a href="#">Témoignages</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Entreprise</h4>
                    <ul>
                        <li><a href="#apropos">À propos</a></li>
                        <li><a href="#">Carrières</a></li>
                        <li><a href="#">Presse</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Ressources</h4>
                    <ul>
                        <li><a href="#ressources">Blog</a></li>
                        <li><a href="#ressources">Guides</a></li>
                        <li><a href="#ressources">FAQ</a></li>
                        <li><a href="#">Webinaires</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Légal</h4>
                    <ul>
                        <li><a href="#">Mentions légales</a></li>
                        <li><a href="#">Confidentialité</a></li>
                        <li><a href="#">CGU</a></li>
                        <li><a href="#">Cookies</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Trajectoire. Tous droits réservés.</p>
                <a href="#" class="social-link" aria-label="LinkedIn">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>
            </div>
        </div>
    </footer>

    <script>
        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {{
            if (window.scrollY > 50) {{
                navbar.classList.add('scrolled');
            }} else {{
                navbar.classList.remove('scrolled');
            }}
        }});

        // Fade-in animations
        const observerOptions = {{
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }};

        const observer = new IntersectionObserver((entries) => {{
            entries.forEach(entry => {{
                if (entry.isIntersecting) {{
                    entry.target.classList.add('visible');
                }}
            }});
        }}, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {{
            observer.observe(el);
        }});

        // FAQ Accordion
        document.querySelectorAll('.faq-question').forEach(button => {{
            button.addEventListener('click', () => {{
                const item = button.parentElement;
                const answer = item.querySelector('.faq-answer');
                const content = answer.querySelector('.faq-answer-content');
                const isActive = item.classList.contains('active');

                // Close all other items
                document.querySelectorAll('.faq-item').forEach(otherItem => {{
                    if (otherItem !== item) {{
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    }}
                }});

                // Toggle current item
                if (isActive) {{
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                }} else {{
                    item.classList.add('active');
                    answer.style.maxHeight = content.scrollHeight + 'px';
                }}
            }});
        }});

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {{
            anchor.addEventListener('click', function (e) {{
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {{
                    const offset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({{
                        top: targetPosition,
                        behavior: 'smooth'
                    }});
                }}
            }});
        }});
    </script>
</body>
</html>'''

# Write the HTML file
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✓ Trajectoire homepage generated successfully!")
print(f"✓ File size: {len(html):,} bytes")
print(f"✓ Images embedded: Hero ({len(hero_b64):,} chars), Founder ({len(founder_b64):,} chars)")
