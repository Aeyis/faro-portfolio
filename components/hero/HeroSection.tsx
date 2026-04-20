"use client";

import { SECTION_HEIGHTS } from "@/lib/constants";

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="sky-gradient"
            style={{ height: SECTION_HEIGHTS.hero }}
        />
    )
}