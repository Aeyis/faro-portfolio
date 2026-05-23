import { SECTION_HEIGHTS } from "@/lib/constants";
import HeroSectionMobile from "@/components/hero/HeroSectionMobile";
import HeroSection from "@/components/hero/HeroSection";
import BubbleCanvas from "@/components/ui/BubbleCanvas";  // ← option A : bulles
import WaveTransition from "@/components/ui/WaveTransition"; // ← option B : vague
import AboutSection from "@/components/about/AboutSection";

export default function Home() {
    return (
        <main>
            <div className="hidden md:block"><HeroSection /></div>
            <div className="block md:hidden"><HeroSectionMobile /></div>
            {/* Option A — bulles */}
            <section id="transition" style={{ position: "relative", height: SECTION_HEIGHTS.transition, marginTop: "-10vh", zIndex: 11 }}>
                <BubbleCanvas wave maxSize={18} speed={4} maxCount={300} spread={200} />
            </section>

            {/* Option B — vague */}
            {/* <WaveTransition sectionHeight={SECTION_HEIGHTS.transition} /> */}

            <AboutSection />
            <section id="stack" style={{ height: SECTION_HEIGHTS.stack }} />
            <section id="contact" style={{ height: SECTION_HEIGHTS.contact }} />
        </main>
    );
}
