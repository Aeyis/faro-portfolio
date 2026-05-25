"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionTitleProps {
    sectionRef: React.RefObject<HTMLElement | null>;
    hue: number;
    eventPrefix?: string;
    children: React.ReactNode;
}

export default function SectionTitle({ sectionRef, hue, eventPrefix, children }: SectionTitleProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const titleRef   = useRef<HTMLHeadingElement>(null);
    const floatRef   = useRef<HTMLDivElement>(null);

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
                onLeave:     () => eventPrefix && window.dispatchEvent(new Event(`${eventPrefix}-stuck`)),
                onEnterBack: () => eventPrefix && window.dispatchEvent(new Event(`${eventPrefix}-unstuck`)),
            },
        });

        gsap.to(floatRef.current, {
            y: -14,
            duration: 2.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
        });

    }, { scope: wrapperRef });

    return (
        <div ref={wrapperRef}>
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
                        oklch(0.95 0.12 ${hue})      0vh,
                        oklch(0.75 0.25 ${hue + 20}) 50vh,
                        oklch(0.40 0.20 ${hue + 60}) 90vh,
                        oklch(0.15 0.08 ${hue + 40} / 0) 150vh
                    )`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    filter: `drop-shadow(0 0 30px oklch(0.7 0.25 ${hue + 20} / 0.15))`,
                } as React.CSSProperties}
            >
                {children}
            </h2>
        </div>
        </div>
    );
}