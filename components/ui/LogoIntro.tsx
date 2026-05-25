"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import LogoFaro from "./LogoFaro";

export default function LogoIntro() {
    const containerRef        = useRef<HTMLDivElement>(null);
    const bylineRef           = useRef<HTMLParagraphElement>(null);
    const logoWrapperRef      = useRef<HTMLDivElement>(null);
    const hamburgerOverlayRef = useRef<HTMLDivElement>(null);
    const hoverZoneRef        = useRef<HTMLDivElement>(null);
    const hamBtnRef           = useRef<SVGSVGElement>(null);
    const aboutModeRef        = useRef(false);

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

                    hz.addEventListener("mouseenter", () => {
                        const glow = aboutModeRef.current
                            ? "hue-rotate(160deg) saturate(1.5) brightness(1.3) drop-shadow(0 0 28px rgba(80,200,255,0.35))"
                            : "drop-shadow(0 0 28px rgba(255,184,48,0.25))";
                        gsap.to(el, { scale: targetScale * 1.08, filter: glow, duration: 0.4, ease: "power2.out" });
                        gsap.to(logoWrapperRef.current,      { opacity: 0, duration: 0.35, ease: "power2.inOut" });
                        gsap.to(hamburgerOverlayRef.current, { opacity: 1, duration: 0.35, ease: "power2.inOut" });
                        gsap.to(ham,                         { opacity: 1, duration: 0.35, ease: "power2.out"   });
                    });

                    hz.addEventListener("mouseleave", () => {
                        const base = aboutModeRef.current
                            ? "hue-rotate(160deg) saturate(1.5) brightness(1.1)"
                            : "drop-shadow(0 0 0px rgba(255,184,48,0))";
                        gsap.to(el, { scale: targetScale, filter: base, duration: 0.5, ease: "power2.inOut" });
                        gsap.to(ham,                         { opacity: 0, duration: 0.3 });
                        gsap.to(hamburgerOverlayRef.current, { opacity: 0, duration: 0.4, ease: "power2.inOut" });
                        gsap.to(logoWrapperRef.current,      { opacity: 1, duration: 0.4, ease: "power2.inOut" });
                    });

                    // ── Disparition au scroll, réapparition dans la section About ──
                    const hidelogo = () => {
                        gsap.to(el, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" });
                        if (hz) hz.style.pointerEvents = "none";
                        if (ham) gsap.to(ham, { opacity: 0, duration: 0.3 });
                    };

                    const addHideOnScrollDown = () => {
                        const handler = (e: WheelEvent) => {
                            if (e.deltaY <= 0) return;
                            hidelogo();
                            window.removeEventListener("wheel", handler);
                        };
                        window.addEventListener("wheel", handler, { passive: true });
                    };

                    const showAbout = () => {
                        aboutModeRef.current = true;
                        ham?.style.setProperty("--ham-color", "#020818");
                        gsap.set(el, { filter: "hue-rotate(160deg) saturate(1.5) brightness(1.1)" });
                        gsap.to(el, { autoAlpha: 1, duration: 0.7, ease: "power2.out" });
                        if (hz) hz.style.pointerEvents = "all";
                    };

                    const hideAbout = () => {
                        aboutModeRef.current = false;
                        ham?.style.removeProperty("--ham-color");
                        gsap.set(el, { filter: "none" });
                        gsap.to(el, { autoAlpha: 1, duration: 0.7, ease: "power2.out" });
                        if (hz) hz.style.pointerEvents = "all";
                        addHideOnScrollDown();
                    };

                    addHideOnScrollDown();
                    window.addEventListener("about-stuck",   showAbout as EventListener);
                    window.addEventListener("about-unstuck", hideAbout as EventListener);
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