"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const LaptopScene = dynamic(() => import("./LaptopScene"), {
  ssr: false,
  loading: () => <div className="laptop-scene loading-model" aria-hidden="true" />,
});

const ResponsiveScene = dynamic(() => import("./ResponsiveScene"), {
  ssr: false,
  loading: () => <div className="responsive-scene loading-model" aria-hidden="true" />,
});

type Language = "es" | "en";
type Theme = "light" | "dark";
type FontSize = "normal" | "large" | "xlarge";
type ColorMode = "default" | "protanopia" | "deuteranopia" | "tritanopia";

const copy = {
  es: {
    nav: ["Servicios", "Responsive", "Stack", "3D", "GitHub", "Contacto"],
    accessibility: "Accesibilidad",
    menu: "Menu",
    close: "Cerrar",
    eyebrow: "Next.js, 3D y experiencias digitales",
    title: "Webs premium en Mexico.",
    intro:
      "Landing pages, e-commerce y experiencias 3D rapidas, limpias y listas para convertir visitas en clientes.",
    primary: "Cotizar proyecto",
    secondary: "Ver servicios",
    servicesTitle: "Servicios",
    servicesIntro: "Diseno, tienda o 3D.",
    services: [
      ["Landing pages", "Mensaje claro, diseño premium y conversion."],
      ["E-commerce", "Catalogos rapidos y compras sin friccion."],
      ["Web 3D", "Modelos GLB e interaccion con scroll."],
      ["Juegos 3D", "Prototipos Unity y Unreal."],
    ],
    responsiveTitle: "Responsive",
    responsiveIntro: "Perfecta en cualquier pantalla.",
    responsiveText:
      "Cada seccion se adapta a distintos tamanos de pantalla para que tus clientes puedan navegar, leer y comprar con comodidad desde una laptop, tablet o telefono.",
    stackTitle: "Stack de trabajo",
    stackIntro: "Tecnologias para construir rapido.",
    threeDTitle: "Modelos 3D que venden mejor tu producto.",
    threeDText:
      "Integro modelos GLB optimizados, escenas WebGL fluidas y prototipos Unity o Unreal para mostrar espacios, productos y experiencias interactivas directamente en la web.",
    portfolioTitle: "Portafolio",
    portfolioText: "Mi GitHub.",
    portfolioCta: "NubStudio",
    contactTitle: "Contacto",
    contactIntro: "Cuéntame que quieres construir.",
    contactMessage: "Hola, quiero cotizar un proyecto web con Nub Studio.",
    contactPlaceholder: "Escribe tu mensaje para WhatsApp...",
    contactSend: "Enviar por WhatsApp",
    theme: "Tema",
    language: "Idioma",
    font: "Texto",
    contrast: "Alto contraste",
    color: "Daltonismo",
    motion: "Reducir movimiento",
    readPage: "Leer pagina",
    stopReader: "Detener lectura",
    footer: "© 2026 Nub Studio - Web, 3D y experiencias interactivas. Diego de la Fuente.",
  },
  en: {
    nav: ["Services", "Responsive", "Stack", "3D", "GitHub", "Contact"],
    accessibility: "Accessibility",
    menu: "Menu",
    close: "Close",
    eyebrow: "Next.js, 3D and digital experiences",
    title: "Premium websites in Mexico.",
    intro:
      "Fast, clean landing pages, e-commerce and 3D experiences built to turn visits into clients.",
    primary: "Quote project",
    secondary: "View services",
    servicesTitle: "Services",
    servicesIntro: "Design, store or 3D.",
    services: [
      ["Landing pages", "Clear message, premium design and conversion."],
      ["E-commerce", "Fast catalogs and frictionless checkout."],
      ["3D web", "GLB models and scroll interaction."],
      ["3D games", "Unity and Unreal prototypes."],
    ],
    responsiveTitle: "Responsive",
    responsiveIntro: "Perfect on every screen.",
    responsiveText:
      "Every section adapts to different screen sizes so your clients can browse, read, and buy comfortably from a laptop, tablet, or phone.",
    stackTitle: "Working stack",
    stackIntro: "Tools for fast builds.",
    threeDTitle: "3D models that sell your product better.",
    threeDText:
      "I integrate optimized GLB models, smooth WebGL scenes, and Unity or Unreal prototypes to showcase spaces, products, and interactive experiences directly on the web.",
    portfolioTitle: "Portfolio",
    portfolioText: "My GitHub.",
    portfolioCta: "NubStudio",
    contactTitle: "Contact",
    contactIntro: "Tell me what you want to build.",
    contactMessage: "Hi, I want to quote a web project with Nub Studio.",
    contactPlaceholder: "Write your WhatsApp message...",
    contactSend: "Send on WhatsApp",
    theme: "Theme",
    language: "Language",
    font: "Text",
    contrast: "High contrast",
    color: "Color vision",
    motion: "Reduce motion",
    readPage: "Read page",
    stopReader: "Stop reading",
    footer: "© 2026 Nub Studio - Web, 3D and interactive experiences. Diego de la Fuente.",
  },
} as const;

const navTargets = ["#services", "#responsive", "#stack", "#three-d", "#portfolio", "#contact"];
const whatsappNumber = "528181766738";

const techs = [
  ["Nx", "Next.js"],
  ["TS", "TypeScript"],
  ["TW", "Tailwind"],
  ["H5", "HTML"],
  ["C3", "CSS"],
  ["JS", "JavaScript"],
  ["Vue", "Vue"],
  ["Py", "Python"],
  ["C#", "C#"],
  ["C++", "C++"],
  ["SQL", "SQL"],
  ["U", "Unity"],
  ["UE", "Unreal"],
];

const specs = [
  ["WebGL", "/logos/webgl.svg"],
  ["GLB", "/logos/glb.svg"],
  ["Unity", "/logos/unity.svg"],
  ["Unreal", "/logos/unreal.svg"],
] as const;

export default function LandingPage() {
  const [language, setLanguage] = useState<Language>("es");
  const [theme, setTheme] = useState<Theme>("dark");
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [colorMode, setColorMode] = useState<ColorMode>("default");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [accessMenuOpen, setAccessMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState<string>(copy.es.contactMessage);
  const headerRef = useRef<HTMLElement>(null);

  const t = copy[language];

  const pageText = useMemo(
    () =>
      [
        t.title,
        t.intro,
        t.servicesTitle,
        t.servicesIntro,
        ...t.services.flat(),
        t.responsiveTitle,
        t.responsiveIntro,
        t.responsiveText,
        t.stackTitle,
        t.threeDTitle,
        t.portfolioTitle,
      ].join(". "),
    [t],
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    setContactMessage(t.contactMessage);
  }, [t.contactMessage]);

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.body.dataset.font = fontSize;
    document.body.dataset.contrast = highContrast ? "high" : "normal";
    document.body.dataset.colorMode = colorMode;
    document.body.dataset.motion = reducedMotion ? "reduced" : "default";
  }, [theme, fontSize, highContrast, colorMode, reducedMotion]);

  useEffect(() => {
    document.body.dataset.menu = mobileMenuOpen ? "open" : "closed";
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!headerRef.current?.contains(target)) closeMenus();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -10% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const closeMenus = () => {
    setAccessMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const toggleReader = () => {
    if (!("speechSynthesis" in window)) return;
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(pageText);
    utterance.lang = language === "es" ? "es-MX" : "en-US";
    utterance.rate = 0.92;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  const goToContact = (message: string) => {
    setContactMessage(message);
    closeMenus();
    requestAnimationFrame(() => {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const sendWhatsApp = () => {
    const message = contactMessage.trim() || t.contactMessage;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const AccessibilityPanel = () => (
    <div className="access-panel" id="accessibility-menu">
      <ControlGroup label={t.theme}>
        <Choice active={theme === "dark"} onClick={() => setTheme("dark")}>
          Dark
        </Choice>
        <Choice active={theme === "light"} onClick={() => setTheme("light")}>
          Light
        </Choice>
      </ControlGroup>

      <ControlGroup label={t.language}>
        <Choice active={language === "es"} onClick={() => setLanguage("es")}>
          ES
        </Choice>
        <Choice active={language === "en"} onClick={() => setLanguage("en")}>
          EN
        </Choice>
      </ControlGroup>

      <ControlGroup label={t.font}>
        <Choice active={fontSize === "normal"} onClick={() => setFontSize("normal")}>
          100
        </Choice>
        <Choice active={fontSize === "large"} onClick={() => setFontSize("large")}>
          115
        </Choice>
        <Choice active={fontSize === "xlarge"} onClick={() => setFontSize("xlarge")}>
          130
        </Choice>
      </ControlGroup>

      <ControlGroup label={t.color}>
        <Choice active={colorMode === "default"} onClick={() => setColorMode("default")}>
          Base
        </Choice>
        <Choice active={colorMode === "protanopia"} onClick={() => setColorMode("protanopia")}>
          Pro
        </Choice>
        <Choice
          active={colorMode === "deuteranopia"}
          onClick={() => setColorMode("deuteranopia")}
        >
          Deu
        </Choice>
        <Choice active={colorMode === "tritanopia"} onClick={() => setColorMode("tritanopia")}>
          Tri
        </Choice>
      </ControlGroup>

      <div className="quick-toggles">
        <button
          className={highContrast ? "toggle is-active" : "toggle"}
          type="button"
          onClick={() => setHighContrast((value) => !value)}
          aria-pressed={highContrast}
        >
          {t.contrast}
        </button>
        <button
          className={reducedMotion ? "toggle is-active" : "toggle"}
          type="button"
          onClick={() => setReducedMotion((value) => !value)}
          aria-pressed={reducedMotion}
        >
          {t.motion}
        </button>
        <button className="toggle reader" type="button" onClick={toggleReader}>
          {isReading ? t.stopReader : t.readPage}
        </button>
      </div>
    </div>
  );

  return (
    <main className="site-shell">
      <header className={mobileMenuOpen ? "topbar is-menu-open" : "topbar"} ref={headerRef}>
        <a href="#home" className="brand" aria-label="Inicio" onClick={closeMenus}>
          <span className="brand-mark" aria-hidden="true" />
          <span>Nub Studio</span>
        </a>

        <button
          className={mobileMenuOpen ? "hamburger is-open" : "hamburger"}
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? t.close : t.menu}
          onClick={() => setMobileMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={mobileMenuOpen ? "nav-area is-open" : "nav-area"}>
          <nav className="nav-links" aria-label="Navegacion principal">
            {t.nav.map((item, index) => (
              <a key={item} href={navTargets[index]} onClick={closeMenus}>
                {item}
              </a>
            ))}
          </nav>

          <div className="access-wrap">
            <button
              className={accessMenuOpen ? "access-trigger is-open" : "access-trigger"}
              type="button"
              aria-expanded={accessMenuOpen}
              aria-controls="accessibility-menu"
              onClick={() => setAccessMenuOpen((value) => !value)}
            >
              {t.accessibility}
              <span aria-hidden="true">+</span>
            </button>
            <div className={accessMenuOpen ? "access-popover is-open" : "access-popover"}>
              <AccessibilityPanel />
            </div>
          </div>
        </div>
      </header>

      <button
        className={mobileMenuOpen ? "menu-backdrop is-open" : "menu-backdrop"}
        type="button"
        aria-label={t.close}
        onClick={closeMenus}
      />

      <section id="home" className="hero section-band">
        <div className="hero-copy">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lead">{t.intro}</p>
          <div className="hero-actions">
            <button
              className="button primary"
              type="button"
              onClick={() => goToContact(t.contactMessage)}
            >
              {t.primary}
            </button>
            <a href="#services" className="button ghost">
              {t.secondary}
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <LaptopScene reducedMotion={reducedMotion} />
        </div>
      </section>

      <section id="services" className="section-band services centered-section reveal">
        <div className="section-heading">
          <p className="eyebrow">{t.servicesTitle}</p>
          <h2>{t.servicesIntro}</h2>
        </div>
        <div className="service-grid">
          {t.services.map(([title, description], index) => (
            <button
              className="service-card"
              key={title}
              type="button"
              onClick={() =>
                goToContact(
                  language === "es"
                    ? `Hola, quiero cotizar el servicio de ${title}. ${description}`
                    : `Hi, I want to quote the ${title} service. ${description}`,
                )
              }
              style={{ "--delay": `${index * 90}ms` } as CSSProperties}
            >
              <span className="service-index">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </button>
          ))}
        </div>
      </section>

      <section id="responsive" className="section-band responsive-section centered-section reveal">
        <div className="responsive-sticky">
          <div className="section-heading compact responsive-copy">
            <p className="eyebrow">{t.responsiveTitle}</p>
            <h2>{t.responsiveIntro}</h2>
            <p className="responsive-description">{t.responsiveText}</p>
          </div>
          <div className="responsive-devices">
            <ResponsiveScene reducedMotion={reducedMotion} />
          </div>
        </div>
      </section>

      <section id="stack" className="section-band stack-section centered-section reveal">
        <div className="section-heading compact">
          <p className="eyebrow">{t.stackTitle}</p>
          <h2>{t.stackIntro}</h2>
        </div>
        <div className="tech-carousel" aria-label={t.stackTitle}>
          <div className="tech-track">
            {[...techs, ...techs].map(([icon, name], index) => (
              <span className="tech-pill" key={`${name}-${index}`}>
                <span className="tech-icon">{icon}</span>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="three-d" className="section-band three-d centered-section reveal">
        <div className="three-d-copy">
          <p className="eyebrow">3D</p>
          <h2>{t.threeDTitle}</h2>
          <p>{t.threeDText}</p>
        </div>
        <div className="mini-specs" aria-label="Especialidades 3D">
          {specs.map(([name, src]) => (
            <span key={name}>
              <Image src={src} alt="" width={28} height={28} aria-hidden="true" />
              {name}
            </span>
          ))}
        </div>
      </section>

      <section id="portfolio" className="section-band portfolio centered-section reveal">
        <p className="eyebrow">{t.portfolioTitle}</p>
        <h2>{t.portfolioText}</h2>
        <a
          className="button primary"
          href="https://github.com/dukkzyx/NubStudio.git"
          target="_blank"
          rel="noreferrer"
          aria-label="Repositorio NubStudio en GitHub"
        >
          {t.portfolioCta}
        </a>
      </section>

      <section id="contact" className="section-band contact centered-section reveal">
        <div className="section-heading compact">
          <p className="eyebrow">{t.contactTitle}</p>
          <h2>{t.contactIntro}</h2>
        </div>
        <div className="contact-box">
          <textarea
            value={contactMessage}
            onChange={(event) => setContactMessage(event.target.value)}
            placeholder={t.contactPlaceholder}
            rows={5}
          />
          <button className="button primary" type="button" onClick={sendWhatsApp}>
            {t.contactSend}
          </button>
        </div>
      </section>

      <footer>
        <span>{t.footer}</span>
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t.contactMessage)}`}
          target="_blank"
          rel="noreferrer"
        >
          +52 81 8176 6738
        </a>
      </footer>
    </main>
  );
}

function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="control-group">
      <span>{label}</span>
      <div className="choice-row">{children}</div>
    </div>
  );
}

function Choice({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button className={active ? "choice is-active" : "choice"} type="button" onClick={onClick}>
      {children}
    </button>
  );
}
