"use client";

import React, { useRef, useEffect, useState } from "react";
import { SECTION_HEIGHTS } from "@/lib/constants";
import { useLang } from "@/lib/LanguageContext";
import { T } from "@/lib/translations";
import emailjs from "@emailjs/browser";

const EMAIL   = "raf045@hotmail.com";
const GITHUB  = "https://github.com/Aeyis";
const LINKEDIN = "https://linkedin.com";
const CV_PATH = "https://aeyis.github.io/cv/";

const HAIR   = "rgba(255, 222, 185, 0.12)";
const GLASS  = "oklch(0.11 0.055 50 / 0.5)";
const AMBER  = "oklch(0.83 0.16 60)";
const INKS   = "oklch(0.93 0.04 75)";
const MONO   = "var(--font-mono, 'JetBrains Mono', ui-monospace, monospace)";
const SYNE   = "var(--font-syne, 'Syne', sans-serif)";
const INTER  = "var(--font-inter-tight, 'Inter Tight', sans-serif)";

const LINKS_BASE = [
    { labelKey: "cvLabel" as const,       zoneKey: "cvZone" as const,       href: CV_PATH,           download: false,  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>, bar: "linear-gradient(to bottom, oklch(0.88 0.16 66), oklch(0.6 0.14 56/0.4))" },
    { labelKey: null,                      zoneKey: null,                     href: GITHUB,            download: false,  icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>, bar: "linear-gradient(to bottom, oklch(0.8 0.16 56), oklch(0.55 0.14 48/0.4))", staticLabel: "GitHub", staticZone: "@Aeyis · Code" },
    { labelKey: null,                      zoneKey: "emailZone" as const,    href: `mailto:${EMAIL}`, download: false,  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, bar: "linear-gradient(to bottom, oklch(0.72 0.16 48), oklch(0.48 0.13 42/0.4))", staticLabel: "Email" },
    { labelKey: null,                      zoneKey: "linkedinZone" as const, href: LINKEDIN,          download: false,  icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>, bar: "linear-gradient(to bottom, oklch(0.64 0.15 42), oklch(0.42 0.12 38/0.4))", staticLabel: "LinkedIn" },
];

export default function ContactSection() {
    const { lang } = useLang();
    const t = T[lang].contact;
    const bubblesRef = useRef<HTMLDivElement>(null);
    const [toast, setToast] = useState(false);
    const [nom, setNom]         = useState("");
    const [email, setEmail]     = useState("");
    const [demande, setDemande] = useState("");

    useEffect(() => {
        const wrap = bubblesRef.current;
        if (!wrap || wrap.children.length > 0) return;
        for (let i = 0; i < 16; i++) {
            const b = document.createElement("div");
            const size = 6 + Math.random() * 22;
            Object.assign(b.style, {
                position: "absolute", bottom: "-40px", borderRadius: "50%",
                width: size + "px", height: size + "px",
                left: Math.random() * 100 + "%",
                background: "radial-gradient(circle at 35% 30%, oklch(0.9 0.16 60/0.26), oklch(0.6 0.14 50/0.02))",
                border: "1px solid oklch(0.78 0.16 58/0.14)",
                animation: `contactBubbleRise ${10 + Math.random() * 14}s linear ${-Math.random() * 16}s infinite`,
            });
            wrap.appendChild(b);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        emailjs.send(
            "service_0o3y10k",
            "template_xerxx7f",
            { from_name: nom, reply_email: email, message: demande, time: new Date().toLocaleString("fr-FR") },
            { publicKey: "Yp9d-EU_ge2KsLfiT" }
        ).then(() => {
            setToast(true);
            setTimeout(() => setToast(false), 3200);
            setNom(""); setEmail(""); setDemande("");
        }).catch(() => {
            alert("Erreur d'envoi. Réessayez.");
        });
    };

    const fieldInput: React.CSSProperties = {
        width: "100%", background: "oklch(0.07 0.05 48/0.55)",
        border: `1px solid ${HAIR}`, borderRadius: 10, padding: "clamp(6px,0.9vh,11px) clamp(10px,1vw,14px)",
        color: INKS, fontFamily: INTER, fontSize: "clamp(12px,1.4vh,15px)", fontWeight: 400,
        caretColor: AMBER, outline: "none", resize: "none" as const,
    };

    return (
        <section
            id="contact"
            style={{ height: SECTION_HEIGHTS.contact, position: "relative", backgroundColor: "oklch(0.05 0.045 48)", overflow: "clip" }}
        >
            {/* Décor */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden",
                background: "radial-gradient(ellipse 80% 50% at 50% -8%, oklch(0.24 0.14 56/0.5) 0%, transparent 60%), radial-gradient(ellipse 100% 70% at 50% 118%, oklch(0.11 0.10 40/0.7) 0%, transparent 72%)",
            }}>
                <div className="contact-orb contact-orb-1" />
                <div className="contact-orb contact-orb-2" />
            </div>
            <div ref={bubblesRef} style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }} />

            {/* Transition depuis projets */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "14vh", background: "linear-gradient(to bottom, oklch(0.06 0.07 280) 0%, transparent 100%)", pointerEvents: "none", zIndex: 2 }} />

            {/* Écran */}
            <div style={{
                position: "absolute", inset: 0, zIndex: 5,
                display: "flex", flexDirection: "column",
                padding:
                    "clamp(12px,2vh,24px) " +
                    "clamp(20px,4vw,64px) " +
                    "clamp(1px,0.6vh,8px)",
                gap: "clamp(8px,1.4vh,16px)",
            }}>
                {/* Topbar */}
                <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexShrink: 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <h2 style={{
                            fontFamily: INTER, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 0.85,
                            fontSize: "clamp(42px,8.5vh,90px)", margin: 0,
                            backgroundImage: "linear-gradient(105deg, oklch(0.98 0.07 74) 0%, oklch(0.88 0.17 60) 45%, oklch(0.78 0.18 52) 100%)",
                            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
                            filter: "drop-shadow(0 0 34px oklch(0.6 0.18 52/0.25))",
                        }}>{t.title}</h2>
                    </div>
                </header>

                {/* Console */}
                <main className="contact-console" style={{
                    flex: 1, minHeight: 0,
                    display: "grid", gridTemplateColumns: "1.3fr 0.85fr",
                    borderRadius: 26, overflow: "hidden",
                    background: GLASS, border: `1px solid ${HAIR}`,
                    boxShadow: `0 40px 100px oklch(0 0 0/0.55), inset 0 1px 0 rgba(255,232,200,0.13)`,
                }}>
                    {/* Formulaire */}
                    <section style={{ padding: "clamp(3px,0.3vh,5px) clamp(16px,2vw,32px) clamp(4px,0.6vh,8px)", display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: 0, overflow: "hidden" }}>
                        <p style={{ fontFamily: "var(--font-fraunces, Fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(13px,1.5vh,17px)", color: "oklch(0.8 0.07 60)", lineHeight: 1.3, marginBottom: "clamp(8px,1.2vh,14px)", flexShrink: 0 }}>
                            {t.lead}
                        </p>
                        <form onSubmit={handleSubmit} style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: "clamp(6px,1vh,12px)", overflow: "hidden" }}>
                            <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                                {[
                                    { id: "nom",   label: t.labelName,  type: "text",  placeholder: t.placeholderName,  val: nom,   set: setNom   },
                                    { id: "email", label: t.labelEmail, type: "email", placeholder: t.placeholderEmail, val: email, set: setEmail },
                                ].map(f => (
                                    <div key={f.id} className="contact-field" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                        <label style={{ fontFamily: INTER, fontSize: 10, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(0.6 0.09 52)", marginBottom: 4 }}>{f.label}</label>
                                        <input type={f.type} placeholder={f.placeholder} value={f.val} onChange={e => f.set(e.target.value)} style={fieldInput} />
                                    </div>
                                ))}
                            </div>
                            <div className="contact-field" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: "clamp(6px,1vh,12px)" }}>
                                <label style={{ fontFamily: INTER, fontSize: 10, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(0.6 0.09 52)", marginBottom: 4, flexShrink: 0 }}>{t.labelMsg}</label>
                                <textarea placeholder={t.placeholderMsg} value={demande} onChange={e => setDemande(e.target.value)} style={{ ...fieldInput, flex: 1, lineHeight: 1.5, minHeight: "80px" }} />
                                <button type="submit" className="contact-submit" style={{
                                    flexShrink: 0, alignSelf: "flex-start",
                                    display: "inline-flex", alignItems: "center", gap: 8,
                                    padding: "clamp(7px,1vh,11px) clamp(16px,2vw,24px)", borderRadius: 100, cursor: "pointer", border: "none",
                                    fontFamily: INTER, fontSize: "clamp(11px,1.3vh,13px)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                                    color: "oklch(0.17 0.06 48)",
                                    background: "linear-gradient(120deg, oklch(0.9 0.16 66), oklch(0.74 0.17 48))",
                                    boxShadow: "0 8px 24px oklch(0.5 0.16 48/0.30)",
                                }}>
                                    {t.send}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Liens */}
                    <aside style={{ display: "flex", flexDirection: "column", background: "oklch(0.065 0.045 46/0.55)", borderLeft: `1px solid ${HAIR}` }}>
                        <div style={{ padding: "clamp(12px,1.8vh,22px) 20px 8px", fontFamily: INTER, fontSize: 10, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(0.52 0.08 52)", display: "flex", justifyContent: "space-between" }}>
                            <span>{t.linksTitle}</span>
                        </div>
                        {LINKS_BASE.map((link, idx) => {
                            const label = link.labelKey ? t[link.labelKey] : (link as {staticLabel?: string}).staticLabel ?? "";
                            const zone  = link.zoneKey  ? t[link.zoneKey]  : (link as {staticZone?: string}).staticZone  ?? "";
                            const { href, download, icon, bar } = link;
                            return (
                            <a key={idx} href={href} download={download || undefined}
                                target={!download && href.startsWith("http") ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="dive-link"
                                style={{ flex: 1, maxHeight: "128px", position: "relative", display: "flex", alignItems: "stretch", textDecoration: "none", borderTop: `1px solid ${HAIR}` }}
                            >
                                <span style={{ width: 3, flexShrink: 0, background: bar }} />
                                <span className="dl-body" style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 12px" }}>
                                    <span className="dl-ico" style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "oklch(0.12 0.06 48/0.7)", border: `1px solid ${HAIR}`, color: AMBER }}>
                                        <span style={{ width: 13, height: 13, display: "flex" }}>{icon}</span>
                                    </span>
                                    <span style={{ flex: 1 }}>
                                        <span className="dl-name" style={{ fontFamily: INTER, fontSize: 13, fontWeight: 600, color: "oklch(0.87 0.05 72)", display: "block" }}>{label}</span>
                                        <span className="dl-zone" style={{ fontFamily: INTER, fontSize: 9, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(0.5 0.08 50)", display: "block", marginTop: 2 }}>{zone}</span>
                                    </span>
                                </span>
                            </a>
                            );
                        })}
                    </aside>
                </main>
            </div>

            {/* Toast */}
            <div style={{
                position: "fixed", bottom: 24, left: "50%",
                transform: toast ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(20px)",
                zIndex: 50, padding: "12px 24px", borderRadius: 100,
                background: "oklch(0.12 0.07 50/0.92)", border: `1px solid ${HAIR}`,
                color: "oklch(0.92 0.13 62)", fontSize: 14, fontWeight: 600,
                backdropFilter: "blur(12px)", opacity: toast ? 1 : 0,
                pointerEvents: "none", transition: "opacity 0.35s, transform 0.35s",
                fontFamily: INTER,
            }}>
                {t.toast}
            </div>
        </section>
    );
}
