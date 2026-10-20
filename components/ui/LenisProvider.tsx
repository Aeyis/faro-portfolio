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

        /* Hero (2600px + transition) et about (4500px) très hauts — molette accélérée jusqu'à la section stack */
        const WHEEL_BOOST = 2.5;
        const boostEnd = () => {
            const stack = document.getElementById("stack");
            return stack ? stack.getBoundingClientRect().top + window.scrollY : 0;
        };

        const lenis = new Lenis({
            duration:        isMob ? 1.2 : 2.2,
            easing:          (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier: 0.8,
            touchMultiplier: isMob ? 2.0 : 1.5,
            virtualScroll: (data) => {
                if (data.event.type === "wheel" && window.scrollY < boostEnd() - window.innerHeight) {
                    data.deltaY *= WHEEL_BOOST;
                }
                return true;
            },
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
