#!/usr/bin/env python3
"""Generate Progression page"""

html = '''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <title>Progression | Trajectoire</title>
    <style>
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
            --warning: #F59E0B;
            --radius: 12px;
            --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
            --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04);
            --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04);
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --sidebar-width: 260px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg); color: var(--text-primary);
            line-height: 1.6; -webkit-font-smoothing: antialiased;
        }
        h1,h2,h3,h4 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; letter-spacing: -0.02em; }
        .app-layout { display: flex; min-height: 100vh; }

        /* SIDEBAR */
        .sidebar {
            width: var(--sidebar-width); background: var(--card);
            border-right: 1px solid var(--border);
            display: flex; flex-direction: column;
            position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
        }
        .sidebar-logo {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 20px; font-weight: 700; color: var(--text-primary);
            text-decoration: none; padding: 24px 24px 32px;
            display: block; letter-spacing: -0.02em;
        }
        .sidebar-logo-dot { display: inline-block; width: 5px; height: 5px; background: var(--gold-accent); border-radius: 50%; margin-left: 2px; vertical-align: super; }
        .sidebar-nav { flex: 1; padding: 0 12px; overflow-y: auto; }
        .sidebar-section { margin-bottom: 24px; }
        .sidebar-section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-secondary); padding: 0 12px; margin-bottom: 8px; }
        .sidebar-link {
            display: flex; align-items: center; gap: 12px;
            padding: 10px 12px; border-radius: 8px;
            font-size: 14px; font-weight: 500;
            color: var(--text-secondary); text-decoration: none;
            transition: var(--transition); margin-bottom: 2px;
        }
        .sidebar-link:hover { background: var(--bg); color: var(--text-primary); }
        .sidebar-link.active { background: rgba(30,64,175,0.08); color: var(--blue-primary); font-weight: 600; }
        .sidebar-link svg { width: 20px; height: 20px; flex-shrink: 0; }
        .sidebar-footer { padding: 16px 12px; border-top: 1px solid var(--border); }
        .sidebar-user {
            display: flex; align-items: center; gap: 12px;
            padding: 10px 12px; border-radius: 8px;
            text-decoration: none; transition: var(--transition);
        }
        .sidebar-user:hover { background: var(--bg); }
        .sidebar-avatar {
            width: 36px; height: 36px; border-radius: 50%;
            background: var(--blue-primary); color: white;
            display: flex; align-items: center; justify-content: center;
            font-size: 14px; font-weight: 600; flex-shrink: 0;
        }
        .sidebar-user-info { flex: 1; min-width: 0; }
        .sidebar-user-name { font-size: 14px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sidebar-user-role { font-size: 12px; color: var(--text-secondary); }

        /* MAIN */
        .main-content { margin-left: var(--sidebar-width); flex: 1; min-height: 100vh; }
        .top-bar {
            padding: 16px 32px; background: var(--card);
            border-bottom: 1px solid var(--border);
            display: flex; align-items: center; justify-content: space-between;
        }
        .top-bar-title { font-size: 14px; color: var(--text-secondary); font-weight: 500; }
        .top-bar-actions { display: flex; gap: 12px; align-items: center; }
        .btn { display: inline-flex; align-items: center; justify-content: center; padding: 10px 20px; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; transition: var(--transition); cursor: pointer; border: none; }
        .btn-primary { background: var(--blue-primary); color: white; }
        .btn-primary:hover { background: var(--blue-hover); transform: translateY(-1px); box-shadow: var(--shadow-md); }
        .btn-secondary { background: var(--card); color: var(--text-primary); border: 1px solid var(--border); }
        .btn-secondary:hover { background: var(--bg); }
        .page-content { padding: 32px; max-width: 1400px; }
        .page-header { margin-bottom: 32px; }
        .page-header h1 { font-size: 32px; margin-bottom: 8px; }
        .page-header p { font-size: 16px; color: var(--text-secondary); }

        /* CARDS */
        .card { background: var(--card); border-radius: var(--radius); border: 1px solid var(--border); padding: 24px; transition: var(--transition); }
        .card:hover { box-shadow: var(--shadow-sm); }
        
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }

        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .card-title { font-size: 18px; font-weight: 600; }

        /* SCORE CIRCLE */
        .score-circle-container { display: flex; flex-direction: column; align-items: center; padding: 32px; }
        .score-circle { position: relative; width: 200px; height: 200px; margin-bottom: 24px; }
        .score-circle svg { transform: rotate(-90deg); }
        .score-circle-bg { fill: none; stroke: var(--border); stroke-width: 12; }
        .score-circle-progress { fill: none; stroke: var(--blue-primary); stroke-width: 12; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }
        .score-value { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
        .score-number { font-family: 'Playfair Display', Georgia, serif; font-size: 48px; font-weight: 700; color: var(--blue-primary); }
        .score-label { font-size: 14px; color: var(--text-secondary); margin-top: 4px; }

        /* PROGRESS BARS */
        .skill-item { margin-bottom: 20px; }
        .skill-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .skill-name { font-size: 14px; font-weight: 600; }
        .skill-score { font-size: 14px; color: var(--text-secondary); }
        .progress-bar { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 4px; transition: width 0.8s ease; }
        .progress-fill.blue { background: var(--blue-primary); }
        .progress-fill.gold { background: var(--gold-accent); }
        .progress-fill.green { background: var(--success); }

        /* OBJECTIVES */
        .objective-item { display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); }
        .objective-item:last-child { border-bottom: none; }
        .objective-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .objective-icon svg { width: 20px; height: 20px; }
        .objective-content { flex: 1; }
        .objective-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .objective-desc { font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; }
        .objective-progress { display: flex; align-items: center; gap: 8px; }
        .objective-progress-bar { flex: 1; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
        .objective-progress-fill { height: 100%; background: var(--blue-primary); border-radius: 3px; }
        .objective-progress-text { font-size: 12px; color: var(--text-secondary); font-weight: 600; }

        /* TIMELINE */
        .timeline { position: relative; padding-left: 32px; }
        .timeline::before { content: ''; position: absolute; left: 11px; top: 0; bottom: 0; width: 2px; background: var(--border); }
        .timeline-item { position: relative; padding-bottom: 24px; }
        .timeline-item:last-child { padding-bottom: 0; }
        .timeline-dot { position: absolute; left: -32px; top: 0; width: 24px; height: 24px; border-radius: 50%; background: var(--card); border: 2px solid var(--blue-primary); display: flex; align-items: center; justify-content: center; }
        .timeline-dot.completed { background: var(--blue-primary); }
        .timeline-dot.completed svg { color: white; }
        .timeline-content { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
        .timeline-date { font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
        .timeline-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .timeline-desc { font-size: 13px; color: var(--text-secondary); }

        /* CHECKLIST */
        .checklist-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
        .checklist-item:last-child { border-bottom: none; }
        .checklist-checkbox { width: 20px; height: 20px; border: 2px solid var(--border); border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); }
        .checklist-checkbox.checked { background: var(--success); border-color: var(--success); }
        .checklist-checkbox.checked svg { color: white; }
        .checklist-text { flex: 1; font-size: 14px; }
        .checklist-text.completed { text-decoration: line-through; color: var(--text-secondary); }

        /* RECOMMENDATIONS */
        .recommendation-item { padding: 16px 0; border-bottom: 1px solid var(--border); }
        .recommendation-item:last-child { border-bottom: none; }
        .recommendation-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .recommendation-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(212,175,55,0.1); display: flex; align-items: center; justify-content: center; }
        .recommendation-icon svg { width: 16px; height: 16px; color: var(--gold-accent); }
        .recommendation-title { font-size: 15px; font-weight: 600; }
        .recommendation-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }

        /* CTA */
        .cta-section { background: linear-gradient(135deg, var(--blue-primary) 0%, var(--blue-hover) 100%); border-radius: var(--radius); padding: 48px; text-align: center; color: white; margin-top: 32px; }
        .cta-title { font-size: 28px; margin-bottom: 12px; }
        .cta-desc { font-size: 16px; margin-bottom: 24px; opacity: 0.9; }
        .cta-btn { background: white; color: var(--blue-primary); padding: 14px 32px; border-radius: 10px; font-weight: 600; text-decoration: none; display: inline-block; transition: var(--transition); }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }

        /* FADE */
        .fade-in { opacity: 0; transform: translateY(20px); animation: fadeUp 0.6s ease forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .fade-in:nth-child(2) { animation-delay: 0.1s; }
        .fade-in:nth-child(3) { animation-delay: 0.2s; }
        .fade-in:nth-child(4) { animation-delay: 0.3s; }

        @media (max-width: 1024px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; }
            .grid-2, .grid-3 { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
<div class="app-layout">
    <aside class="sidebar">
        <a href="../dashboard/index.html" class="sidebar-logo">Trajectoire<span class="sidebar-logo-dot"></span></a>
        <nav class="sidebar-nav">
            <div class="sidebar-section">
                <div class="sidebar-section-label">Préparation</div>
                <a href="../dashboard/index.html" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                    Tableau de bord
                </a>
                <a href="../dashboard/cv/index.html" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Mon CV
                </a>
                <a href="../simulations/index.html" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Simulations
                </a>
                <a href="../debrief/index.html" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                    Débriefs
                </a>
                <a href="../progression/index.html" class="sidebar-link active">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                    Progression
                </a>
                <a href="../historique/index.html" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Historique
                </a>
            </div>
            <div class="sidebar-section">
                <div class="sidebar-section-label">Compte</div>
                <a href="../abonnement/index.html" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                    Abonnement
                </a>
                <a href="../profil/index.html" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    Profil
                </a>
            </div>
        </nav>
        <div class="sidebar-footer">
            <a href="../profil/index.html" class="sidebar-user">
                <div class="sidebar-avatar">ML</div>
                <div class="sidebar-user-info">
                    <div class="sidebar-user-name">Marie Laurent</div>
                    <div class="sidebar-user-role">Directrice Marketing</div>
                </div>
            </a>
        </div>
    </aside>

    <main class="main-content">
        <div class="top-bar">
            <span class="top-bar-title">Progression</span>
            <div class="top-bar-actions">
                <a href="../simulations/index.html" class="btn btn-primary">Nouvelle simulation</a>
            </div>
        </div>

        <div class="page-content">
            <div class="page-header fade-in">
                <h1>Votre progression</h1>
                <p>Suivez votre évolution et atteignez vos objectifs de carrière.</p>
            </div>

            <!-- Score Global + Forces/Axes -->
            <div class="grid-2">
                <div class="card fade-in">
                    <div class="score-circle-container">
                        <div class="score-circle">
                            <svg width="200" height="200">
                                <circle class="score-circle-bg" cx="100" cy="100" r="88"/>
                                <circle class="score-circle-progress" cx="100" cy="100" r="88" 
                                    stroke-dasharray="553" stroke-dashoffset="138"/>
                            </svg>
                            <div class="score-value">
                                <div class="score-number">87</div>
                                <div class="score-label">Score global</div>
                            </div>
                        </div>
                        <p style="text-align: center; color: var(--text-secondary); font-size: 14px;">
                            Excellent ! Vous êtes dans le top 15% des utilisateurs.
                        </p>
                    </div>
                </div>

                <div class="card fade-in">
                    <div class="card-header">
                        <h3 class="card-title">Forces & Axes d'amélioration</h3>
                    </div>
                    <div style="margin-bottom: 24px;">
                        <h4 style="font-size: 14px; color: var(--success); margin-bottom: 12px; font-family: 'Inter', sans-serif; font-weight: 600;">Vos forces</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            <span style="background: rgba(22,163,74,0.1); color: var(--success); padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;">Leadership</span>
                            <span style="background: rgba(22,163,74,0.1); color: var(--success); padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;">Communication</span>
                            <span style="background: rgba(22,163,74,0.1); color: var(--success); padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;">Argumentation</span>
                        </div>
                    </div>
                    <div>
                        <h4 style="font-size: 14px; color: var(--warning); margin-bottom: 12px; font-family: 'Inter', sans-serif; font-weight: 600;">Axes d'amélioration</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            <span style="background: rgba(245,158,11,0.1); color: var(--warning); padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;">Gestion du stress</span>
                            <span style="background: rgba(245,158,11,0.1); color: var(--warning); padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;">Vision stratégique</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Compétences -->
            <div class="card fade-in" style="margin-bottom: 24px;">
                <div class="card-header">
                    <h3 class="card-title">Compétences à renforcer</h3>
                </div>
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">Leadership</span>
                        <span class="skill-score">92%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill blue" style="width: 92%;"></div>
                    </div>
                </div>
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">Communication</span>
                        <span class="skill-score">88%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill blue" style="width: 88%;"></div>
                    </div>
                </div>
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">Impact</span>
                        <span class="skill-score">85%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill blue" style="width: 85%;"></div>
                    </div>
                </div>
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">Gestion du stress</span>
                        <span class="skill-score">78%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill gold" style="width: 78%;"></div>
                    </div>
                </div>
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">Argumentation</span>
                        <span class="skill-score">90%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill blue" style="width: 90%;"></div>
                    </div>
                </div>
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">Vision stratégique</span>
                        <span class="skill-score">65%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill gold" style="width: 65%;"></div>
                    </div>
                </div>
            </div>

            <!-- Objectifs prioritaires -->
            <div class="grid-2">
                <div class="card fade-in">
                    <div class="card-header">
                        <h3 class="card-title">Plan sur 7 jours</h3>
                    </div>
                    <div class="objective-item">
                        <div class="objective-icon" style="background: rgba(30,64,175,0.08);">
                            <svg fill="none" stroke="var(--blue-primary)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div class="objective-content">
                            <div class="objective-title">Simulation entretien directeur</div>
                            <div class="objective-desc">Compléter une simulation complète</div>
                            <div class="objective-progress">
                                <div class="objective-progress-bar">
                                    <div class="objective-progress-fill" style="width: 60%;"></div>
                                </div>
                                <span class="objective-progress-text">3/5</span>
                            </div>
                        </div>
                    </div>
                    <div class="objective-item">
                        <div class="objective-icon" style="background: rgba(212,175,55,0.1);">
                            <svg fill="none" stroke="var(--gold-accent)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                        </div>
                        <div class="objective-content">
                            <div class="objective-title">Optimiser CV</div>
                            <div class="objective-desc">Intégrer les recommandations ATS</div>
                            <div class="objective-progress">
                                <div class="objective-progress-bar">
                                    <div class="objective-progress-fill" style="width: 40%;"></div>
                                </div>
                                <span class="objective-progress-text">2/5</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card fade-in">
                    <div class="card-header">
                        <h3 class="card-title">Plan sur 30 jours</h3>
                    </div>
                    <div class="objective-item">
                        <div class="objective-icon" style="background: rgba(22,163,74,0.08);">
                            <svg fill="none" stroke="var(--success)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div class="objective-content">
                            <div class="objective-title">Maîtriser vision stratégique</div>
                            <div class="objective-desc">Atteindre 80% de score</div>
                            <div class="objective-progress">
                                <div class="objective-progress-bar">
                                    <div class="objective-progress-fill" style="width: 65%;"></div>
                                </div>
                                <span class="objective-progress-text">65%</span>
                            </div>
                        </div>
                    </div>
                    <div class="objective-item">
                        <div class="objective-icon" style="background: rgba(30,64,175,0.08);">
                            <svg fill="none" stroke="var(--blue-primary)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div class="objective-content">
                            <div class="objective-title">10 heures de pratique</div>
                            <div class="objective-desc">Accumuler du temps de préparation</div>
                            <div class="objective-progress">
                                <div class="objective-progress-bar">
                                    <div class="objective-progress-fill" style="width: 70%;"></div>
                                </div>
                                <span class="objective-progress-text">7/10h</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Checklist interactive -->
            <div class="card fade-in" style="margin-bottom: 24px;">
                <div class="card-header">
                    <h3 class="card-title">Checklist de préparation</h3>
                </div>
                <div class="checklist-item">
                    <div class="checklist-checkbox checked" onclick="this.classList.toggle('checked'); this.nextElementSibling.classList.toggle('completed');">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <span class="checklist-text completed">Importer mon CV à jour</span>
                </div>
                <div class="checklist-item">
                    <div class="checklist-checkbox checked" onclick="this.classList.toggle('checked'); this.nextElementSibling.classList.toggle('completed');">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <span class="checklist-text completed">Analyser l'offre d'emploi</span>
                </div>
                <div class="checklist-item">
                    <div class="checklist-checkbox checked" onclick="this.classList.toggle('checked'); this.nextElementSibling.classList.toggle('completed');">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <span class="checklist-text completed">Compléter 3 simulations</span>
                </div>
                <div class="checklist-item">
                    <div class="checklist-checkbox" onclick="this.classList.toggle('checked'); this.nextElementSibling.classList.toggle('completed');">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <span class="checklist-text">Optimiser mon CV selon les recommandations</span>
                </div>
                <div class="checklist-item">
                    <div class="checklist-checkbox" onclick="this.classList.toggle('checked'); this.nextElementSibling.classList.toggle('completed');">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <span class="checklist-text">Atteindre 85% de score moyen</span>
                </div>
            </div>

            <!-- Recommandations -->
            <div class="card fade-in" style="margin-bottom: 24px;">
                <div class="card-header">
                    <h3 class="card-title">Recommandations personnalisées</h3>
                </div>
                <div class="recommendation-item">
                    <div class="recommendation-header">
                        <div class="recommendation-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                        </div>
                        <div class="recommendation-title">Développer votre vision stratégique</div>
                    </div>
                    <div class="recommendation-desc">
                        Concentrez-vous sur des exercices de réflexion stratégique. Préparez des exemples concrets montrant comment vous avez anticipé des tendances du marché ou pris des décisions à long terme.
                    </div>
                </div>
                <div class="recommendation-item">
                    <div class="recommendation-header">
                        <div class="recommendation-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                        </div>
                        <div class="recommendation-title">Améliorer la gestion du stress</div>
                    </div>
                    <div class="recommendation-desc">
                        Pratiquez des techniques de respiration avant vos simulations. Concentrez-vous sur la clarté de vos réponses plutôt que sur la rapidité.
                    </div>
                </div>
                <div class="recommendation-item">
                    <div class="recommendation-header">
                        <div class="recommendation-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </div>
                        <div class="recommendation-title">Renforcer votre impact personnel</div>
                    </div>
                    <div class="recommendation-desc">
                        Travaillez sur votre langage corporel et votre ton de voix. Enregistrez-vous pour identifier les tics de langage et les améliorer.
                    </div>
                </div>
            </div>

            <!-- CTA -->
            <div class="cta-section fade-in">
                <h2 class="cta-title">Prêt pour votre prochaine simulation ?</h2>
                <p class="cta-desc">Continuez à progresser avec une nouvelle simulation personnalisée.</p>
                <a href="../simulations/index.html" class="cta-btn">Lancer une simulation</a>
            </div>
        </div>
    </main>
</div>
</body>
</html>'''

with open('progression/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✓ Progression page generated")
