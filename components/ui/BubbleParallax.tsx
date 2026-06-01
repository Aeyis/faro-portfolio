"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Bulles par couche ── */
const L0 = [
    { top: 80,  left: "8%",  size: 280, op: 0.08 },
    { top: 320, left: "75%", size: 220, op: 0.07 },
    { top: 540, left: "18%", size: 350, op: 0.06 },
    { top: 700, left: "60%", size: 200, op: 0.09 },
];
const L1 = [
    { top: 40,  left: "52%", size: 130, op: 0.14 },
    { top: 260, left: "-3%", size: 100, op: 0.16 },
    { top: 480, left: "80%", size: 160, op: 0.13 },
    { top: 150, left: "30%", size: 80,  op: 0.18 },
    { top: 620, left: "45%", size: 110, op: 0.15 },
];
const L2 = [
    { top: 100, left: "14%", size: 55, op: 0.28 },
    { top: 350, left: "85%", size: 40, op: 0.30 },
    { top: 520, left: "40%", size: 70, op: 0.25 },
    { top: 220, left: "68%", size: 45, op: 0.32 },
    { top: 680, left: "22%", size: 60, op: 0.26 },
];
const L3 = [
    { top: 60,  left: "90%", size: 20, op: 0.50 },
    { top: 200, left: "28%", size: 16, op: 0.45 },
    { top: 400, left: "55%", size: 24, op: 0.48 },
    { top: 580, left: "10%", size: 18, op: 0.42 },
    { top: 300, left: "72%", size: 22, op: 0.50 },
];

const LAYERS = [
    { bubbles: L0, speed: 0.12, z: 0 },
    { bubbles: L1, speed: 0.35, z: 1 },
    { bubbles: L2, speed: 0.62, z: 2 },
    { bubbles: L3, speed: 0.88, z: 3 },
];

/* Rayons lumineux */
const RAYS = [
    { left: "15%",  width: 80,  opacity: 0.04, delay: "0s",   dur: "8s"  },
    { left: "38%",  width: 120, opacity: 0.06, delay: "-3s",  dur: "11s" },
    { left: "62%",  width: 60,  opacity: 0.04, delay: "-6s",  dur: "9s"  },
    { left: "80%",  width: 90,  opacity: 0.05, delay: "-1.5s",dur: "13s" },
];

interface Props { sectionHeight: number; }

export default function BubbleParallax({ sectionHeight }: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const layerRefs  = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        layerRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.to(el, {
                y: -(sectionHeight * LAYERS[i].speed * 0.6),
                ease: "none",
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: "top bottom",
                    end:   "bottom top",
                    scrub: true,
                },
            });
        });
    }, { scope: wrapperRef });

    return (
        <div ref={wrapperRef} style={{ position: "relative", width: "100%", height: sectionHeight, overflow: "hidden" }}>

            {/* Fond gradient — ciel → eau profonde */}
            <div style={{
                position: "absolute", inset: 0, zIndex: 0,
                background: `linear-gradient(to bottom,
                    transparent 0%,
                    oklch(0.14 0.10 210 / 0.35) 25%,
                    oklch(0.13 0.14 215 / 0.60) 55%,
                    oklch(0.12 0.12 220 / 0.80) 100%
                )`,
            }} />

            {/* Rayons de lumière qui pénètrent l'eau */}
            {RAYS.map((r, i) => (
                <div key={i} style={{
                    position: "absolute",
                    top: 0,
                    left: r.left,
                    width: r.width,
                    height: "110%",
                    background: `linear-gradient(to bottom, oklch(0.90 0.08 190 / ${r.opacity}) 0%, transparent 70%)`,
                    transform: `skewX(${i % 2 === 0 ? -8 : 8}deg)`,
                    transformOrigin: "top center",
                    animation: `raySwing ${r.dur} ease-in-out ${r.delay} infinite alternate`,
                    zIndex: 1,
                    pointerEvents: "none",
                }} />
            ))}

            {/* Surface de l'eau — vague en haut */}
            <svg
                viewBox="0 0 1440 80"
                preserveAspectRatio="none"
                style={{ position: "absolute", top: -2, left: 0, width: "100%", height: 80, zIndex: 4 }}
            >
                <path
                    d="M0,40 C180,10 360,70 540,40 C720,10 900,70 1080,40 C1260,10 1380,60 1440,40 L1440,0 L0,0 Z"
                    fill="oklch(0.08 0.06 220)"
                    opacity="0.5"
                />
                <path
                    d="M0,50 C200,20 400,75 600,45 C800,15 1000,72 1200,48 C1320,32 1400,55 1440,50 L1440,0 L0,0 Z"
                    fill="oklch(0.06 0.04 215)"
                    opacity="0.4"
                />
            </svg>

            {/* Couches de bulles parallax */}
            {LAYERS.map(({ bubbles, z }, li) => (
                <div
                    key={li}
                    ref={el => { layerRefs.current[li] = el; }}
                    style={{ position: "absolute", inset: 0, zIndex: z + 2 }}
                >
                    {bubbles.map((b, bi) => (
                        <div
                            key={bi}
                            style={{
                                position:     "absolute",
                                top:          b.top,
                                left:         b.left,
                                width:        b.size,
                                height:       b.size,
                                borderRadius: "50%",
                                border:       `1px solid oklch(0.75 0.14 195 / ${b.op * 1.5})`,
                                background:   `radial-gradient(circle at 35% 35%, oklch(0.80 0.12 190 / ${b.op * 0.4}), oklch(0.50 0.14 210 / ${b.op}))`,
                                animation:    `bubbleFloat ${4 + (bi * 1.3) % 4}s ease-in-out ${(bi * 0.7) % 3}s infinite alternate`,
                            }}
                        />
                    ))}
                </div>
            ))}

            {/* Fondu bas vers la section about */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
                background: "linear-gradient(to bottom, transparent, oklch(0.10 0.14 215))",
                zIndex: 10, pointerEvents: "none",
            }} />

        </div>
    );
}
