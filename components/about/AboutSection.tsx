"use client";

import React, { useRef, useEffect } from "react";
import { useLang } from "@/lib/LanguageContext";
import { T } from "@/lib/translations";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useAboutParallax } from "@/hooks/useAboutParallax";
import { SECTION_HEIGHTS } from "@/lib/constants";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";
import { useIsMobile } from "@/hooks/useIsMobile";
import AboutSectionMobile from "./AboutSectionMobile";

gsap.registerPlugin(ScrollTrigger);

const HN  = "bio-roboto";
const DID = "bio-meie";

function BioParagraph({ t, sectionRef }: { t: typeof T["fr"]["about"] | typeof T["en"]["about"]; sectionRef: React.RefObject<HTMLElement | null> }) {
    const bioRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const bio = bioRef.current;
        const sectionEl = sectionRef.current;
        if (!bio || !sectionEl) return;

        let st: ReturnType<typeof ScrollTrigger.create> | undefined;
        let split: SplitType | undefined;

        /* Différé après le rendu initial pour ne pas bloquer le LCP */
        const timer = setTimeout(() => {
            split = new SplitType(bio, { types: "chars,words" });
            split.chars?.forEach(char => {
                let el: HTMLElement | null = char.parentElement;
                while (el && el !== bio) {
                    if (el.classList.contains("bio-roboto")) { char.classList.add("bio-roboto"); break; }
                    if (el.classList.contains("bio-meie"))   { char.classList.add("bio-meie");   break; }
                    el = el.parentElement;
                }
            });
            st = ScrollTrigger.create({
                trigger: sectionEl,
                start: window.innerWidth < 768 ? "top+=900 top" : "top+=420 top",
                end: () => `+=${window.innerHeight * 3.5}`,
                scrub: true,
                animation: gsap.from(split!.chars, { opacity: 0, filter: "blur(12px)", ease: "power2.out", stagger: 0.015, paused: true }),
            });
        }, 300);

        return () => { clearTimeout(timer); st?.kill(); split?.revert(); };
    }, []);

    return (
        <p ref={bioRef} style={{ margin: 0 }}>
            <span className="bio-line-block about-name-line" style={{ textAlign: "right" }}>
                <span className={`${HN} bio-bold`} style={{ textAlign: "right" }}>Rafael Solis Ramos, </span>
                <span className={DID} style={{ fontSize: "0.95em", marginLeft: "0.3em" }}>{t.role}</span>
            </span>
            <span className={`${HN} block`} style={{ paddingLeft:"5%", marginTop: "1.2em", whiteSpace: "nowrap" }}>{t.line1} <span className={DID} style={{ fontStyle: "italic", fontSize: "1.2em" }}>{t.word1}</span></span>
            <span className={`${HN} block`} style={{ paddingLeft:"5%", whiteSpace: "nowrap" }}>{t.line2} <span className={DID} style={{ fontStyle: "italic", fontSize: "1.2em" }}>{t.word2}</span></span>
            <span className={`${HN} block`} style={{ paddingLeft:"5%", whiteSpace: "nowrap" }}>{t.line3} <span className={DID} style={{ fontStyle: "italic", fontSize: "1.2em" }}>{t.word3}</span></span>
            <span className={`${DID} block`} style={{ paddingLeft:"5%"}}>{t.line4}</span>
            <span className={`${HN} block bio-bold`} style={{ paddingLeft:"5%", marginTop: "1.2em" }}>{t.motor}</span>
            <span className={`${HN} block`} style={{ paddingLeft:"5%" }}>{t.line5} <span className={DID} style={{ fontStyle: "italic", fontSize: "1.2em" }}>{t.word5}</span> {t.line5b}</span>
            <span className={`${HN} block`} style={{ paddingLeft:"5%", whiteSpace: "nowrap" }}>{t.line6} <span className={DID} style={{ fontStyle: "italic", fontSize: "1.2em" }}>{t.word6}</span></span>
            <span className={`${HN} block`} style={{ paddingLeft:"5%" }}>{t.line7} <span className={DID} style={{ fontStyle: "italic", fontSize: "1.2em" }}>{t.word7}</span></span>
        </p>
    );
}

function AboutSectionDesktop() {
    const { lang } = useLang();
    const t = T[lang].about;
    const { sectionRef } = useAboutParallax();
    const titleRef = useRef<HTMLHeadingElement>(null);
    const floatRef = useRef<HTMLDivElement>(null);
    const lineRef     = useRef<HTMLDivElement>(null);
    const linesRef    = useRef<(HTMLDivElement | null)[]>([]);
    const svgLinesRef = useRef<(SVGPathElement | SVGLineElement | null)[]>([]);
    const photoWrapRef = useRef<HTMLDivElement>(null);
    const photo2Ref    = useRef<HTMLDivElement>(null);


    useGSAP(() => {
        const el  = titleRef.current;
        if (!el) return;

        // ── Gradient parallax sur le titre ──
        gsap.fromTo(el,
            { "--gy": "60vh" },
            {
                "--gy": "-20vh",
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.6,
                },
            }
        );

        // ── Titre → coin haut-gauche ──
        gsap.to(el, {
            scale: () => window.innerWidth < 768 ? 0.55 : 0.40,
            x: () => window.innerWidth < 768 ? 0 : 40 - el.offsetLeft,
            y: () => (window.innerWidth < 768 ? 40 : 28) - (floatRef.current?.offsetTop ?? 80),
            transformOrigin: window.innerWidth < 768 ? "top center" : "top left",
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: () => window.innerWidth < 768 ? "+=800" : "+=400",
                scrub: 0.4,
                invalidateOnRefresh: true,
                onLeave:     () => window.dispatchEvent(new Event("about-stuck")),
                onEnterBack: () => window.dispatchEvent(new Event("about-unstuck")),
            },
        });

        // ── Float du titre ──
        gsap.to(floatRef.current, {
            y: -14,
            duration: 2.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
        });

        /* SVG lignes — effet tracé strokeDashoffset */
        svgLinesRef.current.forEach((path, i) => {
            if (!path) return;
            const len = (path as SVGGeometryElement).getTotalLength?.() ?? 300;
            gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
            gsap.to(path, {
                strokeDashoffset: 0,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: `top+=${420 + i * 220}`,
                    end:   `top+=${680 + i * 220}`,
                    scrub: 1,
                },
            });
        });

        /* Photo — entrée au scroll */
        if (photoWrapRef.current) {
            gsap.fromTo(photoWrapRef.current,
                { clipPath: "inset(0 0 100% 0 round 16px)", opacity: 0 },
                {
                    clipPath: "inset(0 0 0% 0 round 16px)", opacity: 1,
                    ease: "power3.inOut",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top+=420 top",
                        end:   "top+=780 top",
                        scrub: 0.8,
                    },
                }
            );
        }

        /* Photo hover — clip-path wipe + tilt */
        const wrap = photoWrapRef.current;
        const p2   = photo2Ref.current;
        if (wrap && p2) {
            const onEnter = () => {
                gsap.to(p2,   { clipPath: "inset(0% 0 0% 0)", duration: 0.6, ease: "power3.inOut" });
                gsap.to(wrap, { scale: 1.03, duration: 0.5, ease: "power2.out" });
            };
            const onLeave = () => {
                gsap.to(p2,   { clipPath: "inset(100% 0 0% 0)", duration: 0.5, ease: "power3.inOut" });
                gsap.to(wrap, { scale: 1, rotateX: 0, rotateY: 0, duration: 0.6, ease: "power2.out" });
            };
            const onMove = (e: MouseEvent) => {
                const r = wrap.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
                const y = ((e.clientY - r.top)  / r.height - 0.5) * -12;
                gsap.to(wrap, { rotateY: x, rotateX: y, duration: 0.4, ease: "power2.out", transformPerspective: 800 });
            };
            wrap.addEventListener("mouseenter", onEnter);
            wrap.addEventListener("mouseleave", onLeave);
            wrap.addEventListener("mousemove",  onMove  as EventListener);
        }

        /* Ligne sous le texte */
        if (lineRef.current) {
            gsap.fromTo(lineRef.current,
                { scaleX: 0, opacity: 0 },
                {
                    scaleX: 1, opacity: 1,
                    transformOrigin: "left center",
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: () => `top+=${420 + window.innerHeight * 3.0}`,
                        end:   () => `top+=${420 + window.innerHeight * 3.5}`,
                        scrub: true,
                    },
                }
            );
        }

    }, { scope: sectionRef });


    return (
        <section
            id="about"
            ref={sectionRef}
            style={{ height: SECTION_HEIGHTS.about, position: "relative" }}
        >
            <UnderwaterBackground />

            {/* Transition bas → vert Stack */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: "35vh", pointerEvents: "none", zIndex: 2,
                background: "linear-gradient(to bottom, transparent, #000703)",
            }} />

            <div className="about-sticky" style={{ position: "sticky", top: 0, height: "100vh", padding: "80px 40px" }}>
                {/* Photo droite */}
                <div
                    ref={photoWrapRef}
                    className="about-photo-wrap"
                    style={{
                        position: "absolute",
                        right: "16vw",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "clamp(200px, 30vw, 420px)",
                        aspectRatio: "3/4",
                        borderRadius: 16,
                        overflow: "hidden",
                        zIndex: 2,
                        cursor: "crosshair",
                        opacity: 0,
                        clipPath: "inset(0 0 100% 0 round 16px)",
                        boxShadow: "0 24px 64px oklch(0 0 0 / 0.5)",
                    }}
                >
                    {/* Photo 1 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/about/moi.webp" alt="Rafael" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                    {/* Photo 2 — hover */}
                    <div
                        ref={photo2Ref}
                        style={{
                            position: "absolute", inset: 0,
                            clipPath: "inset(100% 0 0% 0)",
                            zIndex: 1,
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/about/moi2.webp" alt="Rafael" className="about-photo2" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "63% center" }} />
                    </div>
                    {/* Hint */}
                    <p className="font-fraunces" style={{
                        position: "absolute", bottom: 14, right: 16, zIndex: 2,
                        fontSize: 11, fontStyle: "italic", fontWeight: 300,
                        color: "rgba(255,255,255,0.55)", margin: 0, pointerEvents: "none",
                    }}>hover →</p>
                </div>
                <div ref={floatRef} style={{ position: "relative", zIndex: 1 }}>
                    <h2
                        ref={titleRef}
                        className="font-inter-tight about-title"
                        style={{
                            fontWeight: 900,
                            letterSpacing: "-0.05em",
                            lineHeight: 0.9,
                            margin: 0,
                            userSelect: "none",
                            "--gy": "50vh",
                            backgroundImage: `radial-gradient(
                                in oklch circle at 50% var(--gy),
                                oklch(0.95 0.12 200)  0vh,
                                oklch(0.75 0.25 220)  50vh,
                                oklch(0.40 0.20 280)  90vh,
                                oklch(0.15 0.08 260 / 0) 150vh
                            )`,
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            filter: "drop-shadow(0 0 30px oklch(0.7 0.25 220 / 0.15))",
                        } as React.CSSProperties}
                    >
                        {t.title}
                    </h2>
                </div>

                {/* Bio reveal */}
                <div className="about-bio" style={{ userSelect: "none", zIndex: 1 }}>
                <BioParagraph key={lang} t={t} sectionRef={sectionRef} />
                <div ref={lineRef} style={{
                    marginTop: 18,
                    height: 1,
                    background: "linear-gradient(to right, oklch(0.72 0.16 210 / 0.8), oklch(0.55 0.12 210 / 0.3) 60%, transparent)",
                    transformOrigin: "left center",
                }} />
                </div>
            </div>

            {/* SVG lignes décoratives */}
            <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1, overflow: "visible" }}
                preserveAspectRatio="none"
            >
                {/* Longue diagonale principale */}
                <path
                    ref={el => { svgLinesRef.current[0] = el; }}
                    d="M 5% 35% L 72% 62%"
                    stroke="oklch(0.65 0.16 210 / 0.45)" strokeWidth="0.8" fill="none" opacity="0"
                />
                {/* Arc élégant */}
                <path
                    ref={el => { svgLinesRef.current[1] = el; }}
                    d="M 8% 55% Q 35% 42% 62% 58%"
                    stroke="oklch(0.60 0.14 210 / 0.35)" strokeWidth="0.7" fill="none" opacity="0"
                />
                {/* Ligne horizontale courte haute droite */}
                <path
                    ref={el => { svgLinesRef.current[2] = el; }}
                    d="M 68% 38% L 92% 38%"
                    stroke="oklch(0.70 0.18 210 / 0.50)" strokeWidth="1" fill="none" opacity="0"
                />
                {/* Diagonale inverse basse */}
                <path
                    ref={el => { svgLinesRef.current[3] = el; }}
                    d="M 15% 72% L 58% 58%"
                    stroke="oklch(0.58 0.14 210 / 0.30)" strokeWidth="0.6" fill="none" opacity="0"
                />
                {/* Trait vertical accent */}
                <path
                    ref={el => { svgLinesRef.current[4] = el; }}
                    d="M 78% 44% L 78% 68%"
                    stroke="oklch(0.65 0.16 210 / 0.40)" strokeWidth="0.7" fill="none" opacity="0"
                />
                {/* Arc secondaire droit */}
                <path
                    ref={el => { svgLinesRef.current[5] = el; }}
                    d="M 55% 70% Q 72% 62% 88% 72%"
                    stroke="oklch(0.62 0.15 210 / 0.35)" strokeWidth="0.7" fill="none" opacity="0"
                />
            </svg>
        </section>
    );
}

export default function AboutSection() {
    const isMobile = useIsMobile();
    return isMobile ? <AboutSectionMobile /> : <AboutSectionDesktop />;
}