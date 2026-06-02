"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import gsap from "gsap";
import { SECTION_HEIGHTS, HERO_LAYERS, PARALLAX_SPEEDS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);
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
    racineRef,
  } = useHeroParallax();

  const stickyRef   = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const scrollHint  = useRef<HTMLDivElement>(null);


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
    const hint = scrollHint.current;
    if (!hint) return;

    let scrolled = false;
    let timer: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      if (scrolled) return;
      scrolled = true;
      gsap.to(hint, { opacity: 0, y: 10, duration: 0.5, ease: "power2.in" });
    };

    const onIntroDone = () => {
      timer = setTimeout(() => {
        if (!scrolled) {
          gsap.fromTo(hint,
            { opacity: 0, y: -6 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
          );
        }
      }, 5000);
    };

    window.addEventListener("intro-done", onIntroDone, { once: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("intro-done", onIntroDone);
      window.removeEventListener("scroll", onScroll);
    };
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
            <Image src="/assets/hero/background_cloud_1.webp" alt="" fill sizes="100vw" style={{ objectFit: "contain" }} />
          </div>
        </div>
        <div ref={bgCloud2Ref} style={{ ...figmaToCSS(HERO_LAYERS.backgroundCloud2), left: 0, zIndex: -3 }}>
          <div className="cloud-drift-2" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/background_cloud_2.webp" alt="" fill sizes="100vw" style={{ objectFit: "contain" }} />
          </div>
        </div>

        {/* COUCHE 3 — Nuages avant */}
        <div ref={cloud1Ref} style={{ ...figmaToCSS(HERO_LAYERS.cloud1), zIndex: 3 }}>
          <div className="cloud-morph-1" style={{ position: "absolute", inset: 1 }}>
            <Image src="/assets/hero/cloud_1.webp" alt="" fill sizes="100vw" style={{ objectFit: "contain" }} />
          </div>
        </div>
        <div ref={cloud2Ref} style={{ ...figmaToCSS(HERO_LAYERS.cloud2), zIndex: 2 }}>
          <div className="cloud-morph-2" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/cloud_2.webp" alt="" fill sizes="100vw" style={{ objectFit: "contain" }} />
          </div>
        </div>
        <div ref={cloud3Ref} style={{ ...figmaToCSS(HERO_LAYERS.cloud3), zIndex: 1 }}>
          <div className="cloud-morph-3" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/cloud_3.webp" alt="" fill sizes="100vw" style={{ objectFit: "contain" }} />
          </div>
        </div>
        <div ref={cloud4Ref} style={{ ...figmaToCSS(HERO_LAYERS.cloud4), zIndex: 0 }}>
          <div className="cloud-morph-4" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/cloud_4.webp" alt="" fill sizes="100vw" style={{ objectFit: "contain" }} />
          </div>
        </div>

        {/* COUCHE 4 — Mer */}
        <div ref={seaRef} style={{ ...figmaToCSS(HERO_LAYERS.sea), zIndex: 4 }}>
          <div className="sea-sway" style={{ position: "absolute", inset: "0 -280px" }}>
            <Image src="/assets/hero/sea.webp" alt="" fill priority sizes="100vw" style={{ objectFit: "contain" }} />
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
          <Image src="/assets/hero/ground_1.webp" alt="" fill priority sizes="100vw" style={{ objectFit: "fill" }} />
        </div>

        {/* COUCHE 6 — Phare */}
        <div ref={faroRef} style={{ ...figmaToCSS(HERO_LAYERS.faro), zIndex: 6, top: "15%" }}>
          <Image src="/assets/hero/faro.webp" alt="" fill priority sizes="15vw" style={{ objectFit: "contain", objectPosition: "bottom" }} />
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
            <Image src="/assets/hero/trees_left.webp" alt="" fill priority sizes="83vw" style={{ objectFit: "contain" }} />
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
            <Image src="/assets/hero/tree_shadow_1.webp" alt="" fill sizes="70vw" style={{ objectFit: "contain" }} />
          </div>
        </div>
        <div ref={treeShadow2Ref} style={{
          position: "absolute",
          bottom: "-6vw",
          right: "-18vw",
          width: "92vw",
          height: "45vw",
          zIndex: 8,
        }}>
          <div className="tree-sway" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/tree_shadow_2.webp" alt="" fill sizes="92vw" style={{ objectFit: "contain" }} />
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
            <Image src="/assets/hero/tree_shadow_3.webp" alt="" fill sizes="95vw" style={{ objectFit: "contain" }} />
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
            <Image src="/assets/hero/tree_light_1.webp" alt="" fill sizes="70vw" style={{ objectFit: "contain" }} />
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

        {/* Scroll hint */}
        <div ref={scrollHint} style={{
          position: "absolute", bottom: "4.5rem", left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20, pointerEvents: "none", opacity: 0,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        }}>
          <span style={{ fontFamily: "var(--font-inter-tight)", fontSize: 16, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Scroll</span>
          {[2, 1, 0].map((i, idx) => (
            <svg key={i} width="22" height="14" viewBox="0 0 16 10" fill="none" style={{ animation: `heroScrollArrow 1.4s ease-in-out ${idx * 0.18}s infinite`, opacity: 0.3 + i * 0.28 }}>
              <polyline points="1,1 8,8 15,1" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ))}
        </div>

        {/* COUCHE 10 — Premier plan */}
        <div ref={treeFrontRef} style={{ ...figmaToCSS(HERO_LAYERS.treeFront), zIndex: 10 }}>
          <div className="tree-sway-c" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/tree_front.webp" alt="" fill sizes="100vw" style={{ objectFit: "contain" }} />
          </div>
        </div>

      </div>

    </section>
  );
}
