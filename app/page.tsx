import { SECTION_HEIGHTS } from "@/lib/constants";

export default function Home() {
  return (
      <main>
        <section
            id="hero"
            style={{ height: SECTION_HEIGHTS.hero }}
        />
        <section
            id="transition"
            style={{ height: SECTION_HEIGHTS.transition }}
        />
        <section
            id="about"
            style={{ height: SECTION_HEIGHTS.about }}
        />
        <section
            id="stack"
            style={{ height: SECTION_HEIGHTS.stack }}
        />
        <section
            id="contact"
            style={{ height: SECTION_HEIGHTS.contact }}
        />
      </main>
  );
}