"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import LogoFaro from "./LogoFaro";

const WaterBackground = dynamic(() => import("@/components/stack/WaterBackground"), { ssr: false, loading: () => null });

function WaterBackgroundFill() {
    const [size, setSize] = useState({ w: 1920, h: 1080 });
    useEffect(() => {
        setSize({ w: window.innerWidth, h: window.innerHeight });
    }, []);
    return (
        <WaterBackground
            width={size.w}
            height={size.h}
            tint={[1.0, 0.62, 0.12]}
            bgColors={["#1a0f03", "#0e0803", "#070503"]}
        />
    );
}

export default function LoadingScreen() {
    const [gone, setGone] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const barRef     = useRef<HTMLDivElement>(null);
    const exitRef    = useRef(false);

    const exit = () => {
        if (exitRef.current) return;
        exitRef.current = true;
        const overlay = overlayRef.current;
        if (!overlay) return;
        const isMob = window.innerWidth < 768;
        gsap.to(overlay, {
            yPercent: isMob ? 100 : -100,
            duration: 0.6,
            ease: "power3.inOut",
            onComplete: () => {
                document.body.classList.remove("is-loading");
                window.scrollTo(0, 0);
                setGone(true);
            },
        });
    };

    useEffect(() => {
        /* Désactive la restauration de scroll du navigateur */
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
        /* Pas de overflow:hidden sur html — provoque un CLS de 1.0 (scrollbar shift).
           Lenis est déjà stoppé, le scroll est bloqué sans toucher au layout. */
        document.body.classList.add("is-loading");

        const bar = barRef.current;
        if (bar) {
            gsap.fromTo(bar, { scaleX: 0 }, {
                scaleX: 1,
                duration: 1.2,
                ease: "power2.inOut",
                transformOrigin: "left center",
            });
        }
    }, []);

    if (gone) return null;

    return (
        <div ref={overlayRef} style={{
            position:       "fixed",
            inset:          0,
            zIndex:         9999,
            background:     "oklch(0.04 0.035 46)",
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            gap:            40,
            overflow:       "hidden",
        }}>
            {/* Eau WebGL ambre */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <WaterBackgroundFill />
            </div>

            <div style={{
                position:     "absolute",
                inset:        0,
                pointerEvents:"none",
                background:   "radial-gradient(ellipse 55% 45% at 50% 50%, oklch(0.24 0.14 54 / 0.4) 0%, transparent 70%)",
            }} />

            <div style={{ position: "relative", zIndex: 2 }}>
                <LogoFaro size={300} onReady={exit} />
            </div>

            <div style={{
                width: 220, height: 2, borderRadius: 2,
                background: "oklch(0.20 0.06 48)",
                overflow: "hidden", position: "relative", zIndex: 2,
            }}>
                <div ref={barRef} style={{
                    position: "absolute", inset: 0, borderRadius: 2,
                    background: "linear-gradient(to right, oklch(0.88 0.18 62), oklch(0.72 0.17 48))",
                    boxShadow: "0 0 12px oklch(0.75 0.18 55 / 0.6)",
                    transform: "scaleX(0)", transformOrigin: "left center",
                }} />
            </div>

        </div>
    );
}
