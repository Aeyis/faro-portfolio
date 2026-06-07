"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION_HEIGHTS, SECTION_HEIGHTS_MOBILE } from "@/lib/constants";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLang } from "@/lib/LanguageContext";
import { T } from "@/lib/translations";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";
import dynamic from "next/dynamic";
import BottleModal from "@/components/stack/BottleModal";

/* Lazy-load Three.js et Matter.js — non nécessaires au premier rendu */
const BottlePhysics = dynamic(() => import("@/components/stack/BottlePhysics"), { ssr: false, loading: () => null });

const S = "/assets/stacks/";

const BOTTLES = [
    {
        src:    "/assets/bouteilles/bouteille1.webp",
        label:  "Frontend",
        items:  ["react","javascript","typescript","html5","css3","scss","angular","next_js","vite"].map(n => `${S}${n}.webp`),
        sticker: { src: "/assets/stickers/frontendStick.webp", top: 200, left: 195, width: 165 },
        left:   "15%", right: "auto", top: 650, rotate: -22,
        bl: 198, br: 354, bt: 180, bb: 492,
    },
    {
        src:    "/assets/bouteilles/bouteille2.webp",
        label:  "Backend",
        items:  ["node_js","express","nest_js","python","php","mongodb","mysql","postgresql"].map(n => `${S}${n}.webp`),
        sticker: { src: "/assets/stickers/backendSticker.webp", top: 230, left: 195, width: 165 },
        left:   "auto", right: "15%", top: 1100, rotate: 18,
        bl: 198, br: 345, bt: 250, bb: 470,
    },
    {
        src:    "/assets/bouteilles/bouteille3.webp",
        label:  "UI / UX",
        items:  ["figma","adobe_xd","illustrator","photoshop"].map(n => `${S}${n}.webp`),
        sticker: { src: "/assets/stickers/uiuxSticker.webp", top: 250, left: 199, width: 165 },
        left:   "18%", right: "auto", top: 900, rotate: -28,
        bl: 186, br: 365, bt: 240, bb: 480,
    },
    {
        src:    "/assets/bouteilles/bouteille1.webp",
        label:  "Autres",
        items:  ["github","wordpress","3ds_max"].map(n => `${S}${n}.webp`),
        sticker: { src: "/assets/stickers/other.webp", top: 200, left: 195, width: 165 },
        left:   "auto", right: "12%", top: 1700, rotate: 15,
        bl: 198, br: 354, bt: 192, bb: 504,
    },
];

/* ─── Section principale ─────────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

export default function StackSection() {
    const { lang } = useLang();
    const t = T[lang].stack;
    const isMobile = useIsMobile();
    const sectionRef     = useRef<HTMLElement>(null);
    const titleRef       = useRef<HTMLHeadingElement>(null);
    const floatRef       = useRef<HTMLDivElement>(null);
    const bottleRefs     = useRef<(HTMLDivElement | null)[]>([]);
    const floatInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [focusedBottle, setFocusedBottle] = useState<number | null>(null);
    const [physicsReady,  setPhysicsReady]  = useState(false);
    const [gsapReady,     setGsapReady]     = useState(false);

    useEffect(() => {
        if (focusedBottle !== null) {
            document.body.classList.add("bottle-modal-open");
        } else {
            document.body.classList.remove("bottle-modal-open");
        }
        return () => document.body.classList.remove("bottle-modal-open");
    }, [focusedBottle]);

    /* Observer unique — déclenche GSAP et Matter.js quand la section
       est à 800px du viewport (assez tôt pour être prêts avant le scroll). */
    useEffect(() => {
        if (!sectionRef.current) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setPhysicsReady(true);
                    setGsapReady(true);
                    obs.disconnect();
                }
            },
            { rootMargin: "800px" }
        );
        obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    useGSAP(() => {
        if (!gsapReady) return;
        const el = titleRef.current;
        if (!el) return;


        if (window.innerWidth < 768) gsap.set(el, { transformOrigin: "top center" });
        const isMob = window.innerWidth < 768;
        gsap.to(el, {
            scale: () => window.innerWidth < 768 ? 0.65 : 0.40,
            x: () => window.innerWidth < 768 ? 0 : 40 - el.offsetLeft,
            y: () => (window.innerWidth < 768 ? 40 : 28) - (floatRef.current?.offsetTop ?? 80),
            transformOrigin: window.innerWidth < 768 ? "top center" : "top left",
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: isMob ? "top+=300 top" : "top top",
                end:   isMob ? "+=800" : "+=800",
                scrub: 0.4,
                invalidateOnRefresh: true,
                onLeave:     () => window.dispatchEvent(new Event("stack-stuck")),
                onEnterBack: () => window.dispatchEvent(new Event("stack-unstuck")),
            },
        });

        gsap.to(floatRef.current, {
            y: -14,
            duration: 2.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
        });

        const params = [
            { yFrom: 420, yTo:  -60, xFrom:  0,  xTo:  0,  scrub: 0.3, yAmp: 18, rAmp:  2.5, dur: 3.4, delay: 0   },
            { yFrom: 120, yTo: -180, xFrom: 18,  xTo: -18, scrub: 2.8, yAmp: 22, rAmp: -2.0, dur: 4.1, delay: 0.8 },
            { yFrom: 600, yTo:  -40, xFrom: -12, xTo: 12,  scrub: 0.6, yAmp: 16, rAmp:  3.0, dur: 3.8, delay: 1.5 },
            { yFrom:  80, yTo: -300, xFrom:  0,  xTo:  0,  scrub: 4.0, yAmp: 20, rAmp: -2.5, dur: 4.5, delay: 0.4 },
        ];

        bottleRefs.current.forEach((bottle, i) => {
            if (!bottle) return;
            const p       = params[i];
            const floatEl = floatInnerRefs.current[i];

            gsap.fromTo(bottle,
                { y: p.yFrom, x: p.xFrom },
                {
                    y: p.yTo,
                    x: p.xTo,
                    ease: "none",
                    scrollTrigger: {
                        trigger: bottle,
                        start: "top 105%",
                        end: "bottom -15%",
                        scrub: p.scrub,
                    },
                }
            );

            if (!floatEl) return;
            gsap.set(floatEl, { rotation: BOTTLES[i].rotate });
            gsap.to(floatEl, {
                y: p.yAmp,
                duration: p.dur,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                delay: p.delay,
            });
            gsap.to(floatEl, {
                rotation: `+=${p.rAmp}`,
                duration: p.dur * 1.3,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                delay: p.delay + 0.3,
            });
        });

    }, { scope: sectionRef, dependencies: [gsapReady] });

    return (
        <section
            id="stack"
            ref={sectionRef}
            style={{ height: isMobile ? SECTION_HEIGHTS_MOBILE.stack : SECTION_HEIGHTS.stack, position: "relative", backgroundColor: "#000703" }}
        >
            <UnderwaterBackground variant="green" />


            <div style={{ position: "sticky", top: 0, height: "100vh", zIndex: 10, pointerEvents: "none" }}>
                <div ref={floatRef} style={{ position: "absolute", top: "80px", left: "40px", right: "40px" }}>
                    <h2
                        ref={titleRef}
                        className="font-inter-tight about-title"
                        style={{
                            fontWeight: 900,
                            letterSpacing: "-0.05em",
                            lineHeight: 0.9,
                            margin: 0,
                            userSelect: "none",
                            backgroundImage: "radial-gradient(in oklch circle at 50% 50%, oklch(0.95 0.15 155) 0%, oklch(0.75 0.28 155) 50%, oklch(0.40 0.22 155) 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            filter: "drop-shadow(0 0 30px oklch(0.7 0.28 155 / 0.15))",
                        } as React.CSSProperties}
                    >
                        Stacks
                    </h2>
                </div>
            </div>


            <div className="stack-shake-block" style={{
                position: "absolute", top: 1500, left: "50%", transform: "translateX(-50%)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                zIndex: 3, pointerEvents: "none",
            }}>
                <span className="stack-shake-hint" style={{ fontSize: 48 }}>🫙</span>
                <span className="font-inter-tight" style={{
                    fontSize: 22, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase",
                    backgroundImage: "radial-gradient(in oklch circle at 50% 50%, oklch(0.95 0.15 155) 0%, oklch(0.75 0.28 155) 50%, oklch(0.40 0.22 155) 100%)",
                    backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
                    filter: "drop-shadow(0 0 18px oklch(0.7 0.28 155 / 0.35))",
                }}>{t.shake}</span>
            </div>

            {/* Hint mobile — visible uniquement sur mobile */}
            <div className="stack-touch-block" style={{
                position: "absolute", top: 400, left: "50%", transform: "translateX(-50%)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                zIndex: 3, pointerEvents: "none",
            }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/assets/bouteilles/bouteille1.webp"
                    alt=""
                    style={{ width: 60, height: 90, objectFit: "contain",
                        filter: "drop-shadow(0 0 14px oklch(0.7 0.28 155 / 0.5))",
                        animation: "bubbleFloat 2s ease-in-out infinite alternate",
                    }}
                />
                <span className="font-inter-tight" style={{
                    fontSize: 18, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase",
                    backgroundImage: "radial-gradient(in oklch circle at 50% 50%, oklch(0.95 0.15 155) 0%, oklch(0.75 0.28 155) 50%, oklch(0.40 0.22 155) 100%)",
                    backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
                    filter: "drop-shadow(0 0 14px oklch(0.7 0.28 155 / 0.35))",
                }}>{t.touch}</span>
            </div>

            {BOTTLES.map((b, i) => (
                <div
                    key={i}
                    ref={el => { bottleRefs.current[i] = el; }}
                    className={`bottle-wrap bottle-wrap-${i}`}
                    style={{
                        position: "absolute",
                        left:     b.left,
                        right:    b.right,
                        top:      b.top,
                        zIndex:   2,
                    }}
                >
                    <div
                        ref={el => { floatInnerRefs.current[i] = el; }}
                        style={{ position: "relative" }}
                    >
                        {/* pointer-events: none sur mobile seulement sur BottlePhysics */}
                        <div style={isMobile ? { pointerEvents: "none" } : undefined}>
                            {physicsReady && (
                                <BottlePhysics
                                    bottleSrc={b.src}
                                    items={b.items}
                                    bl={b.bl} br={b.br}
                                    bt={b.bt} bb={b.bb}
                                    onShake={() => setFocusedBottle(i)}
                                    sticker={"sticker" in b ? b.sticker : undefined}
                                    itemRadius={b.items.length <= 3 ? 30 : 20}
                                />
                            )}
                        </div>

                        {/* Overlay dans floatInnerRefs → suit l'animation float */}
                        {isMobile && (
                            <div
                                onClick={() => setFocusedBottle(i)}
                                style={{
                                    position: "absolute",
                                    top:      b.bt,
                                    left:     b.bl,
                                    width:    b.br - b.bl,
                                    height:   b.bb - b.bt,
                                    zIndex:   10,
                                    cursor:   "pointer",
                                }}
                            />
                        )}
                    </div>
                </div>
            ))}

            {focusedBottle !== null && (
                <BottleModal
                    bottle={BOTTLES[focusedBottle]}
                    onClose={() => setFocusedBottle(null)}
                />
            )}
        </section>
    );
}
