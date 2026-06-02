"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION_HEIGHTS } from "@/lib/constants";
import { useLang } from "@/lib/LanguageContext";
import { T } from "@/lib/translations";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";
import Matter from "matter-js";
import BottlePhysics, { getLogoFilter } from "@/components/stack/BottlePhysics";
import WaterBackground from "@/components/stack/WaterBackground";

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

/* ─── Modale ────────────────────────────────────────────── */

const MODAL_W      = 980;
const MODAL_H      = 660;
const BOTTLE_SCALE = 0.92;
const BOTTLE_COL_W = 360;
const BOTTLE_W     = 552;
const BOTTLE_VIS_W = Math.round(BOTTLE_W * BOTTLE_SCALE); // 430px
const S_COLS       = 4;
const S_ROWS       = 5;
const PIECE_W      = BOTTLE_VIS_W / S_COLS;
const PIECE_H      = MODAL_H      / S_ROWS;

/* éclats de verre */
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

        /* 1 — bouteille disparaît instantanément (aucun flash) */
        if (bottleRef.current) bottleRef.current.style.opacity = '0';

        /* 2 — fragments visibles */
        pieceRefs.current.forEach(p => { if (p) p.style.opacity = '1'; });

        /* 3 — physique Matter.js pour les fragments */
        const { Engine, Runner, Bodies, Body, World } = Matter;
        const fragEngine = Engine.create({ gravity: { x: 0, y: 2.8 } });
        const fragRunner = Runner.create();
        Runner.run(fragRunner, fragEngine);

        const fragBodies: Matter.Body[] = [];
        pieceRefs.current.forEach((_, i) => {
            const col = i % S_COLS;
            const row = Math.floor(i / S_COLS);
            const b   = Bodies.rectangle(
                col * PIECE_W + PIECE_W / 2,
                row * PIECE_H + PIECE_H / 2,
                PIECE_W * 0.85,
                PIECE_H * 0.85,
                { frictionAir: 0.012, restitution: 0.15, collisionFilter: { mask: 0 } }
            );
            Body.setVelocity(b, { x: (Math.random() - 0.5) * 14, y: -2 - Math.random() * 7 });
            Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.5);
            fragBodies.push(b);
        });
        World.add(fragEngine.world, fragBodies);

        /* sync CSS ↔ physique */
        let rafId: number;
        const sync = () => {
            let active = false;
            fragBodies.forEach((body, i) => {
                const piece = pieceRefs.current[i];
                if (!piece) return;
                piece.style.left      = `${body.position.x - PIECE_W / 2}px`;
                piece.style.top       = `${body.position.y - PIECE_H / 2}px`;
                piece.style.transform = `rotate(${body.angle}rad)`;
                if (body.position.y < MODAL_H + PIECE_H * 2) active = true;
            });
            if (active) {
                rafId = requestAnimationFrame(sync);
            } else {
                Runner.stop(fragRunner);
                Engine.clear(fragEngine);
            }
        };
        rafId = requestAnimationFrame(sync);

        /* 4 — logos arrivent un par un */
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

        return () => {
            cancelAnimationFrame(rafId);
            Runner.stop(fragRunner);
            Engine.clear(fragEngine);
        };
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
                    cursor:         `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='26' font-size='24'>🔨</text></svg>") 4 26, auto`,
                }}
            />

            {/* Bouton fermer */}
            <button
                onClick={onClose}
                style={{
                    position: "fixed",
                    top: `calc(50vh - ${MODAL_H / 2}px + 64px)`,
                    right: `calc(50vw - ${MODAL_W / 2}px + 16px)`,
                    zIndex: 101,
                    width: 36, height: 36, borderRadius: "50%",
                    background: "oklch(0.12 0.06 155 / 0.8)",
                    border: "1px solid oklch(0.45 0.14 155 / 0.4)",
                    color: "oklch(0.75 0.18 155)", fontSize: 18, lineHeight: 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.20 0.10 155 / 0.9)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.12 0.06 155 / 0.8)"; (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.75 0.18 155)"; }}
            >
                ✕
            </button>

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
                    background:   "oklch(0.05 0.04 155 / 0.45)",
                    border:       "1px solid oklch(0.45 0.14 155 / 0.28)",
                    borderRadius: 20,
                    overflow:     "hidden",
                    boxShadow:    "0 28px 72px oklch(0 0 0 / 0.55)",
                    cursor:       `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='26' font-size='24'>🔨</text></svg>") 4 26, auto`,
                    display:      "flex",
                }}
            >
                <WaterBackground width={MODAL_W} height={MODAL_H} />

                {/* fragments de bris — au niveau du modal pour passer devant tout */}
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
                                zIndex:              20,
                                pointerEvents:       "none",
                            }}
                        />
                    );
                })}

                {/* ── Titre thème ── */}
                <h3
                    className="font-inter-tight"
                    style={{
                        position:      "absolute",
                        top:           60,
                        left:          0,
                        right:         0,
                        textAlign:     "center",
                        margin:        0,
                        fontSize:      50,
                        fontWeight:    900,
                        letterSpacing: "-0.04em",
                        color:         "oklch(0.88 0.10 155)",
                        zIndex:        5,
                        pointerEvents: "none",
                        userSelect:    "none",
                    }}
                >
                    {bottle.label}
                </h3>

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
                            top:             60,
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
                            cursorOverride={`url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='26' font-size='24'>🔨</text></svg>") 4 26, auto`}
                        />
                    </div>


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
                            {t.touchBottle}
                        </p>
                    )}
                </div>

                {/* ── Colonne droite ── */}
                <div style={{
                    flex:                1,
                    position:            "relative",
                    zIndex:              1,
                    padding:             "36px 16px 20px 16px",
                    overflowY:           "auto",
                    display:             "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridAutoRows:        "min-content",
                    gap:                 "16px 10px",
                    alignContent:        "center",
                }}>
                    {!poured && (
                        <div style={{
                            gridColumn: "1 / -1",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            pointerEvents: "none",
                        }}>
                            <span className="font-fraunces" style={{
                                fontStyle: "italic", fontWeight: 300,
                                fontSize: 22, color: "oklch(0.55 0.14 155 / 0.7)",
                                textAlign: "center", lineHeight: 1.4,
                            }}>
                                {t.breakIce}
                            </span>
                        </div>
                    )}
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
                            <div style={{
                                width:      bottle.items.length <= 3 ? 88 : 56,
                                height:     bottle.items.length <= 3 ? 88 : 56,
                                flexShrink: 0,
                                overflow:   "hidden",
                                borderRadius: 10,
                                display:    "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <img
                                    ref={el => { iconImgRefs.current[idx] = el; }}
                                    src={item}
                                    alt=""
                                    style={{
                                        maxWidth:  "100%",
                                        maxHeight: "100%",
                                        objectFit: "contain",
                                        display:   "block",
                                        opacity:   0,
                                    }}
                                />
                            </div>
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
    const { lang } = useLang();
    const t = T[lang].stack;
    const sectionRef     = useRef<HTMLElement>(null);
    const titleRef       = useRef<HTMLHeadingElement>(null);
    const floatRef       = useRef<HTMLDivElement>(null);
    const bottleRefs     = useRef<(HTMLDivElement | null)[]>([]);
    const floatInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [focusedBottle, setFocusedBottle] = useState<number | null>(null);

    useEffect(() => {
        if (focusedBottle !== null) {
            document.body.classList.add("bottle-modal-open");
        } else {
            document.body.classList.remove("bottle-modal-open");
        }
        return () => document.body.classList.remove("bottle-modal-open");
    }, [focusedBottle]);

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
            scale: () => window.innerWidth < 768 ? 0.55 : 0.40,
            x: () => (window.innerWidth < 768 ? 24 : 40) - el.offsetLeft,
            y: () => (window.innerWidth < 768 ? 40 : 28) - (floatRef.current?.offsetTop ?? 80),
            transformOrigin: "top left",
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=800",
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

            <div style={{
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
                            sticker={"sticker" in b ? b.sticker : undefined}
                            itemRadius={b.items.length <= 3 ? 30 : 20}
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