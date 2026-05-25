"use client";

import { useRef } from "react";
import { SECTION_HEIGHTS } from "@/lib/constants";
import SectionTitle from "@/components/ui/SectionTitle";

export default function StackSection() {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section
            id="stack"
            ref={sectionRef}
            style={{ height: SECTION_HEIGHTS.stack, position: "relative" }}
        >
            <div style={{ position: "sticky", top: 0, height: "100vh", padding: "80px 40px" }}>
                <SectionTitle sectionRef={sectionRef} hue={155} eventPrefix="stack">
                    Stacks
                </SectionTitle>
            </div>
        </section>
    );
}