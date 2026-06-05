"use client";

import { useState, useEffect } from "react";
import { navigateTo } from "@/lib/navigateTo";
import { useLang } from "@/lib/LanguageContext";
import { T } from "@/lib/translations";

const NAV_KEYS: { depth: string; key: keyof typeof T["fr"]["nav"]; href: string }[] = [
    { depth: "0 m",   key: "home",     href: "#hero"    },
    { depth: "−12 m", key: "about",    href: "#about"   },
    { depth: "−22 m", key: "stack",    href: "#stack"   },
    { depth: "−34 m", key: "projects", href: "#projets" },
    { depth: "−40 m", key: "contact",  href: "#contact" },
];

export default function TrapMenu() {
    const [open, setOpen] = useState(false);
    const { lang, setLang } = useLang();

    useEffect(() => {
        const onToggle = () => setOpen(o => !o);
        const onClose  = () => setOpen(false);
        const onKey    = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };

        window.addEventListener("menu-toggle", onToggle);
        window.addEventListener("menu-close",  onClose);
        window.addEventListener("keydown",     onKey);
        return () => {
            window.removeEventListener("menu-toggle", onToggle);
            window.removeEventListener("menu-close",  onClose);
            window.removeEventListener("keydown",     onKey);
        };
    }, []);

    const close = () => {
        setOpen(false);
        window.dispatchEvent(new Event("menu-close"));
    };

    return (
        <>
            {/* Fond assombri */}
            <div
                className={`trap-overlay${open ? " open" : ""}`}
                onClick={close}
                aria-hidden="true"
            />

            {/* Panel */}
            <nav
                className={`trap-panel${open ? " open" : ""}`}
                aria-hidden={!open}
            >
                {/* ── En-tête mobile : socials à gauche + toggle langue à droite ── */}
                <div className="tp-mobile-header">
                    <div className="tp-mobile-socials">
                        <a href="https://github.com/Aeyis" target="_blank" rel="noopener noreferrer" className="tp-social-btn" title="GitHub">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="tp-social-btn" title="LinkedIn">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                        </a>
                        <a href="mailto:raf045@hotmail.com" className="tp-social-btn" title="Email">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </a>
                    </div>
                    <button
                        className="tp-lang-toggle"
                        onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                    >
                        {lang === "fr" ? "FR" : "EN"}
                    </button>
                </div>

                <div className="trap-inner">
                    {NAV_KEYS.map(item => (
                        <a
                            key={item.key}
                            href={item.href}
                            className="tp-link"
                            onClick={(e) => {
                                e.preventDefault();
                                close();
                                navigateTo(item.href.slice(1));
                            }}
                        >
                            <span className="tp-name">{T[lang].nav[item.key]}</span>
                            <div className="tp-right">
                                <span className="tp-depth">{item.depth}</span>
                                <span className="tp-arrow">→</span>
                            </div>
                        </a>
                    ))}
                </div>
                <div className="tp-socials">
                    <a href="https://github.com/Aeyis" target="_blank" rel="noopener noreferrer" className="tp-social-btn" title="GitHub">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="tp-social-btn" title="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                    <a href="mailto:raf045@hotmail.com" className="tp-social-btn" title="Email">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </a>
                </div>
                <div className="tp-lang">
                    <button
                        className={`tp-lang-btn${lang === "fr" ? " active" : ""}`}
                        onClick={() => setLang("fr")}
                    >FR</button>
                    <span className="tp-lang-sep">·</span>
                    <button
                        className={`tp-lang-btn${lang === "en" ? " active" : ""}`}
                        onClick={() => setLang("en")}
                    >EN</button>
                </div>
            </nav>
        </>
    );
}