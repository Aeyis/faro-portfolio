"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useAboutParallax } from "@/hooks/useAboutParallax";
import { SECTION_HEIGHTS } from "@/lib/constants";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";

gsap.registerPlugin(ScrollTrigger);

const BIO =
    "Je suis Rafael Solis Ramos, développeur fullstack en formation. " +
    "J'aime créer des interfaces qui ont quelque chose à dire — " +
    "là où le code et le design se confondent. " +
    "Curieux de tout, perfectionniste sur les détails.";

export default function AboutSection() {
    const { sectionRef } = useAboutParallax();
    const titleRef = useRef<HTMLHeadingElement>(null);
    const floatRef = useRef<HTMLDivElement>(null);
    const bioRef   = useRef<HTMLParagraphElement>(null);

    useGSAP(() => {
        const el  = titleRef.current;
        const bio = bioRef.current;
        if (!el || !bio) return;

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
                onLeave:     () => window.dispatchEvent(new Event("about-stuck")),
                onEnterBack: () => window.dispatchEvent(new Event("about-unstuck")),
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

        // ── Reveal bio lettre par lettre ──
        const split = new SplitType(bio, { types: "chars,words" });

        gsap.from(split.chars, {
            opacity: 0,
            y: 20,
            ease: "power2.out",
            stagger: 0.35,
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top+=420 top",
                end: () => `+=${window.innerHeight * 3.5}`,
                scrub: true,
            },
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

                {/* Bio reveal */}
                <p
                    ref={bioRef}
                    className="about-bio font-fraunces"
                    style={{ userSelect: "none" }}
                >
                    {BIO}
                </p>
            </div>
        </section>
    );
}