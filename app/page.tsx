import { SECTION_HEIGHTS } from "@/lib/constants";
import HeroSection from "@/components/hero/HeroSection";

export default function Home() {
    return (
        <main>
            <HeroSection />
            <section id="transition" style={{ height: SECTION_HEIGHTS.transition }} />
            <section id="about" style={{ height: SECTION_HEIGHTS.about }} />
            <section id="stack" style={{ height: SECTION_HEIGHTS.stack }} />
            <section id="contact" style={{ height: SECTION_HEIGHTS.contact }} />
        </main>
    );
}
