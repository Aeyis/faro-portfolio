import { useState, useEffect } from "react";
import { BREAKPOINT_MOBILE } from "@/lib/constants";

/**
 * Retourne `true` si la largeur de fenêtre est < BREAKPOINT_MOBILE (768px).
 * Se met à jour lors d'un resize.
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${BREAKPOINT_MOBILE - 1}px)`);
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return isMobile;
}
