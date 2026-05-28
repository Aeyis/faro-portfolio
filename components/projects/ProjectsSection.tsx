"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION_HEIGHTS } from "@/lib/constants";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";
import FluidCursor from "@/components/about/FluidCursor";

gsap.registerPlugin(ScrollTrigger);

const BG = "oklch(0.06 0.07 280)";

export default function ProjectsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef   = useRef<HTMLHeadingElement>(null);
    const floatRef   = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const el = titleRef.current;
        if (!el) return;

        // gradient parallax sur le titre
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

        // titre → coin haut-gauche
        gsap.to(el, {
            scale:           () => window.innerWidth < 768 ? 0.55 : 0.25,
            x:               () => (window.innerWidth < 768 ? 24 : 40) - el.offsetLeft,
            y:               () => (window.innerWidth < 768 ? 40 : 28) - (floatRef.current?.offsetTop ?? 80),
            transformOrigin: "top left",
            ease:            "none",
            scrollTrigger: {
                trigger:            sectionRef.current,
                start:              "top top",
                end:                "+=400",
                scrub:              0.4,
                invalidateOnRefresh: true,
            },
        });

        // flottement du titre
        gsap.to(floatRef.current, {
            y:        -14,
            duration: 2.8,
            ease:     "sine.inOut",
            repeat:   -1,
            yoyo:     true,
        });

    }, { scope: sectionRef });

    return (
        <section
            id="projets"
            ref={sectionRef}
            style={{ height: SECTION_HEIGHTS.projects, position: "relative", backgroundColor: BG }}
        >
            <UnderwaterBackground variant="violet" />

            {/* FluidCursor violet */}
            <div style={{ position: "sticky", top: 0, height: "100vh", marginBottom: "-100vh", zIndex: 1 }}>
                <FluidCursor variant="violet" />
            </div>

            {/* dégradé de transition depuis la section précédente */}
            <div
                style={{
                    position:      "absolute",
                    top:           0,
                    left:          0,
                    right:         0,
                    height:        "28vh",
                    background:    "linear-gradient(to bottom, #000703 0%, transparent 100%)",
                    pointerEvents: "none",
                    zIndex:        2,
                }}
            />

            {/* halo violet en haut */}
            <div
                style={{
                    position:      "absolute",
                    top:           0,
                    left:          0,
                    right:         0,
                    height:        "50vh",
                    background:    "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.22 0.20 285 / 0.45) 0%, transparent 100%)",
                    pointerEvents: "none",
                    zIndex:        1,
                }}
            />

            {/* titre flottant sticky */}
            <div style={{ position: "sticky", top: 0, height: "100vh", zIndex: 10, pointerEvents: "none" }}>
                <div ref={floatRef} style={{ position: "absolute", top: "80px", left: "40px", right: "40px" }}>
                    <h2
                        ref={titleRef}
                        className="font-inter-tight about-title"
                        style={{
                            fontWeight:     900,
                            letterSpacing:  "-0.05em",
                            lineHeight:     0.9,
                            margin:         0,
                            paddingBottom:  "0.15em",
                            userSelect:     "none",
                            "--gy":         "50vh",
                            backgroundImage: `radial-gradient(
                                in oklch circle at 50% var(--gy),
                                oklch(0.95 0.10 295)  0vh,
                                oklch(0.75 0.24 285)  50vh,
                                oklch(0.40 0.20 275)  90vh,
                                oklch(0.15 0.08 270 / 0) 150vh
                            )`,
                            backgroundClip:       "text",
                            WebkitBackgroundClip: "text",
                            color:                "transparent",
                            filter:               "drop-shadow(0 0 30px oklch(0.7 0.24 285 / 0.18))",
                        } as React.CSSProperties}
                    >
                        Projets
                    </h2>
                </div>
            </div>
        </section>
    );
}