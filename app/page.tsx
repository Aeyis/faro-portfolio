import { SECTION_HEIGHTS } from "@/lib/constants";
import HeroSectionResponsive from "@/components/hero/HeroSectionResponsive";
import AboutSection from "@/components/about/AboutSection";
import StackSection from "@/components/stack/StackSection";
import ProjectsSection from "@/components/projects/ProjectsSection";
import ContactSection from "@/components/contact/ContactSection";

export default function Home() {
    return (
        <main>
            <HeroSectionResponsive />
            <section id="transition" style={{ height: SECTION_HEIGHTS.transition, marginTop: "-10vh" }} />

            <AboutSection />
            <StackSection />
            <ProjectsSection />
            <ContactSection />
        </main>
    );
}
