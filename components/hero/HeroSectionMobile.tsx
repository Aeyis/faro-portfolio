"use client";
import StarsBackground from "@/components/hero/StarsBackground";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SECTION_HEIGHTS, PARALLAX_SPEEDS } from "@/lib/constants";
import BubbleCanvas from "@/components/ui/BubbleCanvas";

gsap.registerPlugin(ScrollTrigger);

const MULTIPLIER = 0.2;

export default function HeroSectionMobile() {
    const sectionRef = useRef<HTMLElement>(null);
    const cloud1Ref  = useRef<HTMLDivElement>(null);
    const cloud2Ref  = useRef<HTMLDivElement>(null);
    const cloud3Ref  = useRef<HTMLDivElement>(null);
    const cloud4Ref  = useRef<HTMLDivElement>(null);
    const seaRef     = useRef<HTMLDivElement>(null);
    const groundRef  = useRef<HTMLDivElement>(null);
    const faroRef    = useRef<HTMLDivElement>(null);
    const treesRef   = useRef<HTMLDivElement>(null);

    /* ---- Gyroscope (tilt horizontal) ---- */
    useEffect(() => {
        let target = 0;
        let current = 0;
        let raf: number;
        const onTilt = (e: DeviceOrientationEvent) => {
            target = -(e.gamma ?? 0);
        };
        const tick = () => {
            current += (target - current) * 0.05;
            if (cloud1Ref.current) gsap.set(cloud1Ref.current, { x: current * 0.08 });
            if (cloud2Ref.current) gsap.set(cloud2Ref.current, { x: current * 0.07 });
            if (cloud3Ref.current) gsap.set(cloud3Ref.current, { x: current * 0.06 });
            if (cloud4Ref.current) gsap.set(cloud4Ref.current, { x: current * 0.05 });
            if (seaRef.current)    gsap.set(seaRef.current,    { x: current * 0.1 });
            if (groundRef.current) gsap.set(groundRef.current, { x: current * 0.25 });
            if (faroRef.current)   gsap.set(faroRef.current,   { x: current * 0.15 });
            if (treesRef.current)  gsap.set(treesRef.current,  { x: current * 0.8 });
            raf = requestAnimationFrame(tick);
        };
        window.addEventListener("deviceorientation", onTilt);
        raf = requestAnimationFrame(tick);
        return () => {
            window.removeEventListener("deviceorientation", onTilt);
            cancelAnimationFrame(raf);
        };
    }, []);

    /* ---- Parallaxe scroll ---- */
    useGSAP(() => {
        let autoScrolling = false;
        const trigger = {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self: ScrollTrigger) => {
                if (self.progress > 0.95) window.dispatchEvent(new Event('hero-bubble-start'));
                if (self.progress < 0.90) window.dispatchEvent(new Event('hero-bubble-stop'));
                if (self.progress >= 1 && !autoScrolling) {
                    autoScrolling = true;
                    const target = document.getElementById("about");
                    if (!target) { autoScrolling = false; return; }
                    const block = (e: Event) => { e.preventDefault(); e.stopImmediatePropagation(); };
                    const blockKey = (e: KeyboardEvent) => {
                        if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "].includes(e.key))
                            e.preventDefault();
                    };
                    window.addEventListener("wheel", block, { passive: false, capture: true });
                    window.addEventListener("touchmove", block, { passive: false, capture: true });
                    window.addEventListener("keydown", blockKey, { capture: true });
                    let cleaned = false;
                    const cleanup = () => {
                        if (cleaned) return;
                        cleaned = true;
                        autoScrolling = false;
                        window.removeEventListener("wheel", block, { capture: true });
                        window.removeEventListener("touchmove", block, { capture: true });
                        window.removeEventListener("keydown", blockKey, { capture: true });
                    };
                    window.lenisInstance?.scrollTo(target, {
                        duration: 2.2,
                        easing: (t) => Math.sin((t * Math.PI) / 2),
                        onComplete: cleanup,
                    });
                    setTimeout(cleanup, 4000);
                }
            },
        };

        const move = (ref: React.RefObject<HTMLDivElement | null>, speed: number) => {
            if (!ref.current) return;
            gsap.to(ref.current, {
                y: -(SECTION_HEIGHTS.hero * speed * MULTIPLIER),
                ease: "none",
                scrollTrigger: trigger,
            });
        };

        move(cloud1Ref,  PARALLAX_SPEEDS.cloud1);
        move(cloud2Ref,  PARALLAX_SPEEDS.cloud2);
        move(cloud3Ref,  PARALLAX_SPEEDS.cloud3);
        move(cloud4Ref,  PARALLAX_SPEEDS.cloud4);
        move(seaRef,     PARALLAX_SPEEDS.sea);
        move(groundRef,  PARALLAX_SPEEDS.ground);
        move(faroRef,    PARALLAX_SPEEDS.faro);
        move(treesRef,   PARALLAX_SPEEDS.treesFront);
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            id="hero"
            style={{ height: SECTION_HEIGHTS.hero, position: "relative" }}
        >
            <div className="sky-gradient sticky top-0 w-full h-screen overflow-hidden">
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                {/* Étoiles */}
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    <StarsBackground />
                </div>

                {/* Phare */}
                <div ref={faroRef} style={{
                    position: "absolute",
                    left: "10px",
                    top: "130px",
                    width: "190px",
                    height: "595px",
                    zIndex: 6,
                }}>
                    <Image src="/assets/hero/faro.svg" alt="" fill />
                </div>

                {/* Mer */}
                <div ref={seaRef} style={{
                    position: "absolute",
                    left: "-1650px",
                    top: "-1180px",
                    width: "4400px",
                    height: "2200px",
                    zIndex: 5,
                }}>
                    <div className="sea-sway" style={{ position: "absolute", inset: 0 }}>
                        <Image src="/assets/hero/sea.svg" alt="" fill />
                    </div>
                </div>

                {/* Sol */}
                <div ref={groundRef} style={{
                    position: "absolute",
                    left: "0px",
                    top: "190px",
                    width: "1100px",
                    height: "700px",
                    zIndex: 7,
                }}>
                    <Image src="/assets/hero/ground_1.svg" alt="" fill />
                </div>

                {/* Cloud 1 */}
                <div ref={cloud1Ref} style={{
                    position: "absolute",
                    left: "-640px",
                    top: "-434px",
                    width: "1900px",
                    height: "1300px",
                    zIndex: 4,
                }}>
                    <div className="cloud-morph-1" style={{ position: "absolute", inset: 0 }}>
                        <Image src="/assets/hero/cloud_1.svg" alt="" fill />
                    </div>
                </div>

                {/* Cloud 2 */}
                <div ref={cloud2Ref} style={{
                    position: "absolute",
                    left: "-450px",
                    top: "-450px",
                    width: "2000px",
                    height: "1300px",
                    zIndex: 3,
                }}>
                    <div className="cloud-morph-2" style={{ position: "absolute", inset: 0 }}>
                        <Image src="/assets/hero/cloud_2.svg" alt="" fill />
                    </div>
                </div>

                {/* Cloud 3 */}
                <div ref={cloud3Ref} style={{
                    position: "absolute",
                    left: "-580px",
                    top: "-450px",
                    width: "2000px",
                    height: "1300px",
                    zIndex: 2,
                }}>
                    <div className="cloud-morph-3" style={{ position: "absolute", inset: 0 }}>
                        <Image src="/assets/hero/cloud_3.svg" alt="" fill />
                    </div>
                </div>

                {/* Cloud 4 */}
                <div ref={cloud4Ref} style={{
                    position: "absolute",
                    left: "-450px",
                    top: "-440px",
                    width: "2000px",
                    height: "1300px",
                    zIndex: 1,
                }}>
                    <div className="cloud-morph-4" style={{ position: "absolute", inset: 0 }}>
                        <Image src="/assets/hero/cloud_4.svg" alt="" fill />
                    </div>
                </div>

                {/* Tree Front */}
                <div ref={treesRef} style={{
                    position: "absolute",
                    left: "-700px",
                    top: "690px",
                    width: "2000px",
                    height: "700px",
                    zIndex: 8,
                }}>
                    <div className="tree-sway" style={{ position: "absolute", inset: 0 }}>
                        <Image src="/assets/hero/tree_front_mobile.svg" alt="" fill />
                    </div>
                </div>
                <BubbleCanvas wave maxSize={18} speed={4} maxCount={300} spread={200} />
            </div>
            </div>
        </section>
    );
}