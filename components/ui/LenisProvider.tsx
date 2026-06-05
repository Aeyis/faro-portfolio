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
        ScrollTrigger.config({
            autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
            ignoreMobileResize: true,
        });
        const isMob = window.innerWidth < 768;
        const lenis = new Lenis({
            duration:        isMob ? 1.2 : 2.2,
            easing:          (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier: 0.8,
            touchMultiplier: isMob ? 2.0 : 1.5,
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
    }, [])
    return <>{children}</>
}
