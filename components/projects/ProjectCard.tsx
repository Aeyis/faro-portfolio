"use client";

import React, { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type Project = {
    name:        string;
    desc:        string;
    stack:       readonly string[];
    /** nom des fichiers dans /public/assets/projects (sans extension) */
    video:       string;
    github:      string;
    /** "landscape" : vidéo en bandeau au-dessus — "portrait" : vidéo verticale à gauche */
    orientation: "landscape" | "portrait";
};

type Props = {
    project:   Project;
    seeLabel:  string;
    gsapReady: boolean;
};

const CARD_BG = "oklch(0.08 0.07 280)";

export default function ProjectCard({ project, seeLabel, gsapReady }: Props) {
    const { name, desc, stack, video, github, orientation } = project;
    const isPortrait = orientation === "portrait";

    const cardRef       = useRef<HTMLDivElement>(null);
    const screenshotRef = useRef<HTMLDivElement>(null);
    const glowRef       = useRef<HTMLDivElement>(null);

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
        if (!gsapReady) return;

        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            /* reveal de la carte — desktop uniquement */
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
                            invalidateOnRefresh: true,
                        },
                    }
                );
            }
        });

        mm.add("(max-width: 767px)", () => {
            /* Mobile — carte visible immédiatement, sans scroll-reveal */
            if (cardRef.current) gsap.set(cardRef.current, { opacity: 1, y: 0 });
        });

        /* parallax screenshot — bandeau uniquement (la vidéo verticale est affichée en entier) */
        if (!isPortrait && screenshotRef.current) {
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
    }, { dependencies: [gsapReady] });

    const videoEl = (
        <video
            autoPlay muted loop playsInline
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback"
            style={{
                width: "100%", height: "100%", display: "block", pointerEvents: "none",
                objectFit: isPortrait ? "contain" : "cover",
            }}
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
            <source src={`/assets/projects/${video}.webm`} type="video/webm" />
            <source src={`/assets/projects/${video}.mp4`}  type="video/mp4" />
        </video>
    );

    const githubBtn = (
        <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="project-github font-inter-tight"
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
    );

    const seeSpan = (
        <span className="project-see font-inter-tight" style={{
            fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "oklch(0.78 0.18 285)",
        }}>
            {seeLabel}
        </span>
    );

    const title = (
        <h3 className="font-inter-tight" style={{
            fontSize: isPortrait ? 44 : 34, fontWeight: 900, letterSpacing: "-0.04em",
            margin: 0, color: "oklch(0.92 0.10 290)", lineHeight: 1,
        }}>
            {name}
        </h3>
    );

    const description = (
        <p className="font-fraunces" style={{
            fontSize: isPortrait ? 18 : 14, fontWeight: 300, fontStyle: "italic",
            color: "oklch(0.60 0.10 285)", margin: isPortrait ? "14px 0 0" : "7px 0 0",
            lineHeight: 1.45,
        }}>
            {desc}
        </p>
    );

    const tags = (
        <div className="project-tags" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {stack.map(tech => (
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
    );

    return (
        <div className="project-wrap" style={{ width: "100%", perspective: 1100 }}>
            <div
                ref={cardRef}
                className={isPortrait ? "project-card project-portrait" : "project-card"}
                style={{
                    borderRadius: 20, overflow: "hidden",
                    border:    "1px solid oklch(0.55 0.22 285 / 0.55)",
                    boxShadow: "0 24px 80px oklch(0 0 0 / 0.65), 0 0 80px oklch(0.4 0.18 285 / 0.20)",
                    willChange: "transform",
                    position: "relative",
                    background: CARD_BG,
                    ...(isPortrait && { display: "grid", gridTemplateColumns: "320px 1fr" }),
                }}
            >
                {/* glow hover qui suit la souris */}
                <div ref={glowRef} style={{
                    position: "absolute", inset: 0, zIndex: 10,
                    pointerEvents: "none", transition: "background 0.1s",
                    borderRadius: 20,
                }} />

                {isPortrait ? (
                    <>
                        {/* Vidéo verticale */}
                        <div className="project-portrait-video" style={{
                            aspectRatio: "9 / 16", position: "relative",
                            background: "oklch(0.06 0.06 280)",
                        }}>
                            {videoEl}
                            <div className="project-portrait-fade" style={{
                                position: "absolute", top: 0, bottom: 0, right: 0, width: 40,
                                background: `linear-gradient(to right, transparent, ${CARD_BG})`,
                                pointerEvents: "none",
                            }} />
                        </div>

                        {/* Infos */}
                        <div className="project-info project-portrait-info" style={{
                            padding: "48px 56px",
                            display: "flex", flexDirection: "column", justifyContent: "center", gap: 28,
                        }}>
                            <div>
                                {title}
                                {description}
                            </div>
                            <div className="project-cta" style={{ display: "flex", alignItems: "center", gap: 18 }}>
                                {seeSpan}
                                {githubBtn}
                            </div>
                            {tags}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Screenshot */}
                        <div className="project-video" style={{ height: 340, overflow: "hidden", position: "relative", background: "oklch(0.08 0.06 280)" }}>
                            <div
                                ref={screenshotRef}
                                className="project-video-inner"
                                style={{
                                    position: "absolute", top: "-15%", left: 0, right: 0, bottom: "-15%",
                                    transformOrigin: "center center",
                                }}
                            >
                                {videoEl}
                            </div>
                            <div style={{
                                position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
                                background: `linear-gradient(to bottom, transparent, ${CARD_BG})`,
                                pointerEvents: "none",
                            }} />
                        </div>

                        {/* Infos */}
                        <div className="project-info" style={{ padding: "28px 36px 32px" }}>
                            <div className="project-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                                <div>
                                    {title}
                                    {description}
                                </div>

                                <div className="project-cta" style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                                    {seeSpan}
                                    {githubBtn}
                                </div>
                            </div>

                            {tags}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
