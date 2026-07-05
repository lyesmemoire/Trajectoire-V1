#!/usr/bin/env python3
"""Generate the Trajectoire premium signup page"""

# Read the base64 encoded image
with open('/tmp/signup_b64.txt', 'r') as f:
    signup_b64 = f.read().strip()

html = f'''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Trajectoire - Créez votre espace de préparation aux entretiens stratégiques.">
    <title>Créer mon espace | Trajectoire</title>
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
            --shadow-card: 0 4px 32px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04);
            --shadow-input-focus: 0 0 0 3px rgba(30, 64, 175, 0.1);
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }}

        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        html, body {{
            height: 100%;
        }}

        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: var(--bg);
            color: var(--text-primary);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }}

        /* LAYOUT */
        .signup-page {{
            display: flex;
            min-height: 100vh;
        }}

        /* LEFT PANEL - IMAGE */
        .left-panel {{
            width: 45%;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: flex-end;
        }}

        .left-panel img {{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }}

        .left-overlay {{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg, rgba(17, 24, 39, 0) 40%, rgba(17, 24, 39, 0.55) 100%);
            z-index: 1;
        }}

        .left-content {{
            position: relative;
            z-index: 2;
            padding: 48px;
            color: white;
        }}

        .left-quote {{
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 26px;
            font-weight: 500;
            line-height: 1.4;
            margin-bottom: 20px;
            max-width: 420px;
            opacity: 0.95;
        }}

        .left-author {{
            font-size: 14px;
            font-weight: 500;
            opacity: 0.75;
            letter-spacing: 0.02em;
        }}

        /* RIGHT PANEL - FORM */
        .right-panel {{
            width: 55%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px;
            position: relative;
        }}

        .form-wrapper {{
            width: 100%;
            max-width: 480px;
        }}

        .form-card {{
            background: var(--card);
            border-radius: var(--radius);
            padding: 48px 40px;
            box-shadow: var(--shadow-card);
            border: 1px solid rgba(229, 231, 235, 0.5);
            opacity: 0;
            transform: translateY(20px);
            animation: fadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
        }}

        @keyframes fadeUp {{
            to {{
                opacity: 1;
                transform: translateY(0);
            }}
        }}

        /* LOGO */
        .logo {{
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 22px;
            font-weight: 700;
            color: var(--text-primary);
            text-decoration: none;
            letter-spacing: -0.02em;
            display: inline-block;
            margin-bottom: 32px;
        }}

        .logo-dot {{
            display: inline-block;
            width: 6px;
            height: 6px;
            background: var(--gold-accent);
            border-radius: 50%;
            margin-left: 2px;
            vertical-align: super;
        }}

        /* HEADINGS */
        .form-headline {{
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 28px;
            font-weight: 600;
            color: var(--text-primary);
            line-height: 1.25;
            margin-bottom: 12px;
            letter-spacing: -0.02em;
        }}

        .form-subtitle {{
            font-size: 15px;
            color: var(--text-secondary);
            line-height: 1.65;
            margin-bottom: 32px;
        }}

        /* FORM FIELDS */
        .form-row {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }}

        .form-group {{
            margin-bottom: 20px;
        }}

        .form-label {{
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 8px;
            letter-spacing: 0.01em;
        }}

        .form-input {{
            width: 100%;
            padding: 13px 16px;
            font-family: 'Inter', sans-serif;
            font-size: 15px;
            color: var(--text-primary);
            background: var(--bg);
            border: 1.5px solid var(--border);
            border-radius: 10px;
            outline: none;
            transition: var(--transition);
        }}

        .form-input::placeholder {{
            color: #9CA3AF;
        }}

        .form-input:hover {{
            border-color: #D1D5DB;
        }}

        .form-input:focus {{
            border-color: var(--blue-primary);
            background: var(--card);
            box-shadow: var(--shadow-input-focus);
        }}

        .form-input.error {{
            border-color: var(--error);
        }}

        .password-wrapper {{
            position: relative;
        }}

        .password-toggle {{
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 4px;
            display: flex;
            align-items: center;
            transition: var(--transition);
        }}

        .password-toggle:hover {{
            color: var(--text-primary);
        }}

        .password-toggle svg {{
            width: 18px;
            height: 18px;
        }}

        .password-strength {{
            display: flex;
            gap: 4px;
            margin-top: 8px;
        }}

        .strength-bar {{
            flex: 1;
            height: 3px;
            background: var(--border);
            border-radius: 2px;
            transition: var(--transition);
        }}

        .strength-bar.active.weak {{ background: var(--error); }}
        .strength-bar.active.medium {{ background: var(--gold-accent); }}
        .strength-bar.active.strong {{ background: var(--success); }}

        /* CHECKBOX */
        .form-checkbox {{
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 28px;
            cursor: pointer;
        }}

        .form-checkbox input {{
            display: none;
        }}

        .checkbox-custom {{
            width: 20px;
            height: 20px;
            min-width: 20px;
            border: 1.5px solid var(--border);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
            margin-top: 1px;
            background: var(--bg);
        }}

        .checkbox-custom svg {{
            width: 12px;
            height: 12px;
            color: white;
            opacity: 0;
            transform: scale(0.8);
            transition: var(--transition);
        }}

        .form-checkbox input:checked + .checkbox-custom {{
            background: var(--blue-primary);
            border-color: var(--blue-primary);
        }}

        .form-checkbox input:checked + .checkbox-custom svg {{
            opacity: 1;
            transform: scale(1);
        }}

        .checkbox-text {{
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.5;
        }}

        .checkbox-text a {{
            color: var(--blue-primary);
            text-decoration: none;
            font-weight: 500;
            transition: var(--transition);
        }}

        .checkbox-text a:hover {{
            color: var(--blue-hover);
            text-decoration: underline;
        }}

        /* BUTTONS */
        .btn-primary {{
            width: 100%;
            padding: 15px 24px;
            font-family: 'Inter', sans-serif;
            font-size: 15px;
            font-weight: 600;
            color: white;
            background: var(--blue-primary);
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: var(--transition);
            letter-spacing: 0.01em;
            position: relative;
            overflow: hidden;
        }}

        .btn-primary:hover {{
            background: var(--blue-hover);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
        }}

        .btn-primary:active {{
            transform: translateY(0);
        }}

        .btn-primary:disabled {{
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }}

        .btn-primary .btn-loader {{
            display: none;
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
            margin: 0 auto;
        }}

        @keyframes spin {{
            to {{ transform: rotate(360deg); }}
        }}

        .btn-primary.loading .btn-text {{
            display: none;
        }}

        .btn-primary.loading .btn-loader {{
            display: block;
        }}

        /* DIVIDER */
        .divider {{
            display: flex;
            align-items: center;
            gap: 16px;
            margin: 24px 0;
        }}

        .divider-line {{
            flex: 1;
            height: 1px;
            background: var(--border);
        }}

        .divider-text {{
            font-size: 13px;
            color: var(--text-secondary);
            font-weight: 500;
        }}

        /* SOCIAL BUTTONS */
        .social-buttons {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 24px;
        }}

        .btn-social {{
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 13px 16px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
            background: var(--card);
            border: 1.5px solid var(--border);
            border-radius: 10px;
            cursor: pointer;
            transition: var(--transition);
        }}

        .btn-social:hover {{
            border-color: #D1D5DB;
            background: var(--bg);
        }}

        .btn-social svg {{
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }}

        /* LOGIN LINK */
        .login-link {{
            text-align: center;
            margin-top: 4px;
            font-size: 14px;
            color: var(--text-secondary);
        }}

        .login-link a {{
            color: var(--blue-primary);
            text-decoration: none;
            font-weight: 600;
            transition: var(--transition);
        }}

        .login-link a:hover {{
            color: var(--blue-hover);
            text-decoration: underline;
        }}

        /* REASSURANCE */
        .reassurance {{
            text-align: center;
            margin-top: 28px;
            padding-top: 24px;
            border-top: 1px solid var(--border);
        }}

        .reassurance-items {{
            display: flex;
            flex-direction: column;
            gap: 8px;
        }}

        .reassurance-item {{
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 13px;
            color: var(--text-secondary);
        }}

        .reassurance-item svg {{
            width: 14px;
            height: 14px;
            color: var(--success);
            flex-shrink: 0;
        }}

        /* FOOTER */
        .signup-footer {{
            position: absolute;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 24px;
        }}

        .signup-footer a {{
            font-size: 12px;
            color: var(--text-secondary);
            text-decoration: none;
            transition: var(--transition);
            opacity: 0.7;
        }}

        .signup-footer a:hover {{
            opacity: 1;
            color: var(--text-primary);
        }}

        /* LEFT PANEL ANIMATION */
        .left-panel img {{
            opacity: 0;
            transform: scale(1.05);
            animation: imageReveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
        }}

        @keyframes imageReveal {{
            to {{
                opacity: 1;
                transform: scale(1);
            }}
        }}

        .left-content {{
            opacity: 0;
            transform: translateY(20px);
            animation: fadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards;
        }}

        /* RESPONSIVE */
        @media (max-width: 1024px) {{
            .left-panel {{
                width: 40%;
            }}
            .right-panel {{
                width: 60%;
                padding: 36px;
            }}
            .left-quote {{
                font-size: 22px;
            }}
            .left-content {{
                padding: 36px;
            }}
        }}

        @media (max-width: 768px) {{
            .signup-page {{
                flex-direction: column;
            }}
            .left-panel {{
                width: 100%;
                height: 280px;
                min-height: 280px;
            }}
            .right-panel {{
                width: 100%;
                padding: 24px;
                min-height: auto;
            }}
            .form-card {{
                padding: 32px 24px;
                box-shadow: none;
                border: none;
                background: transparent;
            }}
            .form-row {{
                grid-template-columns: 1fr;
                gap: 0;
            }}
            .left-content {{
                padding: 24px;
            }}
            .left-quote {{
                font-size: 20px;
            }}
            .social-buttons {{
                grid-template-columns: 1fr;
            }}
            .signup-footer {{
                position: relative;
                bottom: auto;
                left: auto;
                transform: none;
                justify-content: center;
                padding: 24px 0 32px;
            }}
        }}

        /* FOCUS VISIBLE */
        *:focus-visible {{
            outline: 2px solid var(--blue-primary);
            outline-offset: 2px;
        }}

        .form-input:focus-visible {{
            outline: none;
        }}

        /* ERROR MESSAGE */
        .field-error {{
            font-size: 12px;
            color: var(--error);
            margin-top: 6px;
            display: none;
        }}

        .field-error.visible {{
            display: block;
        }}
    </style>
</head>
<body>
    <div class="signup-page">
        <!-- LEFT PANEL -->
        <div class="left-panel">
            <img src="data:image/jpeg;base64,{signup_b64}" alt="Cadre dirigeant préparant sa stratégie d'entretien">
            <div class="left-overlay"></div>
            <div class="left-content">
                <p class="left-quote">« La préparation est la clé de toute réussite. Chaque entretien est une opportunité de démontrer votre valeur. »</p>
                <p class="left-author">— Philosophie Trajectoire</p>
            </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="right-panel">
            <div class="form-wrapper">
                <div class="form-card">
                    <!-- Logo -->
                    <a href="index.html" class="logo">Trajectoire<span class="logo-dot"></span></a>

                    <!-- Headline -->
                    <h1 class="form-headline">Créez votre espace de préparation.</h1>
                    <p class="form-subtitle">Commencez à préparer vos prochains entretiens avec une méthode structurée et un accompagnement personnalisé.</p>

                    <!-- Social Login -->
                    <div class="social-buttons">
                        <button type="button" class="btn-social" id="googleBtn">
                            <svg viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span>Google</span>
                        </button>
                        <button type="button" class="btn-social" id="microsoftBtn">
                            <svg viewBox="0 0 24 24">
                                <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                                <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                                <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                                <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                            </svg>
                            <span>Microsoft</span>
                        </button>
                    </div>

                    <!-- Divider -->
                    <div class="divider">
                        <div class="divider-line"></div>
                        <span class="divider-text">ou</span>
                        <div class="divider-line"></div>
                    </div>

                    <!-- Form -->
                    <form id="signupForm" novalidate>
                        <!-- Name Row -->
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="firstName">Prénom</label>
                                <input type="text" id="firstName" class="form-input" placeholder="Marie" required>
                                <div class="field-error" id="firstNameError">Veuillez renseigner votre prénom.</div>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="lastName">Nom</label>
                                <input type="text" id="lastName" class="form-input" placeholder="Laurent" required>
                                <div class="field-error" id="lastNameError">Veuillez renseigner votre nom.</div>
                            </div>
                        </div>

                        <!-- Email -->
                        <div class="form-group">
                            <label class="form-label" for="email">Adresse e-mail</label>
                            <input type="email" id="email" class="form-input" placeholder="marie.laurent@entreprise.fr" required>
                            <div class="field-error" id="emailError">Veuillez renseigner une adresse e-mail valide.</div>
                        </div>

                        <!-- Password -->
                        <div class="form-group">
                            <label class="form-label" for="password">Mot de passe</label>
                            <div class="password-wrapper">
                                <input type="password" id="password" class="form-input" placeholder="Minimum 8 caractères" required minlength="8">
                                <button type="button" class="password-toggle" id="togglePassword" aria-label="Afficher le mot de passe">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" id="eyeIcon">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="password-strength">
                                <div class="strength-bar" id="str1"></div>
                                <div class="strength-bar" id="str2"></div>
                                <div class="strength-bar" id="str3"></div>
                                <div class="strength-bar" id="str4"></div>
                            </div>
                            <div class="field-error" id="passwordError">Le mot de passe doit contenir au moins 8 caractères.</div>
                        </div>

                        <!-- Confirm Password -->
                        <div class="form-group">
                            <label class="form-label" for="confirmPassword">Confirmer le mot de passe</label>
                            <div class="password-wrapper">
                                <input type="password" id="confirmPassword" class="form-input" placeholder="Retapez votre mot de passe" required>
                                <button type="button" class="password-toggle" id="toggleConfirmPassword" aria-label="Afficher le mot de passe">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="field-error" id="confirmPasswordError">Les mots de passe ne correspondent pas.</div>
                        </div>

                        <!-- Checkbox -->
                        <label class="form-checkbox">
                            <input type="checkbox" id="terms" required>
                            <div class="checkbox-custom">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <span class="checkbox-text">J'accepte les <a href="#">Conditions Générales</a> et la <a href="#">Politique de confidentialité</a>.</span>
                        </label>

                        <!-- Submit -->
                        <button type="submit" class="btn-primary" id="submitBtn">
                            <span class="btn-text">Créer mon espace</span>
                            <div class="btn-loader"></div>
                        </button>
                    </form>

                    <!-- Login Link -->
                    <p class="login-link" style="margin-top: 20px;">
                        Déjà inscrit ? <a href="#">Se connecter</a>
                    </p>

                    <!-- Reassurance -->
                    <div class="reassurance">
                        <div class="reassurance-items">
                            <div class="reassurance-item">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                                <span>Vos données restent confidentielles.</span>
                            </div>
                            <div class="reassurance-item">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>Aucun engagement.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="signup-footer">
                <a href="#">Mentions légales</a>
                <a href="#">Confidentialité</a>
                <a href="#">CGU</a>
            </div>
        </div>
    </div>

    <script>
        // Password visibility toggles
        function setupPasswordToggle(toggleId, inputId) {{
            const toggle = document.getElementById(toggleId);
            const input = document.getElementById(inputId);
            toggle.addEventListener('click', () => {{
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                toggle.setAttribute('aria-label', type === 'password' ? 'Afficher le mot de passe' : 'Masquer le mot de passe');
            }});
        }}
        setupPasswordToggle('togglePassword', 'password');
        setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');

        // Password strength indicator
        const passwordInput = document.getElementById('password');
        const bars = [document.getElementById('str1'), document.getElementById('str2'), document.getElementById('str3'), document.getElementById('str4')];

        passwordInput.addEventListener('input', () => {{
            const val = passwordInput.value;
            let strength = 0;

            if (val.length >= 8) strength++;
            if (/[a-z]/.test(val) && /[A-Z]/.test(val)) strength++;
            if (/[0-9]/.test(val)) strength++;
            if (/[^a-zA-Z0-9]/.test(val)) strength++;

            const cls = strength <= 1 ? 'weak' : strength <= 2 ? 'medium' : 'strong';

            bars.forEach((bar, i) => {{
                bar.classList.remove('active', 'weak', 'medium', 'strong');
                if (i < strength) {{
                    bar.classList.add('active', cls);
                }}
            }});
        }});

        // Form validation
        const form = document.getElementById('signupForm');
        const submitBtn = document.getElementById('submitBtn');

        function showError(inputId, errorId) {{
            document.getElementById(inputId).classList.add('error');
            document.getElementById(errorId).classList.add('visible');
        }}

        function clearError(inputId, errorId) {{
            document.getElementById(inputId).classList.remove('error');
            document.getElementById(errorId).classList.remove('visible');
        }}

        // Clear errors on input
        ['firstName', 'lastName', 'email', 'password', 'confirmPassword'].forEach(id => {{
            const input = document.getElementById(id);
            input.addEventListener('input', () => {{
                clearError(id, id + 'Error');
            }});
        }});

        form.addEventListener('submit', (e) => {{
            e.preventDefault();
            let valid = true;

            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;

            if (!firstName) {{ showError('firstName', 'firstNameError'); valid = false; }}
            if (!lastName) {{ showError('lastName', 'lastNameError'); valid = false; }}
            if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {{ showError('email', 'emailError'); valid = false; }}
            if (password.length < 8) {{ showError('password', 'passwordError'); valid = false; }}
            if (password !== confirmPassword) {{ showError('confirmPassword', 'confirmPasswordError'); valid = false; }}

            if (valid) {{
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                // Simulate submission
                setTimeout(() => {{
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    alert('Bienvenue sur Trajectoire ! Votre espace a été créé avec succès.');
                }}, 2000);
            }}
        }});
    </script>
</body>
</html>'''

# Write the HTML file
with open('signup.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✓ Trajectoire signup page generated successfully!")
print(f"✓ File size: {len(html):,} bytes")
print(f"✓ Image embedded: Signup executive ({len(signup_b64):,} chars)")
