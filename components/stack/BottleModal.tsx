"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useLang } from "@/lib/LanguageContext";
import { T } from "@/lib/translations";
import dynamic from "next/dynamic";

const WaterBackground  = dynamic(() => import("@/components/stack/WaterBackground"),  { ssr: false, loading: () => null });
const BottlePhysics    = dynamic(() => import("@/components/stack/BottlePhysics"),    { ssr: false, loading: () => null });

/* ─── Types ─────────────────────────────────────────────── */

export type BottleData = {
    src:     string;
    label:   string;
    items:   string[];
    sticker: { src: string; top: number; left: number; width: number };
    left:    string;
    right:   string;
    top:     number;
    rotate:  number;
    bl:      number;
    br:      number;
    bt:      number;
    bb:      number;
};

/* ─── Tech names ─────────────────────────────────────────── */

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

/* ─── Modal constants ────────────────────────────────────── */

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

/* ─── Component ──────────────────────────────────────────── */

export default function BottleModal({ bottle, onClose }: {
    bottle: BottleData;
    onClose: () => void;
}) {
    const { lang } = useLang();
    const t = T[lang].stack;
    const cardRef      = useRef<HTMLDivElement>(null);
    const bottleRef    = useRef<HTMLDivElement>(null);
    const closeRef     = useRef<HTMLButtonElement>(null);
    const pieceRefs    = useRef<(HTMLDivElement | null)[]>([]);
    const iconImgRefs  = useRef<(HTMLImageElement | null)[]>([]);
    const nameRefs     = useRef<(HTMLSpanElement | null)[]>([]);
    const [isMobileModal, setIsMobileModal] = useState(false);
    const [poured, setPoured] = useState(false);

    useEffect(() => {
        const mob = window.innerWidth < 768;
        setIsMobileModal(mob);
        if (mob) setPoured(true);

        /* Force la position du bouton fermer sur mobile */
        if (mob && closeRef.current) {
            const btn = closeRef.current;
            btn.style.setProperty('top',       'auto',              'important');
            btn.style.setProperty('bottom',    '24px',              'important');
            btn.style.setProperty('right',     '50%',               'important');
            btn.style.setProperty('transform', 'translateX(50%)',   'important');
            btn.style.setProperty('width',     '60px',              'important');
            btn.style.setProperty('height',    '60px',              'important');
            btn.style.setProperty('font-size', '26px',              'important');
            btn.style.setProperty('background','oklch(0.22 0.12 155 / 0.98)', 'important');
            btn.style.setProperty('border',    '2px solid oklch(0.60 0.20 155 / 0.8)', 'important');
        }
    }, []);

    /* animation d'entrée de la carte */
    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(cardRef.current,
                { y: 52, opacity: 0, scale: 0.88 },
                { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.5)" }
            );
        }
    }, []);

    /* swipe vertical pour fermer sur mobile */
    useEffect(() => {
        if (window.innerWidth >= 768) return;
        let startY = 0;
        const onTS = (e: TouchEvent) => { startY = e.touches[0].clientY; };
        const onTE = (e: TouchEvent) => {
            const dy = Math.abs(e.changedTouches[0].clientY - startY);
            if (dy > 80) onClose();
        };
        window.addEventListener('touchstart', onTS, { passive: true });
        window.addEventListener('touchend',   onTE, { passive: true });
        return () => {
            window.removeEventListener('touchstart', onTS);
            window.removeEventListener('touchend',   onTE);
        };
    }, []);

    /* quand on touche la bouteille : bris de verre + logos qui sortent */
    useEffect(() => {
        if (!poured) return;
        void (async () => {

        /* Sur mobile : pas de bris de verre, logos apparaissent directement */
        if (window.innerWidth < 768) {
            if (bottleRef.current) bottleRef.current.style.opacity = '0';
            bottle.items.forEach((_, idx) => {
                const img  = iconImgRefs.current[idx];
                const name = nameRefs.current[idx];
                if (img)  gsap.set(img,  { opacity: 1, x: 0, scale: 1 });
                if (name) gsap.set(name, { opacity: 1, y: 0 });
            });
            return;
        }

        /* 1 — bouteille disparaît instantanément (aucun flash) */
        if (bottleRef.current) bottleRef.current.style.opacity = '0';

        /* 2 — fragments visibles */
        pieceRefs.current.forEach(p => { if (p) p.style.opacity = '1'; });

        /* 3 — physique Matter.js pour les fragments (import dynamique) */
        const Matter = await import("matter-js");
        const { Engine, Runner, Bodies, Body, World } = Matter;
        const fragEngine = Engine.create({ gravity: { x: 0, y: 2.8 } });
        const fragRunner = Runner.create();
        Runner.run(fragRunner, fragEngine);

        const fragBodies: import("matter-js").Body[] = [];
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

        /* sync CSS <-> physique */
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

        })();
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

            {/* Bouton fermer — mobile-first : bas centre, desktop override via CSS */}
            <button
                ref={closeRef}
                onClick={onClose}
                className="bottle-modal-close"
                style={{
                    position:     "fixed",
                    bottom:       24,
                    left:         "50%",
                    transform:    "translateX(-50%)",
                    zIndex:       101,
                    width:        60,
                    height:       60,
                    borderRadius: "50%",
                    background:   "oklch(0.22 0.12 155 / 0.98)",
                    border:       "2px solid oklch(0.60 0.20 155 / 0.8)",
                    boxShadow:    "0 4px 24px oklch(0 0 0 / 0.4)",
                    color:        "oklch(0.90 0.18 155)",
                    fontSize:     26,
                    lineHeight:   1,
                    display:      "flex", alignItems: "center", justifyContent: "center",
                    cursor:       "pointer", transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.30 0.14 155 / 0.98)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isMobileModal ? "oklch(0.22 0.12 155 / 0.98)" : "oklch(0.12 0.06 155 / 0.8)"; (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.90 0.18 155)"; }}
            >
                &#x2715;
            </button>

            {/* Fenetre */}
            <div
                ref={cardRef}
                className="bottle-modal-card"
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

                {/* Titre theme */}
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

                {/* Colonne gauche : bouteille cliquable */}
                <div
                    onClick={handlePour}
                    className="bottle-modal-left"
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

                {/* Colonne droite */}
                <div className="bottle-modal-right" style={{
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

                {/* Bouton x */}
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
                    &times;
                </button>
            </div>
        </>
    );
}
