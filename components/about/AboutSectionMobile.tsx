"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/LanguageContext";
import { T } from "@/lib/translations";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";
import { SECTION_HEIGHTS_MOBILE } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const SECTION_H = SECTION_HEIGHTS_MOBILE.about;
const SCREEN    = 800; // fixe — ne pas dériver de SECTION_H

const TEXT_SIZE = "clamp(29px, 8vw, 40px)";
const TEXT_WT   = 900;
const TEXT_LS   = "-0.04em";
const TEXT_LH   = 1.9;
const TEXT_COL  = "oklch(0.93 0.04 200)";
const KW_COL    = "oklch(0.80 0.20 215)";
const UL_BG     = "oklch(0.72 0.22 215)";

function KW({ children, ulRef }: { children: React.ReactNode; ulRef: React.RefObject<HTMLSpanElement | null> }) {
    return (
        <span className="bio-meie" style={{ position: "relative", display: "inline-block", fontStyle: "italic", color: KW_COL, fontSize: "1.18em", lineHeight: 1 }}>
            {children}
            <span ref={ulRef} style={{
                position: "absolute", bottom: -1, left: 0, right: 0,
                height: 2, display: "block",
                background: UL_BG,
                transformOrigin: "left center",
                transform: "scaleX(0)",
            }} />
        </span>
    );
}

export default function AboutSectionMobile() {
    const { lang } = useLang();
    const t = T[lang].aboutMobile;

    const sectionRef = useRef<HTMLElement>(null);
    const titleRef   = useRef<HTMLDivElement>(null);
    const s1Ref      = useRef<HTMLDivElement>(null);
    const s2Ref      = useRef<HTMLDivElement>(null);
    const s3Ref      = useRef<HTMLDivElement>(null);
    const photo2Ref   = useRef<HTMLDivElement>(null);
    const photoCardRef = useRef<HTMLDivElement>(null);

    const ul1 = useRef<HTMLSpanElement>(null);  // technique
    const ul2 = useRef<HTMLSpanElement>(null);  // visuelle
    const ul3 = useRef<HTMLSpanElement>(null);  // interfaces
    const ul4 = useRef<HTMLSpanElement>(null);  // quelque chose à dire
    const ul5 = useRef<HTMLSpanElement>(null);  // curiosité / word5
    const ul6 = useRef<HTMLSpanElement>(null);  // les détails / word6
    const ul7 = useRef<HTMLSpanElement>(null);  // différence / word7

    const [tapped, setTapped] = useState(false);

    useGSAP(() => {
        const el = sectionRef.current;
        if (!el) return;

        const S = SCREEN;
        const scrub = 0.8;

        /* ── États initiaux ── */
        gsap.set([ul1.current, ul2.current, ul3.current, ul4.current, ul5.current, ul6.current, ul7.current], { scaleX: 0 });
        gsap.set(s1Ref.current, { opacity: 0, y: 40, filter: "blur(12px)" });
        gsap.set(s2Ref.current, { opacity: 0, y: 30 });
        gsap.set(s3Ref.current, { opacity: 0, y: 30 });

        /* ── Titre : se réduit vers le haut ── */
        gsap.to(titleRef.current, {
            scale: 0.65, transformOrigin: "top center", ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: `top+=${S * 0.4} top`, scrub },
        });

        /* ── S1 : entrée + hold + sortie dans une seule timeline ── */
        gsap.timeline({ scrollTrigger: { trigger: el, start: `top+=${S * 0.35} top`, end: `top+=${S * 1.3} top`, scrub } })
            .fromTo(s1Ref.current,
                { opacity: 0, y: 40, filter: "blur(12px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 0.28 }
            )
            .to(s1Ref.current, { opacity: 1, duration: 0.08 })
            .to(s1Ref.current, { opacity: 0, ease: "power2.in", duration: 0.64 });

        /* ── S2 : entrée + hold (dérive vers le haut) + sortie ── */
        gsap.timeline({ scrollTrigger: { trigger: el, start: `top+=${S * 1.15} top`, end: `top+=${S * 1.85} top`, scrub } })
            .fromTo(s2Ref.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, ease: "power2.out", duration: 0.27 }
            )
            .to(s2Ref.current, { opacity: 1, y: -18, ease: "none", duration: 0.44 })
            .to(s2Ref.current, { opacity: 0, ease: "power2.in", duration: 0.29 });

        /* Underlines S2 (après entrée complète) */
        ([ul1, ul2, ul3, ul4] as React.RefObject<HTMLSpanElement | null>[]).forEach((ref, i) => {
            gsap.to(ref.current, {
                scaleX: 1, ease: "power2.out",
                scrollTrigger: { trigger: el, start: `top+=${S * 1.38 + i * 48} top`, end: `top+=${S * 1.47 + i * 48} top`, scrub: 0.5 },
            });
        });

        /* ── S3 : entrée + drift — se termine exactement à la fin de la section ── */
        gsap.timeline({ scrollTrigger: { trigger: el, start: `top+=${S * 1.9} top`, end: `top+=${SECTION_H} top`, scrub } })
            .fromTo(s3Ref.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, ease: "power2.out", duration: 0.5 }
            )
            .to(s3Ref.current, { opacity: 1, y: -15, ease: "none", duration: 0.5 });

        /* Underlines S3 — se terminent exactement à la fin de la section */
        ([ul5, ul6, ul7] as React.RefObject<HTMLSpanElement | null>[]).forEach((ref, i) => {
            gsap.to(ref.current, {
                scaleX: 1, ease: "power2.out",
                scrollTrigger: { trigger: el, start: `top+=${SECTION_H - 108 + i * 36} top`, end: `top+=${SECTION_H - 72 + i * 36} top`, scrub: true },
            });
        });

    }, { scope: sectionRef });

    const handleTap = () => {
        if (tapped) return;
        setTapped(true);
        if (photo2Ref.current)
            gsap.to(photo2Ref.current, { clipPath: "inset(0% 0 0% 0)", duration: 0.65, ease: "power3.inOut" });
    };

    const textLine: React.CSSProperties = {
        margin: 0,
        fontSize: TEXT_SIZE,
        fontWeight: TEXT_WT,
        letterSpacing: TEXT_LS,
        lineHeight: TEXT_LH,
        color: TEXT_COL,
    };

    return (
        <section
            id="about"
            ref={sectionRef}
            style={{ height: SECTION_H, position: "relative" }}
        >
            <UnderwaterBackground />

            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "18vh", pointerEvents: "none", zIndex: 2, background: "linear-gradient(to bottom, transparent, #000703)" }} />

            <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

                {/* ── Titre "À propos" en haut au centre ── */}
                <div ref={titleRef} style={{ position: "absolute", top: 22, left: 0, right: 0, textAlign: "center", zIndex: 10, pointerEvents: "none" }}>
                    <h2 className="font-inter-tight" style={{
                        margin: 0,
                        fontSize: "clamp(56px, 18vw, 160px)",
                        fontWeight: 900,
                        letterSpacing: "-0.05em",
                        lineHeight: 1,
                        backgroundImage: "radial-gradient(in oklch circle at 50% 50%, oklch(0.95 0.12 200) 0%, oklch(0.75 0.25 220) 50%, oklch(0.40 0.20 280) 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                    } as React.CSSProperties}>
                        {t.title}
                    </h2>
                </div>

                {/* ── Écran 1 : Photo full width + nom ── */}
                <div ref={s1Ref} style={{
                    position: "absolute", inset: 0,
                    display: "flex", flexDirection: "column",
                    paddingTop: 76, paddingBottom: 120,
                }}>
                    {/* Photo pleine largeur, flex:1 remplit l'espace restant */}
                    <div
                        ref={photoCardRef}
                        onClick={handleTap}
                        style={{
                            position: "relative",
                            width: "100%",
                            flex: 1,
                            overflow: "hidden",
                            cursor: "pointer",
                            flexShrink: 0,
                            maskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, black 40%, transparent 100%), linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)",
                            WebkitMaskImage: "radial-gradient(ellipse 80% 65% at 50% 30%, black 40%, transparent 100%), linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)",
                            maskComposite: "intersect",
                            WebkitMaskComposite: "source-in",
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/about/moi.webp" alt="Rafael" style={{
                            position: "absolute", inset: 0, width: "100%", height: "100%",
                            objectFit: "cover", objectPosition: "center top",
                        }} />
                        <div ref={photo2Ref} style={{ position: "absolute", inset: 0, clipPath: "inset(100% 0 0% 0)", zIndex: 1 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/assets/about/moi2.webp" alt="Rafael plongée" style={{
                                width: "100%", height: "100%",
                                objectFit: "cover", objectPosition: "20% center",
                            }} />
                        </div>
                        {!tapped && (
                            <span style={{
                                position: "absolute", bottom: 10, right: 14, zIndex: 2,
                                fontSize: 10, fontStyle: "italic",
                                color: "rgba(255,255,255,0.45)",
                                fontFamily: "var(--font-fraunces)",
                            }}>
                                tap →
                            </span>
                        )}
                    </div>

                    {/* Nom + rôle sous la photo */}
                    <div style={{ textAlign: "center", padding: "10px 24px 0", flexShrink: 0 }}>
                        <p className="font-inter-tight" style={{
                            margin: 0, fontWeight: 900,
                            fontSize: "clamp(20px, 6.5vw, 32px)",
                            letterSpacing: "-0.03em", lineHeight: 1.1,
                            color: "rgba(255,255,255,0.96)",
                        }}>
                            Rafael Solis Ramos
                        </p>
                        <p className="bio-meie" style={{
                            margin: "5px 0 0",
                            fontSize: "clamp(20px, 6.5vw, 30px)",
                            color: "oklch(0.75 0.18 215)", fontStyle: "italic",
                        }}>
                            {t.role}
                        </p>
                    </div>
                </div>

                {/* ── Écran 2 : ── */}
                <div ref={s2Ref} style={{
                    position: "absolute", inset: 0, opacity: 0,
                    display: "flex", flexDirection: "column",
                    alignItems: "flex-start", justifyContent: "flex-start",
                    padding: "180px 28px 32px", gap: 6,
                }}>
                    <p className="font-inter-tight" style={{...textLine, textAlign: "center", width: "85%" }}>
                        {t.line1}
                    </p>
                    <p className="font-inter-tight" style={ {...textLine, paddingLeft: "1em" }}>
                        {t.line1b} <KW ulRef={ul1}>{t.word1}</KW>
                    </p>
                    <p className="font-inter-tight" style={  {...textLine, paddingLeft: "0.25em" } }>
                        {t.line2} <KW ulRef={ul2}>{t.word2}</KW>
                    </p>
                    <p className="font-inter-tight" style={{ ...textLine,  paddingLeft: "0.3em" } }>
                        {t.line3} <KW ulRef={ul3}>{t.word3}</KW>
                    </p>
                    <p className="font-inter-tight" style={{...textLine, textAlign: "center", width: "90%"}}>
                        {t.line4}
                    </p>
                    <p className="font-inter-tight" style={{...textLine, textAlign: "center", width: "100%" }}>
                        <KW ulRef={ul4}>{t.word4}</KW>
                    </p>
                </div>

                {/* ── Écran 3 : Mon moteur + curiosité + obsession ── */}
                <div ref={s3Ref} style={{
                    position: "absolute", inset: 0, opacity: 0,
                    display: "flex", flexDirection: "column",
                    alignItems: "flex-start", justifyContent: "flex-start",
                    padding: "230px 28px 32px", gap: 8,
                }}>
                    <p className="font-inter-tight" style={{
                        margin: 0,
                        fontSize: "clamp(29px, 8vw, 40px)",
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        color: "oklch(0.62 0.16 215)",
                        marginBottom: 8,
                    }}>
                        {t.motor}
                    </p>

                    <p className="font-inter-tight" style={{ ...textLine, wordSpacing: "0.2em" }}>
                        {t.line5} <KW ulRef={ul5}>{t.word5}</KW> {t.line5b}
                    </p>

                    <p className="font-inter-tight" style={textLine}>
                        {t.line6}
                    </p>
                    <p className="font-inter-tight" style={textLine}>
                        {t.line6b} <KW ulRef={ul6}>{t.word6}</KW>
                    </p>
                    <p className="font-inter-tight" style={{ ...textLine, wordSpacing: "0.2em" }}>
                        {t.line7} <KW ulRef={ul7}>{t.word7}</KW>
                    </p>
                </div>

            </div>
        </section>
    );
}
