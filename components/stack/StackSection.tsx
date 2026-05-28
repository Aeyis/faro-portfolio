"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION_HEIGHTS } from "@/lib/constants";
import FluidCursor from "@/components/about/FluidCursor";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";
import BottlePhysics from "@/components/stack/BottlePhysics";

const S = "/assets/stacks/";

const TECH_NAMES: Record<string, string> = {
    react:        "React",
    javascript:   "JavaScript",
    typescript:   "TypeScript",
    html5:        "HTML5",
    css3:         "CSS3",
    scss:         "SCSS",
    angular:      "Angular",
    next_js:      "Next.js",
    vite:         "Vite",
    node_js:      "Node.js",
    express:      "Express",
    nest_js:      "Nest.js",
    python:       "Python",
    php:          "PHP",
    mongodb:      "MongoDB",
    mysql:        "MySQL",
    postgresql:   "PostgreSQL",
    figma:        "Figma",
    adobe_xd:     "Adobe XD",
    illustrator:  "Illustrator",
    photoshop:    "Photoshop",
    github:       "GitHub",
    wordpress:    "WordPress",
    "3ds_max":    "3DS Max",
};

function getTechName(path: string): string {
    const key = path.split("/").pop()?.replace(".webp", "") ?? "";
    return TECH_NAMES[key] ?? key.replace(/_/g, " ");
}

const BOTTLES = [
    {
        src:    "/assets/bouteilles/bouteille1.webp",
        items:  ["react","javascript","typescript","html5","css3","scss","angular","next_js","vite"].map(n => `${S}${n}.webp`),
        left:   "15%", right: "auto", top: 650, rotate: -22,
        bl: 198, br: 354, bt: 180, bb: 492,
    },
    {
        src:    "/assets/bouteilles/bouteille2.webp",
        items:  ["node_js","express","nest_js","python","php","mongodb","mysql","postgresql"].map(n => `${S}${n}.webp`),
        left:   "auto", right: "15%", top: 1100, rotate: 18,
        bl: 198, br: 360, bt: 216, bb: 480,
    },
    {
        src:    "/assets/bouteilles/bouteille3.webp",
        items:  ["figma","adobe_xd","illustrator","photoshop"].map(n => `${S}${n}.webp`),
        left:   "18%", right: "auto", top: 1250, rotate: -28,
        bl: 186, br: 365, bt: 240, bb: 480,
    },
    {
        src:    "/assets/bouteilles/bouteille1.webp",
        items:  ["github","wordpress","3ds_max"].map(n => `${S}${n}.webp`),
        left:   "auto", right: "12%", top: 1800, rotate: 15,
        bl: 198, br: 354, bt: 192, bb: 504,
    },
];

/* ─── Modale ────────────────────────────────────────────── */

const MODAL_W      = 820;
const MODAL_H      = 580;
const BOTTLE_SCALE = 0.78;
const BOTTLE_COL_W = 360;
const BOTTLE_W     = 552;
const BOTTLE_VIS_W = Math.round(BOTTLE_W * BOTTLE_SCALE); // 430px
const S_COLS       = 4;
const S_ROWS       = 5;
const PIECE_W      = BOTTLE_VIS_W / S_COLS;
const PIECE_H      = MODAL_H      / S_ROWS;

/* clip-paths en forme d'éclats de verre — 8 points avec jitter seeded */
const SHARD_PATHS = Array.from({ length: S_COLS * S_ROWS }, (_, i) => {
    const r = (n: number) => {
        const x = Math.sin(i * 91.3 + n * 37.7) * 43758.5453;
        return x - Math.floor(x);
    };
    const j = (base: number, n: number, amp = 22) =>
        Math.max(0, Math.min(100, base + (r(n) - 0.5) * 2 * amp)).toFixed(1);
    return `polygon(${[
        `${j(0,  0, 18)}% ${j(0,   1, 18)}%`,
        `${j(40, 2, 22)}% ${j(0,   3, 14)}%`,
        `${j(100,4, 18)}% ${j(0,   5, 18)}%`,
        `${j(100,6, 14)}% ${j(45,  7, 22)}%`,
        `${j(100,8, 18)}% ${j(100, 9, 18)}%`,
        `${j(55,10, 22)}% ${j(100,11, 14)}%`,
        `${j(0, 12, 18)}% ${j(100,13, 18)}%`,
        `${j(0, 14, 14)}% ${j(50, 15, 22)}%`,
    ].join(', ')})`;
});

function BottleModal({ bottle, onClose }: {
    bottle: (typeof BOTTLES)[0];
    onClose: () => void;
}) {
    const cardRef   = useRef<HTMLDivElement>(null);
    const bottleRef = useRef<HTMLDivElement>(null);
    const pieceRefs = useRef<(HTMLDivElement | null)[]>([]);
    const iconImgRefs = useRef<(HTMLImageElement | null)[]>([]);
    const nameRefs   = useRef<(HTMLSpanElement | null)[]>([]);
    const [poured, setPoured] = useState(false);

    /* animation d'entrée de la carte */
    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(cardRef.current,
                { y: 52, opacity: 0, scale: 0.88 },
                { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.5)" }
            );
        }
    }, []);

    /* quand on touche la bouteille : bris de verre + logos qui sortent */
    useEffect(() => {
        if (!poured) return;

        /* 1 — effet sur le verre : compression + surbrillance brève */
        if (bottleRef.current) {
            const tl = gsap.timeline();
            tl.to(bottleRef.current, {
                scale:    0.97,
                filter:   "brightness(1.6) saturate(0.5)",
                duration: 0.06,
                ease:     "power1.out",
            })
            .to(bottleRef.current, {
                opacity:  0,
                filter:   "brightness(1) saturate(1)",
                duration: 0.08,
            });
        }

        /* 2 — fragments tombent avec physique réaliste */
        pieceRefs.current.forEach((piece, i) => {
            if (!piece) return;
            const row    = Math.floor(i / S_COLS);
            const startY = row * PIECE_H;
            const dist   = MODAL_H - startY + 60;            // distance jusqu'à la sortie du modal
            gsap.fromTo(piece,
                { opacity: 1, x: 0, y: 0, rotation: 0 },
                {
                    x:        (Math.random() - 0.5) * 22,
                    y:        dist,
                    rotation: (Math.random() - 0.5) * 38,
                    duration: Math.max(0.14, 0.58 * (dist / MODAL_H)) + Math.random() * 0.08,
                    ease:     "power3.in",
                    delay:    Math.random() * 0.03,
                }
            );
        });

        /* 3 — logos arrivent un par un */
        bottle.items.forEach((_, idx) => {
            const delay = 0.18 + idx * 0.09;

            const img = iconImgRefs.current[idx];
            if (img)
                gsap.fromTo(img,
                    { x: -70, opacity: 0, scale: 0.4 },
                    { x: 0, opacity: 1, scale: 1, duration: 0.42, ease: "back.out(2.2)", delay }
                );

            const name = nameRefs.current[idx];
            if (name)
                gsap.fromTo(name,
                    { y: 8, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.28, ease: "power2.out", delay: delay + 0.15 }
                );
        });
    }, [poured]);

    const handlePour = () => { if (!poured) setPoured(true); };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position:       "fixed",
                    inset:          0,
                    zIndex:         98,
                    background:     "oklch(0.03 0.04 155 / 0.90)",
                    backdropFilter: "blur(6px)",
                }}
            />

            {/* Fenêtre */}
            <div
                ref={cardRef}
                style={{
                    position:     "fixed",
                    inset:        0,
                    margin:       "auto",
                    zIndex:       99,
                    width:        MODAL_W,
                    height:       MODAL_H,
                    background:   "oklch(0.07 0.05 155 / 0.85)",
                    border:       "1px solid oklch(0.45 0.14 155 / 0.28)",
                    borderRadius: 20,
                    overflow:     "hidden",
                    boxShadow:    "0 28px 72px oklch(0 0 0 / 0.55)",
                    display:      "flex",
                }}
            >
                {/* ── Colonne gauche : bouteille cliquable ── */}
                <div
                    onClick={handlePour}
                    style={{
                        position:  "relative",
                        width:      BOTTLE_COL_W,
                        height:     MODAL_H,
                        flexShrink: 0,
                        overflow:  "hidden",
                        zIndex:    2,
                        cursor:    poured ? "default" : "pointer",
                    }}
                >
                    {/* bouteille physique */}
                    <div
                        ref={bottleRef}
                        style={{
                            transform:       `scale(${BOTTLE_SCALE})`,
                            transformOrigin: "top left",
                            position:        "absolute",
                            top:             0,
                            left:            0,
                        }}
                    >
                        <BottlePhysics
                            bottleSrc={bottle.src}
                            items={bottle.items}
                            bl={bottle.bl} br={bottle.br}
                            bt={bottle.bt} bb={bottle.bb}
                            onShake={onClose}
                            clearAll={poured}
                            disabled={poured}
                        />
                    </div>

                    {/* fragments de bris — visibles pendant l'animation */}
                    {Array.from({ length: S_COLS * S_ROWS }, (_, i) => {
                        const col = i % S_COLS;
                        const row = Math.floor(i / S_COLS);
                        return (
                            <div
                                key={i}
                                ref={el => { pieceRefs.current[i] = el; }}
                                style={{
                                    position:            "absolute",
                                    left:                col * PIECE_W,
                                    top:                 row * PIECE_H,
                                    width:               PIECE_W,
                                    height:              PIECE_H,
                                    backgroundImage:     `url(${bottle.src})`,
                                    backgroundSize:      `${BOTTLE_VIS_W}px auto`,
                                    backgroundPosition:  `${-col * PIECE_W}px ${-row * PIECE_H}px`,
                                    backgroundRepeat:    "no-repeat",
                                    clipPath:            SHARD_PATHS[i],
                                    filter:              "brightness(1.08) contrast(1.04)",
                                    opacity:             0,
                                    pointerEvents:       "none",
                                }}
                            />
                        );
                    })}

                    {/* hint */}
                    {!poured && (
                        <p style={{
                            position:      "absolute",
                            bottom:        20,
                            left:          0,
                            right:         0,
                            textAlign:     "center",
                            color:         "oklch(0.55 0.10 155)",
                            fontSize:      12,
                            fontStyle:     "italic",
                            pointerEvents: "none",
                        }}>
                            Touche la bouteille
                        </p>
                    )}
                </div>

                {/* ── Colonne droite : icônes 3×3 ── */}
                <div style={{
                    flex:                1,
                    padding:             "36px 16px 20px 16px",
                    overflowY:           "auto",
                    display:             "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridAutoRows:        "min-content",
                    gap:                 "16px 10px",
                    alignContent:        "center",
                }}>
                    {bottle.items.map((item, idx) => (
                        <div
                            key={idx}
                            style={{
                                display:       "flex",
                                flexDirection: "column",
                                alignItems:    "center",
                                gap:            7,
                            }}
                        >
                            <img
                                ref={el => { iconImgRefs.current[idx] = el; }}
                                src={item}
                                alt=""
                                width={52}
                                height={52}
                                style={{
                                    borderRadius: 10,
                                    objectFit:    "contain",
                                    opacity:      0,
                                }}
                            />
                            <span
                                ref={el => { nameRefs.current[idx] = el; }}
                                className="font-inter-tight"
                                style={{
                                    color:         "oklch(0.88 0.10 155)",
                                    fontSize:      12,
                                    fontWeight:    500,
                                    letterSpacing: "-0.02em",
                                    lineHeight:    1,
                                    textAlign:     "center",
                                    opacity:       0,
                                }}
                            >
                                {getTechName(item)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Bouton × */}
                <button
                    onClick={onClose}
                    style={{
                        position:       "absolute",
                        top:            12,
                        right:          12,
                        zIndex:         10,
                        width:          32,
                        height:         32,
                        borderRadius:   "50%",
                        background:     "rgba(255,255,255,0.09)",
                        border:         "1px solid rgba(255,255,255,0.22)",
                        color:          "white",
                        fontSize:       18,
                        lineHeight:     "1",
                        cursor:         "pointer",
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        backdropFilter: "blur(8px)",
                        transition:     "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.20)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
                >
                    ×
                </button>
            </div>
        </>
    );
}

/* ─── Section principale ─────────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

export default function StackSection() {
    const sectionRef     = useRef<HTMLElement>(null);
    const titleRef       = useRef<HTMLHeadingElement>(null);
    const floatRef       = useRef<HTMLDivElement>(null);
    const bottleRefs     = useRef<(HTMLDivElement | null)[]>([]);
    const floatInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [focusedBottle, setFocusedBottle] = useState<number | null>(null);

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
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.6,
                },
            }
        );

        gsap.to(el, {
            scale: () => window.innerWidth < 768 ? 0.55 : 0.25,
            x: () => (window.innerWidth < 768 ? 24 : 40) - el.offsetLeft,
            y: () => (window.innerWidth < 768 ? 40 : 28) - (floatRef.current?.offsetTop ?? 80),
            transformOrigin: "top left",
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=400",
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

    }, { scope: sectionRef });

    return (
        <section
            id="stack"
            ref={sectionRef}
            style={{ height: SECTION_HEIGHTS.stack, position: "relative", backgroundColor: "#000703" }}
        >
            <UnderwaterBackground variant="green" />

            <div style={{ position: "sticky", top: 0, height: "100vh", marginBottom: "-100vh", zIndex: 1 }}>
                <FluidCursor variant="green" />
            </div>

            <div style={{ position: "sticky", top: 0, height: 0, zIndex: 10, overflow: "visible", pointerEvents: "none" }}>
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
                            "--gy": "50vh",
                            backgroundImage: `radial-gradient(
                                in oklch circle at 50% var(--gy),
                                oklch(0.95 0.15 155)  0vh,
                                oklch(0.75 0.28 155)  50vh,
                                oklch(0.40 0.22 155)  90vh,
                                oklch(0.15 0.08 155 / 0) 150vh
                            )`,
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

            {BOTTLES.map((b, i) => (
                <div
                    key={i}
                    ref={el => { bottleRefs.current[i] = el; }}
                    style={{
                        position: "absolute",
                        left:     b.left,
                        right:    b.right,
                        top:      b.top,
                        zIndex:   2,
                    }}
                >
                    <div ref={el => { floatInnerRefs.current[i] = el; }}>
                        <BottlePhysics
                            bottleSrc={b.src}
                            items={b.items}
                            bl={b.bl} br={b.br}
                            bt={b.bt} bb={b.bb}
                            onShake={() => setFocusedBottle(i)}
                        />
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