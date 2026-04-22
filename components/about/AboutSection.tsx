"use client";

import { useAboutParallax } from "@/hooks/useAboutParallax";
import { SECTION_HEIGHTS } from "@/lib/constants";

export default function AboutSection() {
    const { sectionRef } = useAboutParallax();

    return (
        <section
            id="about"
            ref={sectionRef}
            style={{ height: SECTION_HEIGHTS.about }}
        >
        </section>
    );
}