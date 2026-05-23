"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface WaveTransitionProps {
  sectionHeight?: number
}

export default function WaveTransition({ sectionHeight = 1200 }: WaveTransitionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const waveRef    = useRef<HTMLDivElement>(null)
  const wave2Ref   = useRef<HTMLDivElement>(null)
  const wave3Ref   = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    const st = {
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 1.5,
    }

    /* Couche principale — monte en premier */
    gsap.fromTo(waveRef.current,  { y: "105vh" }, { y: "0vh",   ease: "none", scrollTrigger: st })
    /* Couche 2 — légèrement en retard */
    gsap.fromTo(wave2Ref.current, { y: "115vh" }, { y: "5vh",  ease: "none", scrollTrigger: st })
    /* Couche 3 — encore plus en retard, écume */
    gsap.fromTo(wave3Ref.current, { y: "125vh" }, { y: "10vh", ease: "none", scrollTrigger: st })

  }, { scope: sectionRef })

  const bodyStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    width: "100%",
    height: "100vh",
    willChange: "transform",
  }

  return (
    <div ref={sectionRef} style={{ position: "relative", height: sectionHeight, zIndex: 20 }}>

      {/* COUCHE 3 — écume claire (derrière) */}
      <div ref={wave3Ref} style={bodyStyle}>
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none"
          style={{ position: "absolute", top: -198, left: 0, width: "100%", height: "200px", display: "block" }}>
          <path
            d="M0,140 C60,90 120,170 200,130 C280,90 340,160 440,120
               C540,80 600,155 700,115 C800,75 870,150 980,110
               C1090,70 1160,145 1260,105 C1330,80 1390,130 1440,110
               L1440,200 L0,200 Z"
            fill="rgba(45,160,140,0.35)"
          />
        </svg>
        <div style={{ width: "100%", height: "100%", background: "rgba(45,160,140,0.35)" }} />
      </div>

      {/* COUCHE 2 — intermédiaire */}
      <div ref={wave2Ref} style={{ ...bodyStyle, position: "sticky" }}>
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none"
          style={{ position: "absolute", top: -198, left: 0, width: "100%", height: "200px", display: "block" }}>
          <path
            d="M0,110 C80,160 180,60 300,100 C420,140 500,50 640,95
               C780,140 860,55 1000,90 C1120,125 1200,45 1320,85
               C1380,105 1420,75 1440,90
               L1440,200 L0,200 Z"
            fill="rgba(15,90,90,0.75)"
          />
        </svg>
        <div style={{ width: "100%", height: "100%", background: "rgba(15,90,90,0.75)" }} />
      </div>

      {/* COUCHE 1 — principale (devant) */}
      <div ref={waveRef} style={{ ...bodyStyle, position: "sticky" }}>
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none"
          style={{ position: "absolute", top: -198, left: 0, width: "100%", height: "200px", display: "block" }}>
          <path
            d="M0,90 C100,140 220,40 380,85 C540,130 640,35 800,80
               C960,125 1060,30 1220,75 C1340,108 1400,60 1440,78
               L1440,200 L0,200 Z"
            fill="#0d4a4a"
          />
        </svg>
        <div style={{ width: "100%", height: "100%", background: "#0d4a4a" }} />
      </div>

    </div>
  )
}