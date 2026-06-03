"use client";
import { useState, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "./HeroSection";
import HeroSectionMobile from "./HeroSectionMobile";

export default function HeroSectionResponsive() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isMobile === null) return;
    // Hero vient de monter — recalcule toutes les positions ScrollTrigger
    ScrollTrigger.refresh();
  }, [isMobile]);

  if (isMobile === null) return null;
  return isMobile ? <HeroSectionMobile /> : <HeroSection />;
}