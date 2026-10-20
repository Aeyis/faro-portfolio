"use client";

import React, { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION_HEIGHTS, SECTION_HEIGHTS_MOBILE } from "@/lib/constants";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLang } from "@/lib/LanguageContext";
import { T } from "@/lib/translations";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";
import ProjectCard, { type Project } from "@/components/projects/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const BG = "oklch(0.06 0.07 280)";

const getProjects = (t: (typeof T)[keyof typeof T]["projects"]): Project[] => [
    {
        name: "Checkmate", desc: t.checkmateDesc, video: "checkmate", orientation: "landscape",
        github: "https://github.com/Aeyis/Checkmate-labo-angular",
        stack: ["Angular 21", "TypeScript", "RxJS", "Express 5", "PostgreSQL", "Sequelize", "Docker"],
    },
    {
        name: "KoKoon", desc: t.kokoonDesc, video: "kokoon", orientation: "portrait",
        github: "https://github.com/Aeyis/KoKoon",
        stack: ["Angular 21", "Angular Material", "TypeScript", "NestJS 11", "TypeORM", "PostgreSQL", "JWT", "Swagger", "Docker"],
    },
];

const COMING_SOON_KEYS = [0] as const;

export default function ProjectsSection() {
    const { lang } = useLang();
    const t = T[lang].projects;
    const isMobile = useIsMobile();
    const sectionRef    = useRef<HTMLElement>(null);
    const titleRef      = useRef<HTMLHeadingElement>(null);
    const floatRef      = useRef<HTMLDivElement>(null);
    const comingRefs    = useRef<(HTMLDivElement | null)[]>([]);
    const [gsapReady, setGsapReady] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setGsapReady(true); obs.disconnect(); } },
            { rootMargin: "800px" }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useGSAP(() => {
        if (!gsapReady) return;
        const el = titleRef.current;
        if (!el) return;

        const isMob = window.innerWidth < 768;
        if (isMob) gsap.set(el, { transformOrigin: "top center" });
        gsap.to(el, {
            scale:           () => window.innerWidth < 768 ? 0.55 : 0.40,
            x: () => window.innerWidth < 768 ? 0 : 40 - el.offsetLeft,
            y: () => (window.innerWidth < 768 ? 40 : 28) - (floatRef.current?.offsetTop ?? 80),
            transformOrigin: window.innerWidth < 768 ? "top center" : "top left",
            ease:            "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start:   isMob ? "top+=300 top" : "top top",
                end:     isMob ? "+=800" : "+=400",
                scrub: 0.4, invalidateOnRefresh: true,
                onLeave:     () => window.dispatchEvent(new Event("projets-stuck")),
                onEnterBack: () => window.dispatchEvent(new Event("projets-unstuck")),
            },
        });

        gsap.to(floatRef.current, {
            y: -14, duration: 2.8, ease: "sine.inOut", repeat: -1, yoyo: true,
        });

        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            /* À venir — clip-path reveal décalé — desktop uniquement */
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
                            invalidateOnRefresh: true,
                        },
                    }
                );
            });
        });

        mm.add("(max-width: 767px)", () => {
            /* Mobile — cartes visibles immédiatement, sans scroll-reveal */
            comingRefs.current.forEach(card => {
                if (card) gsap.set(card, { clipPath: "none" });
            });
        });

    }, { scope: sectionRef, dependencies: [gsapReady] });

    return (
        <section
            id="projets"
            ref={sectionRef}
            style={{ height: isMobile ? SECTION_HEIGHTS_MOBILE.projects : SECTION_HEIGHTS.projects, position: "relative", backgroundColor: BG }}
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
                        className="font-inter-tight about-title projects-title"
                        style={{
                            fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 0.9,
                            /* espace sous la ligne pour que le gradient (background-clip: text) couvre le jambage du j */
                            margin: 0, paddingBottom: "0.15em", userSelect: "none",
                            backgroundImage: "radial-gradient(in oklch circle at 50% 50%, oklch(0.95 0.12 295) 0%, oklch(0.75 0.26 285) 50%, oklch(0.40 0.20 278) 100%)",
                            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
                            filter: "drop-shadow(0 0 30px oklch(0.7 0.26 285 / 0.18))",
                        } as React.CSSProperties}
                    >
                        Projets
                    </h2>
                </div>
            </div>

            {/* ── Cartes projets + À venir ── */}
            <div
                className="projects-list"
                style={{
                    position: "absolute", top: 780,
                    left: "50%", transform: "translateX(-50%)",
                    width: "min(1080px, 92vw)",
                    display: "flex", flexDirection: "column", gap: 96,
                    zIndex: 5,
                }}
            >
                {getProjects(t).map(project => (
                    <ProjectCard key={project.name} project={project} seeLabel={t.seeProject} gsapReady={gsapReady} />
                ))}

                {/* ── Cartes À venir ── */}
                <div className="projects-coming" style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
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
                            {/* Nom du projet masqué — carte générique "À venir" */}
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
