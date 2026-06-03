"use client";

import React, { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION_HEIGHTS } from "@/lib/constants";
import { useLang } from "@/lib/LanguageContext";
import { T } from "@/lib/translations";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";

gsap.registerPlugin(ScrollTrigger);

const BG = "oklch(0.06 0.07 280)";

const CHECKMATE_STACK = ["Angular 21", "TypeScript", "RxJS", "Express 5", "PostgreSQL", "Sequelize", "Docker"];

const COMING_SOON_KEYS = [0, 1, 2] as const;

export default function ProjectsSection() {
    const { lang } = useLang();
    const t = T[lang].projects;
    const sectionRef    = useRef<HTMLElement>(null);
    const titleRef      = useRef<HTMLHeadingElement>(null);
    const floatRef      = useRef<HTMLDivElement>(null);
    const cardWrapRef   = useRef<HTMLDivElement>(null);
    const cardRef       = useRef<HTMLDivElement>(null);
    const screenshotRef = useRef<HTMLDivElement>(null);
    const glowRef       = useRef<HTMLDivElement>(null);
    const comingRefs    = useRef<(HTMLDivElement | null)[]>([]);

    /* ── 3D tilt au hover ── */
    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const onMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;

            gsap.to(card, {
                rotateY:             x * 10,
                rotateX:            -y * 7,
                transformPerspective: 1100,
                duration:            0.55,
                ease:                "power2.out",
            });

            if (glowRef.current) {
                glowRef.current.style.background = `radial-gradient(
                    400px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%,
                    oklch(0.30 0.18 285 / 0.18) 0%,
                    transparent 70%
                )`;
            }
        };

        const onLeave = () => {
            gsap.to(card, {
                rotateX: 0, rotateY: 0,
                duration: 0.9, ease: "power3.out",
            });
            if (glowRef.current) glowRef.current.style.background = "transparent";
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        return () => {
            card.removeEventListener("mousemove", onMove);
            card.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    useGSAP(() => {
        const el = titleRef.current;
        if (!el) return;

        gsap.fromTo(el,
            { "--gy": "60vh" },
            {
                "--gy": "-20vh",
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom", end: "bottom top", scrub: 0.6,
                },
            }
        );

        gsap.to(el, {
            scale:           () => window.innerWidth < 768 ? 0.55 : 0.40,
            x:               () => (window.innerWidth < 768 ? 24 : 40) - el.offsetLeft,
            y:               () => (window.innerWidth < 768 ? 40 : 28) - (floatRef.current?.offsetTop ?? 80),
            transformOrigin: "top left",
            ease:            "none",
            scrollTrigger: {
                trigger: sectionRef.current, start: "top top", end: "+=400",
                scrub: 0.4, invalidateOnRefresh: true,
            },
        });

        gsap.to(floatRef.current, {
            y: -14, duration: 2.8, ease: "sine.inOut", repeat: -1, yoyo: true,
        });

        /* reveal de la carte */
        if (cardRef.current) {
            gsap.fromTo(cardRef.current,
                { y: 60, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start:   "top 88%",
                        end:     "top 52%",
                        scrub:   0.7,
                    },
                }
            );
        }

        /* parallax screenshot — zoom out au scroll */
        if (screenshotRef.current) {
            gsap.fromTo(screenshotRef.current,
                { y: -20 },
                {
                    y: 20,
                    ease: "none",
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start:   "top bottom",
                        end:     "bottom top",
                        scrub:   true,
                    },
                }
            );
        }

        /* À venir — clip-path reveal décalé */
        comingRefs.current.forEach((card, i) => {
            if (!card) return;
            gsap.fromTo(card,
                { clipPath: "inset(0 0 100% 0 round 16px)" },
                {
                    clipPath: "inset(0 0 0% 0 round 16px)",
                    scrollTrigger: {
                        trigger: card,
                        start:   `top 92%`,
                        end:     `top ${62 - i * 4}%`,
                        scrub:   0.5,
                    },
                }
            );
        });

    }, { scope: sectionRef });

    return (
        <section
            id="projets"
            ref={sectionRef}
            style={{ height: SECTION_HEIGHTS.projects, position: "relative", backgroundColor: BG }}
        >
            <UnderwaterBackground variant="violet" />



            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "28vh",
                background: "linear-gradient(to bottom, #000703 0%, transparent 100%)",
                pointerEvents: "none", zIndex: 2,
            }} />
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "50vh",
                background: "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.22 0.20 285 / 0.45) 0%, transparent 100%)",
                pointerEvents: "none", zIndex: 1,
            }} />

            {/* titre */}
            <div style={{ position: "sticky", top: 0, height: "100vh", zIndex: 10, pointerEvents: "none" }}>
                <div ref={floatRef} style={{ position: "absolute", top: "80px", left: "40px", right: "40px" }}>
                    <h2
                        ref={titleRef}
                        className="font-inter-tight about-title"
                        style={{
                            fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 0.9,
                            margin: 0, paddingBottom: "0.15em", userSelect: "none",
                            "--gy": "50vh",
                            backgroundImage: `radial-gradient(
                                in oklch circle at 50% var(--gy),
                                oklch(0.95 0.10 295)  0vh,
                                oklch(0.75 0.24 285)  50vh,
                                oklch(0.40 0.20 275)  90vh,
                                oklch(0.15 0.08 270 / 0) 150vh
                            )`,
                            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
                            filter: "drop-shadow(0 0 30px oklch(0.7 0.24 285 / 0.18))",
                        } as React.CSSProperties}
                    >
                        Projets
                    </h2>
                </div>
            </div>

            {/* ── Carte Checkmate ── */}
            <div
                ref={cardWrapRef}
                style={{
                    position: "absolute", top: 780,
                    left: "50%", transform: "translateX(-50%)",
                    width: "min(1080px, 92vw)",
                    perspective: 1100,
                    zIndex: 5,
                }}
            >
                <div
                    ref={cardRef}
                    style={{
                        borderRadius: 20, overflow: "hidden",
                        border:    "1px solid oklch(0.55 0.22 285 / 0.55)",
                        boxShadow: "0 24px 80px oklch(0 0 0 / 0.65), 0 0 80px oklch(0.4 0.18 285 / 0.20)",
                        willChange: "transform",
                        position: "relative",
                    }}
                >
                    {/* glow hover qui suit la souris */}
                    <div ref={glowRef} style={{
                        position: "absolute", inset: 0, zIndex: 10,
                        pointerEvents: "none", transition: "background 0.1s",
                        borderRadius: 20,
                    }} />

                    {/* Screenshot */}
                    <div style={{ height: 340, overflow: "hidden", position: "relative", background: "oklch(0.08 0.06 280)" }}>
                        <div
                            ref={screenshotRef}
                            style={{
                                position: "absolute", top: "-15%", left: 0, right: 0, bottom: "-15%",
                                transformOrigin: "center center",
                            }}
                        >
                            <video
                                autoPlay muted loop playsInline
                                disablePictureInPicture
                                disableRemotePlayback
                                controlsList="nodownload nofullscreen noremoteplayback"
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
                                ref={el => {
                                    if (el && 'mediaSession' in navigator) {
                                        try {
                                            navigator.mediaSession.metadata = null;
                                            navigator.mediaSession.playbackState = 'none';
                                            (['play','pause','stop','seekbackward','seekforward','seekto','previoustrack','nexttrack'] as MediaSessionAction[])
                                                .forEach(a => { try { navigator.mediaSession.setActionHandler(a, null); } catch{} });
                                        } catch{}
                                    }
                                }}
                            >
                                <source src="/assets/projects/checkmate.webm" type="video/webm" />
                                <source src="/assets/projects/checkmate.mp4"  type="video/mp4" />
                            </video>
                        </div>
                        <div style={{
                            position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
                            background: "linear-gradient(to bottom, transparent, oklch(0.08 0.07 280))",
                            pointerEvents: "none",
                        }} />
                    </div>

                    {/* Infos */}
                    <div style={{ background: "oklch(0.08 0.07 280)", padding: "28px 36px 32px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                            <div>
                                <h3 className="font-inter-tight" style={{
                                    fontSize: 34, fontWeight: 900, letterSpacing: "-0.04em",
                                    margin: 0, color: "oklch(0.92 0.10 290)", lineHeight: 1,
                                }}>
                                    Checkmate
                                </h3>
                                <p className="font-fraunces" style={{
                                    fontSize: 14, fontWeight: 300, fontStyle: "italic",
                                    color: "oklch(0.60 0.10 285)", margin: "7px 0 0",
                                }}>
                                    {t.checkmateDesc}
                                </p>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                            <span className="font-inter-tight" style={{
                                fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: "oklch(0.78 0.18 285)",
                            }}>
                                {t.seeProject}
                            </span>
                            <a
                                href="https://github.com/Aeyis/Checkmate-labo-angular"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-inter-tight"
                                style={{
                                    display: "flex", alignItems: "center", gap: 7,
                                    padding: "9px 18px", borderRadius: 10,
                                    border: "1px solid oklch(0.58 0.22 285 / 0.65)",
                                    background: "oklch(0.16 0.10 280)",
                                    color: "oklch(0.88 0.18 285)",
                                    fontSize: 13, fontWeight: 700, letterSpacing: "-0.02em",
                                    textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.2s",
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.background   = "oklch(0.16 0.10 280)";
                                    (e.currentTarget as HTMLAnchorElement).style.borderColor  = "oklch(0.55 0.22 285 / 0.6)";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.background   = "oklch(0.12 0.08 280 / 0.8)";
                                    (e.currentTarget as HTMLAnchorElement).style.borderColor  = "oklch(0.45 0.18 285 / 0.45)";
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                                </svg>
                                GitHub
                            </a>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {CHECKMATE_STACK.map(tech => (
                                <span key={tech} className="font-inter-tight" style={{
                                    padding: "4px 12px", borderRadius: 100,
                                    background: "oklch(0.13 0.07 285 / 0.8)",
                                    border: "1px solid oklch(0.38 0.14 285 / 0.28)",
                                    color: "oklch(0.68 0.12 285)",
                                    fontSize: 11, fontWeight: 600, letterSpacing: "0.02em",
                                }}>
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Cartes À venir ── */}
            <div style={{
                position: "absolute", top: 1380,
                left: "50%", transform: "translateX(-50%)",
                width: "min(1080px, 92vw)",
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
                zIndex: 5,
            }}>
                {COMING_SOON_KEYS.map((_, i) => (
                    <div
                        key={i}
                        ref={el => { comingRefs.current[i] = el; }}
                        style={{
                            borderRadius: 20,
                            border:       "1px solid oklch(0.52 0.18 285 / 0.55)",
                            background:   "oklch(0.09 0.07 280 / 0.95)",
                            padding:      "60px 32px 56px",
                            boxShadow:    "0 12px 48px oklch(0 0 0 / 0.55), 0 0 40px oklch(0.4 0.18 285 / 0.08)",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 18, textAlign: "center",
                        }}
                    >
                        <div style={{
                            width: 56, height: 56, borderRadius: "50%",
                            border: "1px solid oklch(0.45 0.13 285 / 0.40)",
                            background: "oklch(0.11 0.06 280)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "oklch(0.50 0.12 285)", fontSize: 20, letterSpacing: 3,
                        }}>
                            ···
                        </div>
                        <span className="font-inter-tight" style={{
                            color: "oklch(0.58 0.12 285)", fontSize: 12,
                            fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                        }}>
                            {t.comingSoon}
                        </span>
                        <span className="font-fraunces" style={{
                            color: "oklch(0.50 0.10 285)", fontSize: 18,
                            fontStyle: "italic", fontWeight: 300, lineHeight: 1.4,
                        }}>
                            {t.items[i]}
                        </span>
                    </div>
                ))}
            </div>

        </section>
    );
}