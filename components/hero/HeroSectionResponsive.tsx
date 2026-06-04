"use client";
import { useState, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "./HeroSection";
import HeroSectionMobile from "./HeroSectionMobile";

export default function HeroSectionResponsive() {
  /* Démarre sur false (desktop) pour éviter le null → 2600px CLS.
     Sur mobile réel, useEffect switche immédiatement sans shift visible
     car les deux versions ont la même hauteur (SECTION_HEIGHTS.hero). */
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [isMobile]);

  return isMobile ? <HeroSectionMobile /> : <HeroSection />;
}