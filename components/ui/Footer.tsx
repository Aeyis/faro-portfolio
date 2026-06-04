"use client";

import { useState } from "react";

const YEAR = new Date().getFullYear();

const MENTIONS = `
**Éditeur du site**
Rafael Solis Ramos — Développeur Fullstack
Contact : raf045@hotmail.com

**Hébergement**
Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA
https://vercel.com

**Propriété intellectuelle**
L'ensemble du contenu de ce site (textes, images, animations, code) est la propriété exclusive de Rafael Solis Ramos, sauf mention contraire. Toute reproduction, même partielle, est interdite sans autorisation préalable.

**Données personnelles**
Ce site ne collecte aucune donnée personnelle à des fins commerciales. Les données soumises via le formulaire de contact sont uniquement utilisées pour répondre aux demandes.

**Cookies**
Ce site n'utilise pas de cookies de traçage ou publicitaires.

**Responsabilité**
Les informations présentes sur ce site sont fournies à titre indicatif. L'éditeur ne saurait être tenu responsable des erreurs ou omissions.
`.trim();

const CREDITS = `
**Typographies**
— Syne — Google Fonts (OFL)
— Inter Tight — Google Fonts (OFL)
— Fraunces — Google Fonts (OFL)
— Cormorant Garamond — Google Fonts (OFL)
— DM Sans — Google Fonts (OFL)
— JetBrains Mono — JetBrains (Apache 2.0)

**Bibliothèques & outils**
— Next.js 16 — Vercel (MIT)
— React 19 — Meta (MIT)
— GSAP — GreenSock (GSAP Standard License)
— Lenis — Studio Freight (MIT)
— Matter.js — Liam Brummitt (MIT)
— Three.js — mrdoob (MIT)
— SplitType — Luke Peavey (MIT)
— EmailJS — EmailJS (commercial)
— Tailwind CSS v4 — Tailwind Labs (MIT)

**Assets visuels**
— Illustrations et photographies : Rafael Solis Ramos
— Icônes technos : SVG issus de https://devicons.github.io (MIT)

**Inspiration & références**
— Awwwards.com pour les tendances UI/UX
— Dribbble.com pour l'inspiration visuelle
— CodePen.io pour les expérimentations créatives
`.trim();

function Overlay({ title, content, onClose }: { title: string; content: string; onClose: () => void }) {
    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed", inset: 0, zIndex: 200,
                    background: "rgba(2, 6, 14, 0.80)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                }}
            />

            {/* Panel */}
            <div style={{
                position: "fixed", inset: "5vh 5vw",
                zIndex: 201,
                background: "rgba(4, 10, 18, 0.92)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                backdropFilter: "blur(32px) saturate(1.5)",
                WebkitBackdropFilter: "blur(32px) saturate(1.5)",
                display: "flex", flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}>
                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "24px 32px",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    flexShrink: 0,
                }}>
                    <h2 style={{
                        margin: 0, fontSize: "clamp(18px, 3vw, 28px)", fontWeight: 900,
                        fontFamily: "var(--font-inter-tight, sans-serif)", letterSpacing: "-0.04em",
                        color: "rgba(255,255,255,0.9)",
                    }}>{title}</h2>
                    <button onClick={onClose} style={{
                        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "50%", width: 40, height: 40, cursor: "pointer",
                        color: "rgba(255,255,255,0.7)", fontSize: 18, display: "flex",
                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>✕</button>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1, overflowY: "auto", padding: "28px 32px",
                    fontFamily: "var(--font-roboto, sans-serif)",
                    fontSize: "clamp(13px, 1.5vw, 15px)",
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.65)",
                }}>
                    {content.split("\n").map((line, i) => {
                        if (line.startsWith("**") && line.endsWith("**")) {
                            return <p key={i} style={{ margin: "20px 0 8px", fontWeight: 700, color: "rgba(255,255,255,0.9)", fontSize: "clamp(13px, 1.6vw, 16px)", letterSpacing: "0.02em" }}>{line.replace(/\*\*/g, "")}</p>;
                        }
                        if (line.startsWith("— ")) {
                            return <p key={i} style={{ margin: "4px 0", paddingLeft: 16 }}>{line}</p>;
                        }
                        if (line.trim() === "") return <br key={i} />;
                        return <p key={i} style={{ margin: "6px 0" }}>{line}</p>;
                    })}
                </div>
            </div>
        </>
    );
}

export default function Footer() {
    const [overlay, setOverlay] = useState<"mentions" | "credits" | null>(null);

    return (
        <>
            <footer style={{
                background: "#000",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "clamp(24px, 4vw, 40px) clamp(20px, 6vw, 80px)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                fontFamily: "var(--font-inter-tight, sans-serif)",
            }}>
                {/* Gauche : nom + copyright */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 900, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.9)" }}>
                        © {YEAR} Faro
                    </span>
                    <span style={{ fontSize: "clamp(11px, 1.2vw, 13px)", color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>
                        Rafael Solis Ramos · Développeur Fullstack
                    </span>
                </div>

                {/* Centre : liens légaux */}
                <div style={{ display: "flex", gap: "clamp(12px, 2vw, 24px)", flexWrap: "wrap", justifyContent: "center" }}>
                    {[
                        { label: "Mentions légales", key: "mentions" as const },
                        { label: "Crédits & Sources", key: "credits" as const },
                    ].map(({ label, key }) => (
                        <button key={key} onClick={() => setOverlay(key)} style={{
                            background: "none", border: "none", cursor: "pointer",
                            fontSize: "clamp(11px, 1.2vw, 13px)", fontWeight: 600,
                            letterSpacing: "0.06em", textTransform: "uppercase",
                            color: "rgba(255,255,255,0.35)",
                            transition: "color 0.2s",
                            padding: "4px 0",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                        >{label}</button>
                    ))}
                </div>

                {/* Droite : fait avec */}
                <span style={{ fontSize: "clamp(11px, 1.2vw, 13px)", color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>
                    Fait avec Next.js · GSAP · ❤️
                </span>
            </footer>

            {overlay === "mentions" && (
                <Overlay title="Mentions légales" content={MENTIONS} onClose={() => setOverlay(null)} />
            )}
            {overlay === "credits" && (
                <Overlay title="Crédits & Sources" content={CREDITS} onClose={() => setOverlay(null)} />
            )}
        </>
    );
}
