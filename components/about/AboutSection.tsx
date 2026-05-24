"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAboutParallax } from "@/hooks/useAboutParallax";
import { SECTION_HEIGHTS } from "@/lib/constants";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
    const { sectionRef } = useAboutParallax();
    const titleRef = useRef<HTMLHeadingElement>(null);
    const floatRef = useRef<HTMLDivElement>(null);

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
            scale: 0.25,
            x: () =>  16 - el.offsetLeft,
            y: () => 16 - (floatRef.current?.offsetTop ?? 80),
            transformOrigin: "top left",
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=400",
                scrub: 0.4,
                invalidateOnRefresh: true,
            },
        });

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
            id="about"
            ref={sectionRef}
            style={{ height: SECTION_HEIGHTS.about, position: "relative" }}
        >
            <UnderwaterBackground />
            <div className="about-sticky" style={{ position: "sticky", top: 0, height: "100vh", padding: "80px 40px" }}>
            <div ref={floatRef}>
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
                À propos
            </h2>
            </div>
            </div>
        </section>
    );
}