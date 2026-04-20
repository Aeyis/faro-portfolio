"use client";

import Image from "next/image";
import { SECTION_HEIGHTS } from "@/lib/constants";

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="sky-gradient"
            style={{ height: SECTION_HEIGHTS.hero }}
        >
            {/* Conteneur des couches — position relative pour ancrer les absolus */}
            <div className="sticky top-0 w-full h-screen overflow-hidden">

                {/* COUCHE 1 — Fond étoilé / ciel arrière */}
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/background_stars.svg"
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* COUCHE 2 — Nuages de fond */}
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/background_cloud_1.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/background_cloud_2.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/background_cloud_3.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                {/* COUCHE 3 — Nuages avant */}
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/cloud_1.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/cloud_2.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/cloud_3.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/cloud_4.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                {/* COUCHE 4 — Mer */}
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/sea.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                {/* COUCHE 5 — Sol */}
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/sol_1.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                {/* COUCHE 6 — Phare */}
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/faro.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                {/* COUCHE 7 — Végétation gauche */}
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/trees_left.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                {/* COUCHE 8 — Ombres arbres */}
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/tree_shadow_1.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/tree_shadow_2.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/tree_shadow_3.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                {/* COUCHE 9 — Lumières arbres */}
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/tree_light_1.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                {/* COUCHE 10 — Premier plan */}
                <div className="absolute inset-0">
                    <Image
                        src="/assets/hero/tree_front.svg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>

            </div>
        </section>
    );
}
