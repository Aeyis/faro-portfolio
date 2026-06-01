"use client";

import { useEffect } from "react";

const SECTION_IDS = ["hero", "about", "stack", "projets", "contact"];
const DURATION    = 2000;

export default function ScrollSnap() {
    useEffect(() => {
        let snapping = false;
        let snapTimeout: ReturnType<typeof setTimeout>;
        let menuNavTimeout: ReturnType<typeof setTimeout>;

        function snapTo(targetY: number) {
            snapping = true;
            clearTimeout(snapTimeout);

            window.lenisInstance?.scrollTo(targetY, {
                duration: DURATION / 1000,
                lock:     true,
                easing:   (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
                onComplete: () => { snapping = false; },
            });

            /* fallback si onComplete ne fire pas */
            snapTimeout = setTimeout(() => { snapping = false; }, DURATION + 600);
        }

        const onMenuClose = () => {
            clearTimeout(snapTimeout);
            snapping = true;
            clearTimeout(menuNavTimeout);
            menuNavTimeout = setTimeout(() => { snapping = false; }, 600);
        };
        window.addEventListener("menu-close", onMenuClose);

        /* Cache les positions — recalcule uniquement au resize */
        let cachedSections: { el: HTMLElement; top: number; bot: number }[] = [];
        const cacheSections = () => {
            const sy = window.scrollY;
            cachedSections = SECTION_IDS
                .map(id => document.getElementById(id))
                .filter(Boolean)
                .map(el => {
                    const r = el!.getBoundingClientRect();
                    return { el: el!, top: r.top + sy, bot: r.top + sy + r.height };
                });
        };
        cacheSections();
        window.addEventListener("resize", cacheSections);

        const onWheel = (e: WheelEvent) => {
            if (snapping) return;

            const scrollY  = window.scrollY;
            const sections = cachedSections;

            for (let i = 0; i < sections.length; i++) {
                const sectionTop  = sections[i].top;
                const sectionBot  = sections[i].bot;
                const distFromTop = scrollY - sectionTop;
                const distFromBot = sectionBot - scrollY - window.innerHeight;

                /* scroll bas → snap vers section suivante (sauf hero→about) */
                if (
                    e.deltaY > 0 &&
                    distFromBot > 0 && distFromBot < 320 &&
                    i < sections.length - 1 &&
                    !(SECTION_IDS[i] === "hero" && SECTION_IDS[i + 1] === "about")
                ) {
                    snapTo(sections[i + 1].top);
                    return;
                }

                /* scroll haut → snap vers section précédente */
                if (e.deltaY < 0 && distFromTop > 50 && distFromTop < window.innerHeight && i > 0) {
                    snapTo(sections[i - 1].top);
                    return;
                }
            }
        };

        window.addEventListener("wheel", onWheel, { passive: true });
        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("menu-close", onMenuClose);
            window.removeEventListener("resize", cacheSections);
            clearTimeout(snapTimeout);
            clearTimeout(menuNavTimeout);
        };
    }, []);

    return null;
}