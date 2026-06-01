import { SECTION_HEIGHTS } from "@/lib/constants";
import HeroSectionMobile from "@/components/hero/HeroSectionMobile";
import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/about/AboutSection";
import StackSection from "@/components/stack/StackSection";
import ProjectsSection from "@/components/projects/ProjectsSection";
import ContactSection from "@/components/contact/ContactSection";

export default function Home() {
    return (
        <main>
<div className="hidden md:block"><HeroSection /></div>
            <div className="block md:hidden"><HeroSectionMobile /></div>
            <section id="transition" style={{ height: SECTION_HEIGHTS.transition, marginTop: "-10vh" }} />

            <AboutSection />
            <StackSection />
            <ProjectsSection />
            <ContactSection />
        </main>
    );
}
