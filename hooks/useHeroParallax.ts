import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION_HEIGHTS, PARALLAX_SPEEDS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const MULTIPLIER = 0.2;

export function useHeroParallax() {
  const sectionRef = useRef<HTMLElement>(null);

  const starsRef       = useRef<HTMLDivElement>(null);
  const bgCloud1Ref    = useRef<HTMLDivElement>(null);
  const bgCloud2Ref    = useRef<HTMLDivElement>(null);
  const cloud1Ref      = useRef<HTMLDivElement>(null);
  const cloud2Ref      = useRef<HTMLDivElement>(null);
  const cloud3Ref      = useRef<HTMLDivElement>(null);
  const cloud4Ref      = useRef<HTMLDivElement>(null);
  const seaRef         = useRef<HTMLDivElement>(null);
  const seaInnerRef    = useRef<HTMLDivElement>(null);
  const groundRef      = useRef<HTMLDivElement>(null);
  const faroRef        = useRef<HTMLDivElement>(null);
  const treesLeftRef   = useRef<HTMLDivElement>(null);
  const treeShadow1Ref = useRef<HTMLDivElement>(null);
  const treeShadow2Ref = useRef<HTMLDivElement>(null);
  const treeShadow3Ref = useRef<HTMLDivElement>(null);
  const treeLight1Ref  = useRef<HTMLDivElement>(null);
  const treeFrontRef   = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const trigger = {
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    };

    const move = (ref: React.RefObject<HTMLDivElement | null>, speed: number) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        y: -(SECTION_HEIGHTS.hero * speed * MULTIPLIER),
        ease: "none",
        scrollTrigger: trigger,
      });
    };

    move(starsRef,       PARALLAX_SPEEDS.stars);
    move(bgCloud1Ref,    PARALLAX_SPEEDS.backgroundClouds);
    move(bgCloud2Ref,    PARALLAX_SPEEDS.backgroundClouds);
    move(cloud1Ref,      PARALLAX_SPEEDS.clouds);
    move(cloud2Ref,      PARALLAX_SPEEDS.clouds);
    move(cloud3Ref,      PARALLAX_SPEEDS.clouds);
    move(cloud4Ref,      PARALLAX_SPEEDS.clouds);
    move(seaRef,         PARALLAX_SPEEDS.sea);
    move(groundRef,      PARALLAX_SPEEDS.ground);
    move(faroRef,        PARALLAX_SPEEDS.faro);
    move(treeShadow1Ref, PARALLAX_SPEEDS.treesBack);
    move(treeShadow2Ref, PARALLAX_SPEEDS.treesBack);
    move(treeShadow3Ref, PARALLAX_SPEEDS.treesBack);
    move(treeLight1Ref,  PARALLAX_SPEEDS.treesBack);
    move(treesLeftRef,   PARALLAX_SPEEDS.treesMid);
    move(treeFrontRef,   PARALLAX_SPEEDS.treesFront);
  }, { scope: sectionRef });

  return {
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
  };
}