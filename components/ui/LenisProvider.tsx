'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

declare global {
    interface Window { lenisInstance?: Lenis; }
}

gsap.registerPlugin(ScrollTrigger)

export default function LenisProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        /* Defer Lenis+ScrollTrigger init hors du critical path → réduit TBT */
        const init = () => {
        ScrollTrigger.config({
            autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
            ignoreMobileResize: true,
        });
        const lenis = new Lenis({
            duration:        2.2,
            easing:          (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier: 0.8,
            touchMultiplier: 1.5,
        })
        window.lenisInstance = lenis;
        lenis.stop()

        const onIntroDone = () => lenis.start()
        window.addEventListener('intro-done', onIntroDone, { once: true })

        lenis.on('scroll', ScrollTrigger.update)
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
        return () => {
            lenis.off('scroll', ScrollTrigger.update)
            window.removeEventListener('intro-done', onIntroDone)
            lenis.destroy()
        }
        }; // end init
        /* requestIdleCallback : s'exécute quand le thread est libre → ne bloque pas le LCP */
        if ('requestIdleCallback' in window) {
            requestIdleCallback(init, { timeout: 500 });
        } else {
            setTimeout(init, 0);
        }
    }, [])
    return <>{children}</>
}
