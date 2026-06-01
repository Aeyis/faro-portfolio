"use client";

import React, { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION_HEIGHTS } from "@/lib/constants";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";
import dynamic from "next/dynamic";
const FluidCursor = dynamic(() => import("@/components/about/FluidCursor"), { ssr: false, loading: () => null });

gsap.registerPlugin(ScrollTrigger);

const EMAIL    = "raf045@hotmail.com";
const GITHUB   = "https://github.com/Aeyis";
const LINKEDIN = "https://linkedin.com";
const CV_PATH  = "/assets/contact/cv.pdf";

const BORDER = "1.5px solid oklch(0.45 0.12 50 / 0.75)";

const ICONS: Record<string, ReactNode> = {
    email:    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    github:   <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>,
    cv:       <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    linkedin: <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
};

const LINKS = [
    { label: "EMAIL",    icon: ICONS.email,    href: `mailto:${EMAIL}`, download: false },
    { label: "GITHUB",   icon: ICONS.github,   href: GITHUB,            download: false },
    { label: "CV",       icon: ICONS.cv,       href: CV_PATH,           download: true  },
    { label: "LINKEDIN", icon: ICONS.linkedin, href: LINKEDIN,          download: false },
];

export default function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 20%", scrub: 0.6 } }
            );
        }
    }, { scope: sectionRef });

    return (
        <section
            id="contact"
            ref={sectionRef}
            style={{ height: SECTION_HEIGHTS.contact, position: "relative", backgroundColor: "oklch(0.05 0.06 50)", overflow: "clip" }}
        >
            <UnderwaterBackground variant="amber" />
            <div style={{ position: "sticky", top: 0, height: "100vh", marginBottom: "-100vh", zIndex: 1, opacity: 0.4 }}>
                <FluidCursor variant="amber" />
            </div>

            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
                background: "radial-gradient(ellipse 60% 70% at 68% 55%, oklch(0.14 0.10 50 / 0.4) 0%, transparent 70%)",
            }} />
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "18vh",
                background: "linear-gradient(to bottom, oklch(0.06 0.07 280) 0%, transparent 100%)",
                pointerEvents: "none", zIndex: 1,
            }} />

            {/* ── Grille ── */}
            <div
                ref={contentRef}
                style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: "100vh",
                    display: "flex",
                    zIndex: 5,
                    overflow: "hidden",
                }}
            >
                {/* CONTACT vertical */}
                <div style={{
                    width: "clamp(70px, 7vw, 120px)", flexShrink: 0,
                    borderRight: BORDER,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <span className="font-inter-tight" style={{
                        writingMode:     "vertical-rl",
                        transform:       "rotate(180deg)",
                        fontSize:        "clamp(48px, 7vh, 100px)",
                        fontWeight:      900,
                        letterSpacing:   "-0.04em",
                        lineHeight:      1,
                        backgroundImage: "linear-gradient(to bottom, oklch(0.94 0.14 58) 0%, oklch(0.75 0.20 48) 55%, oklch(0.45 0.14 40) 100%)",
                        backgroundClip:  "text",
                        WebkitBackgroundClip: "text",
                        color:           "transparent",
                        filter:          "drop-shadow(0 0 20px oklch(0.5 0.18 52 / 0.25))",
                        userSelect:      "none",
                    }}>
                        Contact
                    </span>
                </div>

                {/* Formulaire */}
                <form
                    onSubmit={e => e.preventDefault()}
                    style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", borderRight: BORDER }}
                >
                    <div style={{ flex: 1, borderBottom: BORDER, padding: "8px 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <label className="font-inter-tight" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(0.65 0.14 52)", display: "block", marginBottom: 4 }}>
                            Nom complet :
                        </label>
                        <input type="text" placeholder="Rafael Solis Ramos" className="font-inter-tight"
                            style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "oklch(0.84 0.12 55)", fontSize: "clamp(22px, 3.2vh, 40px)", fontWeight: 400, fontFamily: "var(--font-inter-tight), sans-serif", caretColor: "oklch(0.65 0.18 52)" }}
                        />
                    </div>

                    <div style={{ flex: 1, borderBottom: BORDER, padding: "8px 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <label className="font-inter-tight" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(0.65 0.14 52)", display: "block", marginBottom: 4 }}>
                            E-Mail :
                        </label>
                        <input type="email" placeholder="votre@email.com" className="font-inter-tight"
                            style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "oklch(0.84 0.12 55)", fontSize: "clamp(22px, 3.2vh, 40px)", fontWeight: 400, fontFamily: "var(--font-inter-tight), sans-serif", caretColor: "oklch(0.65 0.18 52)" }}
                        />
                    </div>

                    <div style={{ flex: 2.1, borderBottom: BORDER, padding: "8px 20px 10px", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                        <label className="font-inter-tight" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(0.65 0.14 52)", display: "block", marginBottom: 4, flexShrink: 0 }}>
                            Description de votre demande :
                        </label>
                        <textarea placeholder="Décrivez votre projet..." className="font-inter-tight"
                            style={{ flex: 1, background: "transparent", border: "none", outline: "none", resize: "none", color: "oklch(0.84 0.12 55)", fontSize: "clamp(22px, 3.4vh, 44px)", fontWeight: 400, fontFamily: "var(--font-inter-tight), sans-serif", caretColor: "oklch(0.65 0.18 52)", lineHeight: 1.5 }}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", flexShrink: 0, paddingTop: 8 }}>
                            <button type="submit" className="font-inter-tight"
                                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", border: BORDER, borderRadius: 5, background: "transparent", color: "oklch(0.70 0.14 54)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "oklch(0.12 0.07 50)"; e.currentTarget.style.color = "oklch(0.90 0.18 58)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "oklch(0.70 0.14 54)"; }}
                            >
                                Envoyer ↗
                            </button>
                        </div>
                    </div>
                </form>

                {/* 4 boutons empilés */}
                <div style={{ width: "35%", flexShrink: 0, display: "flex", flexDirection: "column", height: "100%" }}>
                    {LINKS.map(({ label, icon, href, download }, i) => (
                        <a
                            key={label}
                            href={href}
                            download={download || undefined}
                            target={!download && href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="font-inter-tight contact-link"
                            style={{
                                flex: 1,
                                display: "flex", alignItems: "center", justifyContent: "flex-start",
                                borderBottom: i < LINKS.length - 1 ? BORDER : "none",
                                textDecoration: "none",
                                fontSize: "clamp(22px, 3.6vh, 48px)",
                                fontWeight: 900, letterSpacing: "0.02em",
                                color: "oklch(0.60 0.14 54)",
                            }}
                        >
                            <span className="link-content" style={{ paddingLeft: 28 }}>
                                <span style={{ fontSize: "0.75em", display: "flex", alignItems: "center" }}>{icon}</span>
                                {label}
                            </span>
                            <span className="link-arrow">→</span>
                        </a>
                    ))}
                </div>

                {/* Bord droit */}
                <div style={{ width: "clamp(12px, 1.5vw, 24px)", flexShrink: 0, borderLeft: BORDER }} />
            </div>
        </section>
    );
}
