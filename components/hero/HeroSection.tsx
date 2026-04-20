"use client";

import Image from "next/image";
import { SECTION_HEIGHTS, HERO_LAYERS } from "@/lib/constants";
import { figmaToCSS } from "@/lib/utils";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import StarsBackground from "./StarsBackground";

export default function HeroSection() {
  const {
    sectionRef,
    starsRef,
    bgCloud1Ref,
    bgCloud2Ref,
    cloud1Ref,
    cloud2Ref,
    cloud3Ref,
    cloud4Ref,
    seaRef,
    seaInnerRef,
    groundRef,
    faroRef,
    treesLeftRef,
    treeShadow1Ref,
    treeShadow2Ref,
    treeShadow3Ref,
    treeLight1Ref,
    treeFrontRef,
  } = useHeroParallax();

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{ height: SECTION_HEIGHTS.hero }}
    >
      <div className="sky-gradient sticky top-0 w-full h-screen overflow-hidden">

        {/* COUCHE 1 — Étoiles CSS animées */}
        <div ref={starsRef} style={{ position: "absolute", inset: 0, zIndex: -1 }}>
          <StarsBackground />
        </div>

        {/* COUCHE 2 — Nuages de fond */}
        <div ref={bgCloud1Ref} style={{ ...figmaToCSS(HERO_LAYERS.backgroundCloud1), left: 0, zIndex: -2 }}>
          <div className="cloud-drift-1" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/background_cloud_1.svg" alt="" fill />
          </div>
        </div>
        <div ref={bgCloud2Ref} style={{ ...figmaToCSS(HERO_LAYERS.backgroundCloud2), left: 0, zIndex: -3 }}>
          <div className="cloud-drift-2" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/background_cloud_2.svg" alt="" fill />
          </div>
        </div>

        {/* COUCHE 3 — Nuages avant */}
        <div ref={cloud1Ref} style={{ ...figmaToCSS(HERO_LAYERS.cloud1), zIndex: 3 }}>
          <Image src="/assets/hero/cloud_1.svg" alt="" fill />
        </div>
        <div ref={cloud2Ref} style={{ ...figmaToCSS(HERO_LAYERS.cloud2), zIndex: 2 }}>
          <Image src="/assets/hero/cloud_2.svg" alt="" fill />
        </div>
        <div ref={cloud3Ref} style={{ ...figmaToCSS(HERO_LAYERS.cloud3), zIndex: 1 }}>
          <Image src="/assets/hero/cloud_3.svg" alt="" fill />
        </div>
        <div ref={cloud4Ref} style={{ ...figmaToCSS(HERO_LAYERS.cloud4), zIndex: 0 }}>
          <Image src="/assets/hero/cloud_4.svg" alt="" fill />
        </div>

        {/* COUCHE 4 — Mer */}
        <div ref={seaRef} style={{ ...figmaToCSS(HERO_LAYERS.sea), zIndex: 4 }}>
          <div className="sea-sway" style={{ position: "absolute", inset: "0 -40px" }}>
            <Image src="/assets/hero/sea.svg" alt="" fill />
          </div>
        </div>

        {/* COUCHE 5 — Sol */}
        <div ref={groundRef} style={{
          position: "absolute",
          bottom: "0.7vw",
          left: "-2vw",
          width: "100vw",
          height: "55vw",
          zIndex: 5,
        }}>
          <Image src="/assets/hero/ground_1.svg" alt="" fill />
        </div>

        {/* COUCHE 6 — Phare */}
        <div ref={faroRef} style={{ ...figmaToCSS(HERO_LAYERS.faro), zIndex: 6, top: "15%" }}>
          <Image src="/assets/hero/faro.svg" alt="" fill />
        </div>

        {/* COUCHE 7 — Végétation gauche */}
        <div ref={treesLeftRef} style={{
          position: "absolute",
          bottom: "-11vw",
          left: "-0.5vw",
          width: "83.44vw",
          height: "71.46vw",
          zIndex: 7,
        }}>
          <div className="tree-sway" style={{ position: "absolute", inset: 0 }}>
            <Image src="/assets/hero/trees_left.svg" alt="" fill />
          </div>
        </div>

        {/* COUCHE 8 — Ombres arbres */}
        <div ref={treeShadow1Ref} style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "70vw",
          height: "40vw",
          zIndex: 8,
        }}>
          <Image src="/assets/hero/tree_shadow_1.svg" alt="" fill />
        </div>
        <div ref={treeShadow2Ref} style={{
          position: "absolute",
          bottom: "0vw",
          right: "-10vw",
          width: "70.1vw",
          height: "33.85vw",
          zIndex: 8,
        }}>
          <Image src="/assets/hero/tree_shadow_2.svg" alt="" fill />
        </div>
        <div ref={treeShadow3Ref} style={{
          position: "absolute",
          bottom: "-2vw",
          right: 0,
          width: "95vw",
          height: "52vw",
          zIndex: 9,
        }}>
          <Image src="/assets/hero/tree_shadow_3.svg" alt="" fill />
        </div>

        {/* COUCHE 9 — Lumières arbres */}
        <div ref={treeLight1Ref} style={{
          position: "absolute",
          top: "-1vw",
          right: "4vw",
          width: "70vw",
          height: "40vw",
          zIndex: 7,
        }}>
          <Image src="/assets/hero/tree_light_1.svg" alt="" fill />
        </div>

        {/* COUCHE 10 — Premier plan */}
        <div ref={treeFrontRef} style={{
          position: "absolute",
          bottom: "-6.5vw",
          left: 0,
          width: "100%",
          height: "22.3vw",
          zIndex: 10,
        }}>
          <Image src="/assets/hero/tree_front.svg" alt="" fill />
        </div>
      </div>
    </section>
  );
}