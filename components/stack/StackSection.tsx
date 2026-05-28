"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION_HEIGHTS } from "@/lib/constants";
import FluidCursor from "@/components/about/FluidCursor";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";
import BottlePhysics from "@/components/stack/BottlePhysics";

const S = "/assets/stacks/";

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

gsap.registerPlugin(ScrollTrigger);

export default function StackSection() {
    const sectionRef     = useRef<HTMLElement>(null);
    const titleRef       = useRef<HTMLHeadingElement>(null);
    const floatRef       = useRef<HTMLDivElement>(null);
    const bottleRefs     = useRef<(HTMLDivElement | null)[]>([]);
    const floatInnerRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        const el = titleRef.current;
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

        // ── Float du titre ──
        gsap.to(floatRef.current, {
            y: -14,
            duration: 2.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
        });

        // ── Parallax + flottement bouteilles ──
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

            // parallax scroll (wrapper extérieur)
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
            // rotation initiale + flottement (wrapper intérieur)
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

            {/* FluidCursor derrière les bouteilles */}
            <div style={{ position: "sticky", top: 0, height: "100vh", marginBottom: "-100vh", zIndex: 1 }}>
                <FluidCursor variant="green" />
            </div>

            {/* Titre devant les bouteilles */}
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
                    {/* wrapper intérieur — rotation initiale + flottement GSAP */}
                    <div ref={el => { floatInnerRefs.current[i] = el; }}>
                        <BottlePhysics
                            bottleSrc={b.src}
                            items={b.items}
                            bl={b.bl} br={b.br}
                            bt={b.bt} bb={b.bb}
                        />
                    </div>
                </div>
            ))}
        </section>
    );
}