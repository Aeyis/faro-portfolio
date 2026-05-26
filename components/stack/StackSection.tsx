"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION_HEIGHTS } from "@/lib/constants";
import FluidCursor from "@/components/about/FluidCursor";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";

gsap.registerPlugin(ScrollTrigger);

export default function StackSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef   = useRef<HTMLHeadingElement>(null);
    const floatRef   = useRef<HTMLDivElement>(null);

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

    }, { scope: sectionRef });

    return (
        <section
            id="stack"
            ref={sectionRef}
            style={{ height: SECTION_HEIGHTS.stack, position: "relative", backgroundColor: "#000703" }}
        >
            <UnderwaterBackground variant="green" />
            <div style={{ position: "sticky", top: 0, height: "100vh", padding: "80px 40px" }}>
                <FluidCursor variant="green" />
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
        </section>
    );
}