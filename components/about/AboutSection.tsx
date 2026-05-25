"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useAboutParallax } from "@/hooks/useAboutParallax";
import { SECTION_HEIGHTS } from "@/lib/constants";
import UnderwaterBackground from "@/components/about/UnderwaterBackground";
import SectionTitle from "@/components/ui/SectionTitle";

gsap.registerPlugin(ScrollTrigger);

const BIO =
    "Je suis Rafael Solis Ramos, développeur fullstack en formation. " +
    "J'aime créer des interfaces qui ont quelque chose à dire — " +
    "là où le code et le design se confondent. " +
    "Curieux de tout, perfectionniste sur les détails.";

export default function AboutSection() {
    const { sectionRef } = useAboutParallax();
    const bioRef = useRef<HTMLParagraphElement>(null);

    useGSAP(() => {
        const bio = bioRef.current;
        if (!bio) return;

        // ── Reveal bio lettre par lettre ──
        const split = new SplitType(bio, { types: "chars,words" });

        gsap.from(split.chars, {
            opacity: 0,
            y: 20,
            ease: "power2.out",
            stagger: 0.35,
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top+=420 top",
                end: () => `+=${window.innerHeight * 3.5}`,
                scrub: true,
            },
        });

    }, { scope: sectionRef });

    return (
        <section
            id="about"
            ref={sectionRef}
            style={{ height: SECTION_HEIGHTS.about, position: "relative" }}
        >
            <UnderwaterBackground />

            <div className="about-sticky" style={{ position: "sticky", top: 0, height: "100vh", padding: "80px 40px" }}>
                <SectionTitle sectionRef={sectionRef} hue={200} eventPrefix="about">
                    À propos
                </SectionTitle>

                {/* Bio reveal */}
                <p
                    ref={bioRef}
                    className="about-bio font-fraunces"
                    style={{ userSelect: "none" }}
                >
                    {BIO}
                </p>
            </div>
        </section>
    );
}