"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { SECTION_HEIGHTS, HERO_LAYERS } from "@/lib/constants";
import { figmaToCSS } from "@/lib/utils";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import StarsBackground from "./StarsBackground";

const LERP  = 0.06;
const AMP_X = 20;

export default function HeroSection() {
  const {
    sectionRef,
    starsRef,
    bgCloud1Ref,
    bgCloud2Ref,
    cloud1Ref,
    cloud2Ref,
    cloud3Ref,
    cloud4Ref,
    seaRef,
    seaInnerRef,
    groundRef,
    faroRef,
    treesLeftRef,
    treeShadow1Ref,
    treeShadow2Ref,
    treeShadow3Ref,
    treeLight1Ref,
    treeFrontRef,
  } = useHeroParallax();

  const stickyRef = useRef<HTMLDivElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hide = () => {
      const el = ctaRef.current;
      if (!el) return;
      el.style.animation = "none";
      el.style.opacity   = getComputedStyle(el).opacity;
      gsap.to(el, { opacity: 0, duration: 0.4 });
    };
    window.addEventListener("intro-done", hide, { once: true });
    return () => window.removeEventListener("intro-done", hide);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const container = stickyRef.current;
    if (!container) return;

    let tX = 0, cX = 0;

    const onMouseMove = (e: MouseEvent) => {
      tX = (e.clientX / window.innerWidth - 0.5) * 2;
    };

    container.addEventListener("mousemove", onMouseMove);

    const layers: { ref: React.RefObject<HTMLDivElement | null>; i: number }[] = [
      { ref: treesLeftRef,   i: 0.65 },
      { ref: treeShadow1Ref, i: 0.65 },
      { ref: treeShadow2Ref, i: 0.65 },
      { ref: treeShadow3Ref, i: 0.65 },
      { ref: treeLight1Ref,  i: 0.65 },
      { ref: treeFrontRef,   i: 0.80 },
      { ref: faroRef,   i: 0.10 },
      { ref: groundRef, i: 0.15 },
    ];

    const tick = () => {
      cX += (tX - cX) * LERP;

      layers.forEach(({ ref, i }) => {
        if (!ref.current) return;
        gsap.set(ref.current, { x: Math.max(-5, Math.min(5, cX * AMP_X * i)) });
      });
    };

    gsap.ticker.add(tick);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(tick);
      layers.forEach(({ ref }) => {
        if (ref.current) gsap.set(ref.current, { x: 0 });
      });
    };
  }, [
    treesLeftRef, treeShadow1Ref, treeShadow2Ref, treeShadow3Ref,
    treeLight1Ref, treeFrontRef,
  ]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{ height: SECTION_HEIGHTS.hero }}
    >
      <div ref={stickyRef} className="sky-gradient sticky top-0 w-full h-screen overflow-hidden">

        {/* COUCHE 1 — Étoiles CSS animées */}
        <div ref={starsRef} style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <StarsBackground />
        </div>

        {/* COUCHE 2 — Nuages de fond */}
        <div ref={bgCloud1Ref} style={{ ...figmaToCSS(HERO_LAYERS.backgroundCloud1), left: 0, zIndex: -2 }}>
          <div className="cloud-drift-1" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/background_cloud_1.svg" alt="" fill />
          </div>
        </div>
        <div ref={bgCloud2Ref} style={{ ...figmaToCSS(HERO_LAYERS.backgroundCloud2), left: 0, zIndex: -3 }}>
          <div className="cloud-drift-2" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/background_cloud_2.svg" alt="" fill />
          </div>
        </div>

        {/* COUCHE 3 — Nuages avant */}
        <div ref={cloud1Ref} style={{ ...figmaToCSS(HERO_LAYERS.cloud1), zIndex: 3 }}>
          <div className="cloud-morph-1" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/cloud_1.svg" alt="" fill />
          </div>
        </div>
        <div ref={cloud2Ref} style={{ ...figmaToCSS(HERO_LAYERS.cloud2), zIndex: 2 }}>
          <div className="cloud-morph-2" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/cloud_2.svg" alt="" fill />
          </div>
        </div>
        <div ref={cloud3Ref} style={{ ...figmaToCSS(HERO_LAYERS.cloud3), zIndex: 1 }}>
          <div className="cloud-morph-3" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/cloud_3.svg" alt="" fill />
          </div>
        </div>
        <div ref={cloud4Ref} style={{ ...figmaToCSS(HERO_LAYERS.cloud4), zIndex: 0 }}>
          <div className="cloud-morph-4" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/cloud_4.svg" alt="" fill />
          </div>
        </div>

        {/* COUCHE 4 — Mer */}
        <div ref={seaRef} style={{ ...figmaToCSS(HERO_LAYERS.sea), zIndex: 4 }}>
          <div className="sea-sway" style={{ position: "absolute", inset: "0 -40px" }}>
            <Image src="/assets/hero/sea.svg" alt="" fill />
          </div>
        </div>

        {/* COUCHE 5 — Sol */}
        <div ref={groundRef} style={{
          position: "absolute",
          bottom: "0.7vw",
          left: "-2vw",
          width: "100vw",
          height: "55vw",
          zIndex: 5,
        }}>
          <Image src="/assets/hero/ground_1.svg" alt="" fill />
        </div>

        {/* COUCHE 6 — Phare */}
        <div ref={faroRef} style={{ ...figmaToCSS(HERO_LAYERS.faro), zIndex: 6, top: "15%" }}>
          <Image src="/assets/hero/faro.svg" alt="" fill />
        </div>

        {/* COUCHE 7 — Végétation gauche */}
        <div ref={treesLeftRef} style={{
          position: "absolute",
          bottom: "-11vw",
          left: "-0.5vw",
          width: "83.44vw",
          height: "71.46vw",
          zIndex: 7,
        }}>
          <div className="tree-sway" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/trees_left.svg" alt="" fill />
          </div>
        </div>

        {/* COUCHE 8 — Ombres arbres */}
        <div ref={treeShadow1Ref} style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "70vw",
          height: "40vw",
          zIndex: 8,
        }}>
          <div className="tree-sway" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/tree_shadow_1.svg" alt="" fill />
          </div>
        </div>
        <div ref={treeShadow2Ref} style={{
          position: "absolute",
          bottom: "0.8vw",
          right: "-10vw",
          width: "70.1vw",
          height: "33.85vw",
          zIndex: 8,
        }}>
          <div className="tree-sway" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/tree_shadow_2.svg" alt="" fill />
          </div>
        </div>
        <div ref={treeShadow3Ref} style={{
          position: "absolute",
          bottom: "-2vw",
          right: 0,
          width: "95vw",
          height: "52vw",
          zIndex: 9,
        }}>
          <div className="tree-sway" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/tree_shadow_3.svg" alt="" fill />
          </div>
        </div>

        {/* COUCHE 9 — Lumières arbres */}
        <div ref={treeLight1Ref} style={{
          position: "absolute",
          top: "-1vw",
          right: "4vw",
          width: "70vw",
          height: "40vw",
          zIndex: 7,
        }}>
          <div className="tree-sway" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/tree_light_1.svg" alt="" fill />
          </div>
        </div>

        {/* CTA — Appuyer pour commencer */}
        <div ref={ctaRef} className="pulse-cta" style={{
          position: "absolute",
          bottom: "5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          pointerEvents: "none",
          color: "#fff",
          fontSize: "11px",
          letterSpacing: "0.18em",
          fontFamily: "var(--font-syne)",
          fontWeight: 400,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>
          Appuyer pour commencer
        </div>

        {/* COUCHE 10 — Premier plan */}
        <div ref={treeFrontRef} style={{ ...figmaToCSS(HERO_LAYERS.treeFront), zIndex: 10 }}>
          <Image src="/assets/hero/tree_front.svg" alt="" fill />
        </div>


      </div>

      {/* Bouton scroll vers section suivante */}
      <button
        onClick={() => {
          const target = document.getElementById("about");
          if (!target) return;
          const startY = window.scrollY;
          const endY = target.getBoundingClientRect().top + startY;
          const duration = 3500;
          let startTime: number;
          function step(timestamp: number) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            window.scrollTo(0, startY + (endY - startY) * ease);
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: 100,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(6px)",
          color: "#fff",
          fontSize: "1.2rem",
          transition: "background 0.2s",
        }}
        aria-label="Scroll vers la section suivante"
      >
        ↓
      </button>
    </section>
  );
}
