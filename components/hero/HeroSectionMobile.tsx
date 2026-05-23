"use client";
import StarsBackground from "@/components/hero/StarsBackground";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSectionMobile() {
    const cloud1Ref = useRef<HTMLDivElement>(null);
    const cloud2Ref = useRef<HTMLDivElement>(null);
    const cloud3Ref = useRef<HTMLDivElement>(null);
    const cloud4Ref = useRef<HTMLDivElement>(null);
    const seaRef    = useRef<HTMLDivElement>(null);
    const groundRef = useRef<HTMLDivElement>(null);
    const faroRef   = useRef<HTMLDivElement>(null);
    const treesRef  = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let target = 0;
        let current = 0;
        let raf : number;
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
            if (groundRef.current) gsap.set(groundRef.current, { x: current * 0.25});
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
    return (
        <section
            id="hero"
            style={{ height: "100svh", position: "relative", overflow:"hidden" }}
            className="sky-gradient"
        >
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

            {/* mer */}
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
                top : "340px",
                width: "2000px",
                height: "700px",
                zIndex: 8,
            }}>
                <div className="tree-sway" style={{ position: "absolute", inset: 0 }}>
                    <Image src="/assets/hero/tree_front.svg" alt="" fill />
                </div>
            </div>
        </section>
    );
}