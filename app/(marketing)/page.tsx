"use client";

import { useEffect, useState } from "react";
import "./home.css";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "#" || !href.startsWith("#")) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen">
      <nav id="navbar" className={isScrolled ? 'scrolled' : ''}>

    
    
        <div className="nav-container">
            <a href="index.html" className="logo">Trajectoire</a>
            <ul className="nav-menu">
                <li><a href="#accueil" onClick={(e) => scrollToSection(e, "#accueil")}>Accueil</a></li>
                <li><a href="#methode" onClick={(e) => scrollToSection(e, "#methode")}>Méthode</a></li>
                <li><a href="#accompagnement" onClick={(e) => scrollToSection(e, "#accompagnement")}>Accompagnement</a></li>
                <li><a href="#tarifs" onClick={(e) => scrollToSection(e, "#tarifs")}>Tarifs</a></li>
                <li><a href="/ressources">Ressources</a></li>
                <li><a href="#apropos" onClick={(e) => scrollToSection(e, "#apropos")}>À propos</a></li>
                <li><a href="#contact" onClick={(e) => scrollToSection(e, "#contact")}>Contact</a></li>
            </ul>
            <div className="nav-actions">
                <a href="/auth/login" className="btn btn-ghost">Connexion</a>
                <a href="/auth/signup" className="btn btn-primary">Créer mon espace</a>
            </div>
        </div>
    </nav>

    
    <section className="hero" id="accueil">
        <div className="container">
            <div className="hero-grid">
                <div className="hero-content fade-in">
                    <h1>Préparez vos entretiens stratégiques avec méthode.</h1>
                    <p>Préparez vos entretiens de management grâce à une approche structurée, des simulations réalistes et des retours personnalisés.</p>
                    <div className="hero-buttons">
                        <a href="/auth/signup" className="btn btn-primary">Commencer maintenant</a>
                        <a href="#methode" onClick={(e) => scrollToSection(e, "#methode")} className="btn btn-secondary">Découvrir la méthode</a>
                    </div>
                    <div className="trust-indicators">
                        <div className="trust-item">
                            <svg className="trust-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            <span className="trust-text">Confidentialité garantie</span>
                        </div>
                        <div className="trust-item">
                            <svg className="trust-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            <span className="trust-text">Accompagnement premium</span>
                        </div>
                        <div className="trust-item">
                            <svg className="trust-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            <span className="trust-text">Résultats mesurables</span>
                        </div>
                    </div>
                </div>
                <div className="hero-image fade-in">
                    <img src="/images/home-hero.jpg" alt="Hero Image" className="w-full h-auto rounded-lg shadow-lg" />
                </div>
            </div>
        </div>
    </section>

    
    <section className="stats">
        <div className="container">
            <div className="stats-grid">
                <div className="stat-item fade-in"><div className="stat-number">+1800</div><div className="stat-label">cadres accompagnés</div></div>
                <div className="stat-item fade-in"><div className="stat-number">94%</div><div className="stat-label">déclarent être arrivés plus confiants</div></div>
                <div className="stat-item fade-in"><div className="stat-number">100%</div><div className="stat-label">Préparation adaptée à tous les niveaux de management</div></div>
            </div>
        </div>
    </section>

    
    <section id="methode">
        <div className="container">
            <div className="section-header fade-in">
                <span className="section-label">Notre approche</span>
                <h2 className="section-title">Pourquoi Trajectoire ?</h2>
                <p className="section-subtitle">Une méthode éprouvée pour transformer votre préparation en avantage décisif.</p>
            </div>
            <div className="why-grid">
                <div className="why-card fade-in">
                    <div className="why-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <h3>Méthode structurée</h3>
                    <p>Un cadre méthodologique rigoureux inspiré des meilleures pratiques du conseil en stratégie et du coaching exécutif.</p>
                </div>
                <div className="why-card fade-in">
                    <div className="why-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
                    <h3>Simulations réalistes</h3>
                    <p>Des mises en situation immersives avec des coachs expérimentés qui reproduisent fidèlement la pression de l'entretien réel.</p>
                </div>
                <div className="why-card fade-in">
                    <div className="why-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
                    <h3>Retours personnalisés</h3>
                    <p>Des analyses détaillées et des recommandations concrètes pour progresser rapidement et atteindre vos objectifs.</p>
                </div>
            </div>
        </div>
    </section>

    
    <section className="process">
        <div className="container">
            <div className="section-header fade-in">
                <span className="section-label">Le processus</span>
                <h2 className="section-title">Comment ça fonctionne ?</h2>
                <p className="section-subtitle">Quatre étapes clés pour une préparation optimale.</p>
            </div>
            <div className="timeline">
                <div className="timeline-item fade-in"><div className="timeline-number">1</div><div className="timeline-content"><h3>Analyse</h3><p>Diagnostic approfondi de votre profil, de vos objectifs et du contexte spécifique de l'entretien.</p></div></div>
                <div className="timeline-item fade-in"><div className="timeline-number">2</div><div className="timeline-content"><h3>Préparation</h3><p>Construction d'une stratégie de communication sur mesure. Travail sur votre narrative et votre positionnement.</p></div></div>
                <div className="timeline-item fade-in"><div className="timeline-number">3</div><div className="timeline-content"><h3>Simulation</h3><p>Mises en situation réalistes avec des coachs expérimentés dans les conditions réelles de l'entretien.</p></div></div>
                <div className="timeline-item fade-in"><div className="timeline-number">4</div><div className="timeline-content"><h3>Débrief</h3><p>Analyse détaillée de votre performance. Recommandations actionnables et plan de progression personnalisé.</p></div></div>
            </div>
        </div>
    </section>

    
    <section id="accompagnement">
        <div className="container">
            <div className="section-header fade-in">
                <span className="section-label">Compétences développées</span>
                <h2 className="section-title">Ce que vous développez</h2>
                <p className="section-subtitle">Des compétences essentielles pour réussir vos entretiens et accélérer votre carrière.</p>
            </div>
            <div className="skills-grid">
                <div className="skill-card fade-in"><div className="skill-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div><h3>Leadership</h3></div>
                <div className="skill-card fade-in"><div className="skill-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div><h3>Communication</h3></div>
                <div className="skill-card fade-in"><div className="skill-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div><h3>Impact</h3></div>
                <div className="skill-card fade-in"><div className="skill-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div><h3>Gestion du stress</h3></div>
                <div className="skill-card fade-in"><div className="skill-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div><h3>Argumentation</h3></div>
                <div className="skill-card fade-in"><div className="skill-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></div><h3>Vision stratégique</h3></div>
            </div>
        </div>
    </section>

    
    <section>
        <div className="container">
            <div className="section-header fade-in">
                <span className="section-label">Types d'entretiens</span>
                <h2 className="section-title">Pour quels entretiens ?</h2>
                <p className="section-subtitle">Une préparation adaptée à chaque contexte professionnel.</p>
            </div>
            <div className="types-grid">
                <div className="type-card fade-in"><h3>Comité exécutif</h3></div>
                <div className="type-card fade-in"><h3>Manager</h3></div>
                <div className="type-card fade-in"><h3>Directeur</h3></div>
                <div className="type-card fade-in"><h3>Conseil d'administration</h3></div>
                <div className="type-card fade-in"><h3>Conseil</h3></div>
                <div className="type-card fade-in"><h3>Promotion interne</h3></div>
                <div className="type-card fade-in"><h3>Entretien international</h3></div>
                <div className="type-card fade-in"><h3>Poste de direction</h3></div>
            </div>
        </div>
    </section>

    
    <section className="trust">
        <div className="container">
            <div className="section-header fade-in">
                <span className="section-label">Ils nous font confiance</span>
                <h2 className="section-title">Une communauté exigeante</h2>
            </div>
            <div className="trust-content fade-in">
                <p>Cadres accompagnés issus de grands groupes, cabinets de conseil et entreprises en forte croissance.</p>
            </div>
        </div>
    </section>

    
    <section id="apropos">
        <div className="container">
            <div className="about-grid">
                <div className="about-image fade-in">
                    <img src="/images/home-about.jpg" alt="About Image" className="w-full h-auto rounded-lg shadow-lg" />
                </div>
                <div className="about-content fade-in">
                    <span className="section-label">À propos</span>
                    <h2>Une vision, une méthode, des résultats</h2>
                    <p>Après 15 ans d'expérience en conseil en stratégie et en coaching exécutif auprès de dirigeants de grands groupes, j'ai constaté un besoin crucial : celui d'une préparation rigoureuse et personnalisée aux entretiens stratégiques.</p>
                    <p>Trajectoire est née de cette conviction : chaque entretien important mérite une préparation à la hauteur des enjeux. Notre approche combine l'exigence du conseil en stratégie, la bienveillance du coaching et la précision de l'analyse comportementale.</p>
                    <p>Notre mission est simple : vous donner les moyens d'arriver confiant, préparé et performant lors de vos entretiens les plus décisifs.</p>
                    <div className="about-signature">
                        <strong>Marie Laurent</strong>
                        <span>Fondatrice &amp; Directrice Générale</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    
    <section className="faq" id="tarifs">
        <div className="container">
            <div className="section-header fade-in">
                <span className="section-label">Questions fréquentes</span>
                <h2 className="section-title">Tout ce que vous devez savoir</h2>
            </div>
            <div className="faq-list">
                <div className="faq-item fade-in">
                    <button className="faq-question"><span>Combien de temps dure une préparation complète ?</span><svg className="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
                    <div className="faq-answer"><div className="faq-answer-content">Une préparation complète s'étend généralement sur 2 à 4 semaines, selon la complexité de l'entretien et vos objectifs.</div></div>
                </div>
                <div className="faq-item fade-in">
                    <button className="faq-question"><span>Qui sont les coachs qui m'accompagnent ?</span><svg className="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
                    <div className="faq-answer"><div className="faq-answer-content">Nos coachs sont d'anciens dirigeants, partenaires de cabinets de conseil ou DRH de grands groupes avec une certification en coaching exécutif.</div></div>
                </div>
                <div className="faq-item fade-in">
                    <button className="faq-question"><span>La confidentialité est-elle garantie ?</span><svg className="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
                    <div className="faq-answer"><div className="faq-answer-content">Absolument. Toutes les informations partagées restent strictement confidentielles. Nous signons systématiquement des accords de confidentialité.</div></div>
                </div>
                <div className="faq-item fade-in">
                    <button className="faq-question"><span>Quels sont les tarifs ?</span><svg className="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
                    <div className="faq-answer"><div className="faq-answer-content">Nos tarifs varient selon le niveau de personnalisation. Nous proposons des formules à partir de 1 500 € pour une préparation complète. Un devis détaillé vous est fourni après un premier échange.</div></div>
                </div>
            </div>
        </div>
    </section>

    
    <section className="final-cta" id="contact">
        <div className="container">
            <h2 className="fade-in">Votre prochain entretien mérite une préparation à la hauteur.</h2>
            <div className="final-cta-buttons fade-in">
                <a href="/auth/signup" className="btn btn-primary">Créer mon espace</a>
                <a href="/auth/login" className="btn btn-secondary">Connexion</a>
            </div>
        </div>
    </section>

    
    <footer>
        <div className="container">
            <div className="footer-grid">
                <div className="footer-brand">
                    <a href="index.html" className="logo" style={{"color": "white"}}>Trajectoire</a>
                    <p>La plateforme de préparation aux entretiens stratégiques pour cadres et dirigeants exigeants.</p>
                </div>
                <div className="footer-column"><h4>Produit</h4><ul><li><a href="#methode" onClick={(e) => scrollToSection(e, "#methode")}>Méthode</a></li><li><a href="#accompagnement" onClick={(e) => scrollToSection(e, "#accompagnement")}>Accompagnement</a></li><li><a href="#tarifs" onClick={(e) => scrollToSection(e, "#tarifs")}>Tarifs</a></li><li><a href="#" onClick={(e) => scrollToSection(e, "#")}>Témoignages</a></li></ul></div>
                <div className="footer-column"><h4>Entreprise</h4><ul><li><a href="#apropos" onClick={(e) => scrollToSection(e, "#apropos")}>À propos</a></li><li><a href="#" onClick={(e) => scrollToSection(e, "#")}>Carrières</a></li><li><a href="#" onClick={(e) => scrollToSection(e, "#")}>Presse</a></li><li><a href="#contact" onClick={(e) => scrollToSection(e, "#contact")}>Contact</a></li></ul></div>
                <div className="footer-column"><h4>Ressources</h4><ul><li><a href="ressources/index.html">Blog</a></li><li><a href="ressources/index.html">Guides</a></li><li><a href="#tarifs" onClick={(e) => scrollToSection(e, "#tarifs")}>FAQ</a></li><li><a href="#" onClick={(e) => scrollToSection(e, "#")}>Webinaires</a></li></ul></div>
                <div className="footer-column"><h4>Légal</h4><ul><li><a href="#" onClick={(e) => scrollToSection(e, "#")}>Mentions légales</a></li><li><a href="#" onClick={(e) => scrollToSection(e, "#")}>Confidentialité</a></li><li><a href="#" onClick={(e) => scrollToSection(e, "#")}>CGU</a></li><li><a href="#" onClick={(e) => scrollToSection(e, "#")}>Cookies</a></li></ul></div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 Trajectoire. Tous droits réservés.</p>
                <a href="#" onClick={(e) => scrollToSection(e, "#")} className="social-link" aria-label="LinkedIn"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            </div>
        </div>
    </footer>

    

    

    
    
    
    

    
    

    </main>
  );
}
