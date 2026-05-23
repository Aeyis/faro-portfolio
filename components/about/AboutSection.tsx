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

    useGSAP(() => {
        const el = titleRef.current;
        if (!el) return;

        gsap.fromTo(el,
            { "--gy": "140vh" },
            {
                "--gy": "-40vh",
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.6,
                },
            }
        );

        gsap.to(el, {
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
            style={{ height: SECTION_HEIGHTS.about, padding: "80px 40px", position: "relative" }}
        >
            <UnderwaterBackground />
            <h2
                ref={titleRef}
                className="font-inter-tight about-title"
                style={{
                    fontSize: "clamp(72px, 16vw, 260px)",
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
        </section>
    );
}