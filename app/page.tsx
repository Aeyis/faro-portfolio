import { SECTION_HEIGHTS } from "@/lib/constants";
import HeroSection from "@/components/hero/HeroSection";
import BubbleCanvas from "@/components/ui/BubbleCanvas";
import AboutSection from "@/components/about/AboutSection";

export default function Home() {
    return (
        <main>
            <HeroSection />
            <section id="transition" style={{ position: "relative", height: SECTION_HEIGHTS.transition, marginTop: "-10vh", zIndex: 11 }}>
                <BubbleCanvas wave maxSize={18} speed={4} maxCount={300} spread={200} />
            </section>
            <AboutSection />
            <section id="stack" style={{ height: SECTION_HEIGHTS.stack }} />
            <section id="contact" style={{ height: SECTION_HEIGHTS.contact }} />
        </main>
    );
}
