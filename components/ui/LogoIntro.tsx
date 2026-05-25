"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import LogoFaro from "./LogoFaro";
import { SECTION_HEIGHTS } from "@/lib/constants";

export default function LogoIntro() {
    const containerRef        = useRef<HTMLDivElement>(null);
    const bylineRef           = useRef<HTMLParagraphElement>(null);
    const logoWrapperRef      = useRef<HTMLDivElement>(null);
    const hamburgerOverlayRef = useRef<HTMLDivElement>(null);
    const hoverZoneRef        = useRef<HTMLDivElement>(null);
    const hamBtnRef           = useRef<SVGSVGElement>(null);
    const sectionModeRef = useRef<string | null>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        gsap.set(el, { xPercent: -50 });

        const trigger = () => {
            const byline = bylineRef.current;
            const rect   = el.getBoundingClientRect();

            const currentCenterX = rect.left + rect.width  / 2;
            const currentCenterY = rect.top  + rect.height / 2;

            const targetScale   = 0.34;
            const visualSize    = 600 * targetScale;
            const targetCenterX = window.innerWidth + 10 - visualSize / 2;
            const targetCenterY = -68 + visualSize / 2;

            gsap.to(el, {
                x:        targetCenterX - currentCenterX,
                y:        targetCenterY - currentCenterY,
                scale:    targetScale,
                duration: 1.2,
                ease:     "power3.inOut",
                onComplete: () => {
                    const hz = hoverZoneRef.current;
                    if (!hz) return;

                    const ham = hamBtnRef.current;

                    const hamSize = 47;
                    hz.style.width  = `${visualSize}px`;
                    hz.style.height = `${visualSize}px`;
                    hz.style.top    = `${targetCenterY - visualSize / 2}px`;
                    hz.style.left   = `${targetCenterX - visualSize / 2}px`;
                    if (ham) {
                        ham.style.top  = `${targetCenterY - hamSize / 2 + 40}px`;
                        ham.style.left = `${targetCenterX - hamSize / 2}px`;
                    }

                    // ── Section courante via getBoundingClientRect ──
                    const updateSection = () => {
                        const mid = window.innerHeight / 2;
                        const stackRect = document.getElementById("stack")?.getBoundingClientRect();
                        const aboutRect = document.getElementById("about")?.getBoundingClientRect();

                        if (stackRect && stackRect.top <= mid && stackRect.bottom >= 0) {
                            sectionModeRef.current = "stack";
                            ham?.style.setProperty("--ham-color", "#021a06");
                        } else if (aboutRect && aboutRect.top <= mid && aboutRect.bottom >= 0) {
                            sectionModeRef.current = "about";
                            ham?.style.setProperty("--ham-color", "#020818");
                        } else {
                            sectionModeRef.current = null;
                            ham?.style.removeProperty("--ham-color");
                        }
                    };

                    const baseFilter = () => {
                        if (sectionModeRef.current === "about") return "hue-rotate(160deg) saturate(1.5) brightness(1.1)";
                        if (sectionModeRef.current === "stack") return "hue-rotate(100deg) saturate(3.5) brightness(1.0)";
                        return "drop-shadow(0 0 0px rgba(255,184,48,0))";
                    };
                    const hoverFilter = () => {
                        if (sectionModeRef.current === "about") return "hue-rotate(160deg) saturate(1.5) brightness(1.3) drop-shadow(0 0 28px rgba(80,200,255,0.35))";
                        if (sectionModeRef.current === "stack") return "hue-rotate(100deg) saturate(3.5) brightness(1.2) drop-shadow(0 0 28px rgba(60,220,120,0.35))";
                        return "drop-shadow(0 0 28px rgba(255,184,48,0.25))";
                    };

                    hz.addEventListener("mouseenter", () => {
                        updateSection();
                        gsap.to(el, { scale: targetScale * 1.08, filter: hoverFilter(), duration: 0.4, ease: "power2.out" });
                        gsap.to(logoWrapperRef.current,      { opacity: 0, duration: 0.35, ease: "power2.inOut" });
                        gsap.to(hamburgerOverlayRef.current, { opacity: 1, duration: 0.35, ease: "power2.inOut" });
                        gsap.to(ham,                         { opacity: 1, duration: 0.35, ease: "power2.out"   });
                    });

                    hz.addEventListener("mouseleave", () => {
                        gsap.to(el, { scale: targetScale, filter: baseFilter(), duration: 0.5, ease: "power2.inOut" });
                        gsap.to(ham,                         { opacity: 0, duration: 0.3 });
                        gsap.to(hamburgerOverlayRef.current, { opacity: 0, duration: 0.4, ease: "power2.inOut" });
                        gsap.to(logoWrapperRef.current,      { opacity: 1, duration: 0.4, ease: "power2.inOut" });
                    });

                    // ── Show/hide selon direction de scroll ──
                    const onWheel = (e: WheelEvent) => {
                        updateSection();
                        if (e.deltaY > 0) {
                            gsap.to(el, { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" });
                            if (hz) hz.style.pointerEvents = "none";
                            if (ham) gsap.to(ham, { opacity: 0, duration: 0.3 });
                        } else if (e.deltaY < 0) {
                            gsap.set(el, { filter: baseFilter() });
                            gsap.to(el, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
                            if (hz) hz.style.pointerEvents = "all";
                        }
                    };
                    window.addEventListener("wheel", onWheel, { passive: true });
                },
            });

            if (byline) {
                byline.style.animation = "none";
                byline.style.opacity   = getComputedStyle(byline).opacity;
                gsap.to(byline, { opacity: 0, duration: 0.4 });
            }

            window.dispatchEvent(new Event("intro-done"));
        };

        const onMenuClose = () => hamBtnRef.current?.classList.remove("active");
        window.addEventListener("menu-close", onMenuClose);

        window.addEventListener("click",      trigger, { once: true });
        window.addEventListener("touchstart", trigger, { once: true });

        return () => {
            window.removeEventListener("click",      trigger);
            window.removeEventListener("touchstart", trigger);
            window.removeEventListener("menu-close", onMenuClose);
        };
    }, []);

    return (
        <>
        <div
            ref={containerRef}
            style={{
                position:      "fixed",
                top:           -80,
                left:          "50%",
                zIndex:        100,
                pointerEvents: "none",
            }}
        >
            <div ref={logoWrapperRef}>
                <LogoFaro size={600} />
            </div>

            <div
                ref={hamburgerOverlayRef}
                style={{
                    position:      "absolute",
                    top:           0,
                    left:          0,
                    width:         600,
                    height:        600,
                    opacity:       0,
                    pointerEvents: "none",
                }}
            >
                <Image
                    src="/assets/hero/LOGO_Faro_hamburger.svg"
                    alt="menu"
                    fill
                    style={{ objectFit: "contain" }}
                />
            </div>

            <p
                ref={bylineRef}
                style={{
                    textAlign:            "center",
                    fontSize:             "11px",
                    letterSpacing:        "0.14em",
                    fontFamily:           "var(--font-syne)",
                    fontWeight:           400,
                    backgroundImage:      "linear-gradient(135deg, #fff8e0 0%, #ffb830 40%, #c43a08 100%)",
                    backgroundClip:       "text",
                    WebkitBackgroundClip: "text",
                    color:                "transparent",
                    margin:               0,
                    marginTop:            "-230px",
                    textTransform:        "uppercase",
                    opacity:              0,
                    animation:            "cta-appear 0.6s ease-out 2s forwards",
                }}
            >
                par Rafael Solis Ramos
            </p>
        </div>

        {/* Zone de hover transparente */}
        <div
            ref={hoverZoneRef}
            style={{
                position: "fixed",
                zIndex:   101,
                cursor:   "pointer",
                top:      0,
                left:     0,
            }}
            onClick={() => {
                hamBtnRef.current?.classList.toggle("active");
                window.dispatchEvent(new Event("menu-toggle"));
            }}
        />

        {/* Ham4 */}
        <svg
            ref={hamBtnRef}
            className="ham-btn ham4"
            viewBox="0 0 100 100"
            width={47}
            height={47}
            style={{ position: "fixed", zIndex: 102, opacity: 0, pointerEvents: "none" }}
            onClick={() => hamBtnRef.current?.classList.toggle("active")}
        >
            <path className="line top"    d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20" />
            <path className="line middle" d="m 70,50 h -40" />
            <path className="line bottom" d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20" />
        </svg>
        </>
    );
}