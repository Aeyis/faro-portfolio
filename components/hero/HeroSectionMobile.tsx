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
            style={{ height: SECTION_HEIGHTS.hero, position: "relative", overflow: "hidden", maxWidth: "100vw" }}
        >
            <div className="sticky top-0 w-full h-screen overflow-hidden" style={{ zIndex: 0, background: `
                radial-gradient(ellipse 40% 80% at 0% 40%, rgba(10, 15, 30, 0.6) 0%, transparent 100%),
                radial-gradient(ellipse 60% 20% at 18% 72%, rgba(220, 140, 40, 0.5) 0%, transparent 70%),
                radial-gradient(ellipse 90% 30% at 50% 76%, rgba(196, 92, 26, 0.6) 0%, transparent 65%),
                radial-gradient(ellipse 50% 35% at 88% 62%, rgba(190, 80, 50, 0.3) 0%, transparent 65%),
                radial-gradient(ellipse 60% 20% at 35% 80%, rgba(22, 78, 80, 0.7) 0%, transparent 60%),
                radial-gradient(ellipse 35% 70% at 70% 30%, rgba(22, 54, 67, 0.4) 0%, transparent 75%),
                linear-gradient(to bottom, #04060f 0%, #070d1e 12%, #0a1228 22%, #0f1a35 32%, #163643 50%, #7a3a10 65%, #c45c1a 76%, #0d4a4a 88%)
            `}}>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                {/* Étoiles */}
                <div style={{ position: "absolute", inset: 0, zIndex: 0, clipPath: "inset(0 0 28% 0)" }}>
                    <StarsBackground />
                </div>

                {/* Phare */}
                <div ref={faroRef} style={{
                    position: "absolute",
                    left: "2.5vw",
                    top: "21vh",
                    width: "49vw",
                    height: "71vh",
                    zIndex: 6,
                }}>
                    <Image src="/assets/hero/faro.webp" alt="" fill priority style={{ objectFit: "contain", objectPosition: "bottom" }} />
                </div>

                {/* Mer */}
                <div ref={seaRef} style={{
                    position: "absolute",
                    left: "-320vw",
                    top: "0vh",
                    width: "652vw",
                    height: "100vh",
                    zIndex: 5,
                }}>
                    <div className="sea-sway" style={{ position: "absolute", inset: 0 }}>
                        <Image src="/assets/hero/sea.webp" alt="" fill />
                    </div>
                </div>

                {/* Sol Sous le phare */}
                <div ref={groundRef} style={{
                    position: "absolute",
                    left: 0,
                    top: "27vh",
                    width: "282vw",
                    height: "83vh",
                    zIndex: 7,
                }}>
                    <Image src="/assets/hero/ground_1.webp" alt="" fill />
                </div>

                {/* Cloud 1 */}
                <div ref={cloud1Ref} style={{
                    position: "absolute",
                    left: "-190vw",
                    top: "-56vh",
                    width: "550vw",
                    height: "174vh",
                    zIndex: 4,
                }}>
                    <div className="cloud-morph-1" style={{ position: "absolute", inset: 0 }}>
                        <Image src="/assets/hero/cloud_1.webp" alt="" fill />
                    </div>
                </div>

                {/* Cloud 2 */}
                <div ref={cloud2Ref} style={{
                    position: "absolute",
                    left: "-160vw",
                    top: "-29vh",
                    width: "460vw",
                    height: "140vh",
                    zIndex: 3,
                }}>
                    <div className="cloud-morph-2" style={{ position: "absolute", inset: 0 }}>
                        <Image src="/assets/hero/cloud_2.webp" alt="" fill />
                    </div>
                </div>

                {/* Cloud 3 */}
                <div ref={cloud3Ref} style={{
                    position: "absolute",
                    left: "-160vw",
                    top: "-32vh",
                    width: "460vw",
                    height: "140vh",
                    zIndex: 2,
                }}>
                    <div className="cloud-morph-3" style={{ position: "absolute", inset: 0 }}>
                        <Image src="/assets/hero/cloud_3.webp" alt="" fill />
                    </div>
                </div>

                {/* Cloud 4 */}
                <div ref={cloud4Ref} style={{
                    position: "absolute",
                    left: "-135vw",
                    top: "-38vh",
                    width: "550vw",
                    height: "174vh",
                    zIndex: 1,
                }}>
                    <div className="cloud-morph-4" style={{ position: "absolute", inset: 0 }}>
                        <Image src="/assets/hero/cloud_4.webp" alt="" fill />
                    </div>
                </div>

                {/* Tree Front */}
                <div ref={treesRef} style={{
                    position: "absolute",
                    left: "-179vw",
                    top: "105vh",
                    width: "513vw",
                    height: "83vh",
                    zIndex: 8,
                }}>
                    <div className="tree-sway" style={{ position: "absolute", inset: 0 }}>
                        <Image src="/assets/hero/tree_front_mobile.webp" alt="" fill style={{ objectFit: "contain" }} />
                    </div>
                </div>
                <BubbleCanvas wave maxSize={18} speed={4} maxCount={150} spread={200} throttle={2} />
            </div>
            </div>
        </section>
    );
}