#!/usr/bin/env python3
"""
Trajectoire - Unified Design System
Polish all pages to create one cohesive luxury product
Apple × Stripe × Linear × Notion × McKinsey Digital
"""

import os
import re

# ═══════════════════ UNIFIED CSS SYSTEM ═══════════════════
UNIFIED_CSS = """
/* ═══════════════════ TRAJECTOIRE UNIFIED DESIGN SYSTEM ═══════════════════ */
/* Apple × Stripe × Linear × Notion × McKinsey Digital */

:root {
    /* Colors */
    --bg: #F8F6F3;
    --bg-elevated: #FFFFFF;
    --text: #111827;
    --text-secondary: rgba(17, 24, 39, 0.6);
    --text-tertiary: rgba(17, 24, 39, 0.4);
    
    --accent: #0F766E;
    --accent-hover: #0D6558;
    --accent-light: rgba(15, 118, 110, 0.08);
    --accent-lighter: rgba(15, 118, 110, 0.04);
    
    --secondary: #C89B3C;
    --secondary-hover: #B8892F;
    --secondary-light: rgba(200, 155, 60, 0.08);
    --secondary-lighter: rgba(200, 155, 60, 0.04);
    
    --success: #10B981;
    --success-light: rgba(16, 185, 129, 0.08);
    --warning: #F59E0B;
    --warning-light: rgba(245, 158, 11, 0.08);
    --error: #EF4444;
    --error-light: rgba(239, 68, 68, 0.08);
    
    --card: #FFFFFF;
    --border: rgba(17, 24, 39, 0.08);
    --border-hover: rgba(17, 24, 39, 0.12);
    
    /* Spacing System (8px grid) */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-7: 28px;
    --space-8: 32px;
    --space-10: 40px;
    --space-12: 48px;
    --space-16: 64px;
    --space-20: 80px;
    --space-24: 96px;
    
    /* Shadows */
    --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.04);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.08);
    --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.12);
    --shadow-focus: 0 0 0 4px rgba(15, 118, 110, 0.1);
    
    /* Border Radius */
    --radius-xs: 4px;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-full: 9999px;
    
    /* Typography */
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-serif: 'Playfair Display', Georgia, serif;
    
    /* Transitions */
    --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    --transition-slow: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ═══════════════════ BASE STYLES ═══════════════════ */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-sans);
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
}

/* ═══════════════════ TYPOGRAPHY ═══════════════════ */
h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.2;
}

h1 { font-size: clamp(32px, 5vw, 56px); }
h2 { font-size: clamp(28px, 4vw, 36px); }
h3 { font-size: clamp(20px, 3vw, 24px); }
h4 { font-size: 20px; }
h5 { font-size: 18px; }
h6 { font-size: 16px; }

p {
    line-height: 1.7;
    color: var(--text-secondary);
}

/* ═══════════════════ LAYOUT ═══════════════════ */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-6);
}

.page-wrapper {
    min-height: 100vh;
    padding: var(--space-12) 0;
}

/* ═══════════════════ BUTTONS ═══════════════════ */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all var(--transition-base);
    white-space: nowrap;
    text-decoration: none;
    position: relative;
    overflow: hidden;
}

.btn svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.btn-primary {
    background: var(--accent);
    color: white;
}

.btn-primary:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.btn-primary:active {
    transform: translateY(0);
}

.btn-secondary {
    background: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
}

.btn-secondary:hover {
    background: var(--border);
    border-color: var(--border-hover);
    transform: translateY(-2px);
}

.btn-ghost {
    background: transparent;
    color: var(--text-secondary);
}

.btn-ghost:hover {
    background: var(--border);
    color: var(--text);
}

.btn-danger {
    background: var(--error-light);
    color: var(--error);
    border: 1px solid rgba(239, 68, 68, 0.2);
}

.btn-danger:hover {
    background: rgba(239, 68, 68, 0.15);
    transform: translateY(-2px);
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
}

/* ═══════════════════ FORMS ═══════════════════ */
.form-group {
    margin-bottom: var(--space-5);
}

.form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: var(--space-2);
    color: var(--text);
}

.form-input {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    font-size: 15px;
    font-weight: 500;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
}

.form-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: var(--shadow-focus);
}

.form-input.error {
    border-color: var(--error);
}

.form-error {
    font-size: 13px;
    color: var(--error);
    margin-top: var(--space-2);
}

/* ═══════════════════ CARDS ═══════════════════ */
.card {
    background: var(--card);
    border-radius: var(--radius-lg);
    padding: var(--space-8);
    box-shadow: var(--shadow-md);
    transition: all var(--transition-base);
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
}

.card-elevated {
    box-shadow: var(--shadow-xl);
}

/* ═══════════════════ BADGES ═══════════════════ */
.badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 600;
}

.badge-success {
    background: var(--success-light);
    color: var(--success);
}

.badge-warning {
    background: var(--warning-light);
    color: var(--warning);
}

.badge-error {
    background: var(--error-light);
    color: var(--error);
}

.badge-accent {
    background: var(--accent-light);
    color: var(--accent);
}

/* ═══════════════════ LOADING STATES ═══════════════════ */
.skeleton {
    background: linear-gradient(90deg, var(--border) 0%, var(--border-hover) 50%, var(--border) 100%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: var(--radius-sm);
}

@keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.skeleton-text {
    height: 16px;
    margin-bottom: var(--space-2);
}

.skeleton-text:last-child {
    width: 60%;
}

.skeleton-title {
    height: 32px;
    width: 60%;
    margin-bottom: var(--space-4);
}

.skeleton-card {
    height: 200px;
}

/* ═══════════════════ EMPTY STATES ═══════════════════ */
.empty-state {
    text-align: center;
    padding: var(--space-16) var(--space-8);
}

.empty-state-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto var(--space-6);
    background: var(--accent-light);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-state-icon svg {
    width: 40px;
    height: 40px;
    color: var(--accent);
}

.empty-state h3 {
    font-size: 24px;
    margin-bottom: var(--space-3);
}

.empty-state p {
    font-size: 15px;
    margin-bottom: var(--space-6);
}

/* ═══════════════════ ERROR STATES ═══════════════════ */
.error-state {
    text-align: center;
    padding: var(--space-16) var(--space-8);
}

.error-state-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto var(--space-6);
    background: var(--error-light);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
}

.error-state-icon svg {
    width: 40px;
            height: 40px;
    color: var(--error);
}

/* ═══════════════════ SUCCESS STATES ═══════════════════ */
.success-state {
    text-align: center;
    padding: var(--space-16) var(--space-8);
}

.success-state-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto var(--space-6);
    background: var(--success-light);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
}

.success-state-icon svg {
    width: 40px;
    height: 40px;
    color: var(--success);
}

/* ═══════════════════ TABLES ═══════════════════ */
.table-wrapper {
    background: var(--card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
            overflow: hidden;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table thead {
    background: var(--bg);
}

.table th {
    padding: var(--space-4) var(--space-8);
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border);
}

.table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background var(--transition-fast);
}

.table tbody tr:last-child {
    border-bottom: none;
}

.table tbody tr:hover {
    background: rgba(17, 24, 39, 0.02);
}

.table td {
    padding: var(--space-5) var(--space-8);
    font-size: 14px;
}

/* ═══════════════════ ANIMATIONS ═══════════════════ */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.fade-in-up {
    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.fade-in {
    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.slide-in-right {
    animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Stagger animations */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }

/* ═══════════════════ ACCESSIBILITY ═══════════════════ */
:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

/* ═══════════════════ RESPONSIVE ═══════════════════ */
@media (max-width: 1024px) {
    .container {
        padding: 0 var(--space-5);
    }
    
    .page-wrapper {
        padding: var(--space-10) 0;
    }
}

@media (max-width: 768px) {
    .container {
        padding: 0 var(--space-4);
    }
    
    .page-wrapper {
        padding: var(--space-8) 0;
    }
    
    .card {
        padding: var(--space-6);
    }
    
    .btn {
        width: 100%;
    }
}

/* ═══════════════════ UTILITIES ═══════════════════ */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.text-primary { color: var(--text); }
.text-secondary { color: var(--text-secondary); }
.text-accent { color: var(--accent); }
.text-success { color: var(--success); }
.text-error { color: var(--error); }

.mb-1 { margin-bottom: var(--space-1); }
.mb-2 { margin-bottom: var(--space-2); }
.mb-3 { margin-bottom: var(--space-3); }
.mb-4 { margin-bottom: var(--space-4); }
.mb-5 { margin-bottom: var(--space-5); }
.mb-6 { margin-bottom: var(--space-6); }
.mb-8 { margin-bottom: var(--space-8); }
.mb-12 { margin-bottom: var(--space-12); }
.mb-16 { margin-bottom: var(--space-16); }

.mt-1 { margin-top: var(--space-1); }
.mt-2 { margin-top: var(--space-2); }
.mt-3 { margin-top: var(--space-3); }
.mt-4 { margin-top: var(--space-4); }
.mt-5 { margin-top: var(--space-5); }
.mt-6 { margin-top: var(--space-6); }
.mt-8 { margin-top: var(--space-8); }
.mt-12 { margin-top: var(--space-12); }
.mt-16 { margin-top: var(--space-16); }
"""

# ═══════════════════ UNIFIED JAVASCRIPT ═══════════════════
UNIFIED_JS = """
/* ═══════════════════ TRAJECTOIRE UNIFIED INTERACTIONS ═══════════════════ */

// ═══════════════════ INTERSECTION OBSERVER ═══════════════════
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in-up, .fade-in, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
});

// ═══════════════════ SMOOTH SCROLL ═══════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ═══════════════════ FORM VALIDATION ═══════════════════
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const errorEl = input.parentElement.querySelector('.form-error');
        
        if (!value) {
            input.classList.add('error');
            if (errorEl) errorEl.style.display = 'block';
            isValid = false;
        } else {
            input.classList.remove('error');
            if (errorEl) errorEl.style.display = 'none';
        }
    });
    
    return isValid;
}

// ═══════════════════ FAQ ACCORDION ═══════════════════
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const answer = item.querySelector('.faq-answer');
            const content = answer.querySelector('.faq-answer-content');
            const isActive = item.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
});

// ═══════════════════ LOADING STATES ═══════════════════
function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
}

function hideLoading(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

// ═══════════════════ TOAST NOTIFICATIONS ═══════════════════
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ═══════════════════ KEYBOARD NAVIGATION ═══════════════════
document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// ═══════════════════ PERFORMANCE ═══════════════════
// Lazy load images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

console.log('✅ Trajectoire Unified Design System loaded');
"""

# ═══════════════════ GENERATE FILES ═══════════════════
print("🎨 Generating Trajectoire Unified Design System...")
print("=" * 80)

# Generate unified CSS
with open('unified-styles.css', 'w', encoding='utf-8') as f:
    f.write(UNIFIED_CSS)
print("✅ Generated unified-styles.css")

# Generate unified JS
with open('unified-scripts.js', 'w', encoding='utf-8') as f:
    f.write(UNIFIED_JS)
print("✅ Generated unified-scripts.js")

print("\n" + "=" * 80)
print("✅ Unified Design System generated successfully!")
print("\n📋 Next steps:")
print("1. Review unified-styles.css for design tokens")
print("2. Review unified-scripts.js for interactions")
print("3. Apply to all pages for consistency")
print("\n🎯 Design tokens applied:")
print("  • Colors: Accent (#0F766E), Secondary (#C89B3C), Success, Warning, Error")
print("  • Spacing: 8px grid system (4px to 96px)")
print("  • Shadows: 5 levels (xs to xl)")
print("  • Border radius: 6 levels (xs to full)")
print("  • Typography: Inter (sans) + Playfair Display (serif)")
print("  • Transitions: 3 speeds (fast, base, slow)")
print("\n✨ Features included:")
print("  • Loading skeletons")
print("  • Empty states")
print("  • Error states")
print("  • Success states")
print("  • Smooth animations")
print("  • Micro interactions")
print("  • Accessibility AA")
print("  • Responsive design")
