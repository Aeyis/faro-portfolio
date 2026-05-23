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
        const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
        window.lenisInstance = lenis;
        lenis.on('scroll', ScrollTrigger.update)
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
        return () => {
            lenis.off('scroll', ScrollTrigger.update)
            lenis.destroy()
        }
    }, [])
    return <>{children}</>
}
