"use client";

import { useState, useEffect } from "react";

/* Couleur sombre du ham4 — mêmes valeurs que LogoIntro desktop */
const SECTION_COLORS: Record<string, string> = {
    hero:    "#c43a08",
    about:   "#020818",
    stack:   "#021a06",
    projets: "#150820",
    contact: "#1a0a04",
};

/* Filtre CSS sur l'image SVG — mêmes valeurs que LogoIntro desktop */
const SECTION_FILTERS: Record<string, string> = {
    hero:    "none",
    about:   "hue-rotate(160deg) saturate(1.5) brightness(1.1)",
    stack:   "hue-rotate(100deg) saturate(3.5) brightness(1.0)",
    projets: "hue-rotate(255deg) saturate(2.5) brightness(1.05)",
    contact: "hue-rotate(10deg)  saturate(1.2) brightness(1.1)",
};

function getCurrentSection(): string {
    if (window.scrollY < 100) return "hero";
    const mid = window.innerHeight / 2;
    const ids = ["contact", "projets", "stack", "about", "hero"];
    for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= 0) return id;
    }
    return "hero";
}

export default function MobileMenu() {
    const [open,      setOpen]      = useState(false);
    const [hamColor,  setHamColor]  = useState("#c43a08");
    const [imgFilter, setImgFilter] = useState("none");

    useEffect(() => {
        const onClose = () => setOpen(false);
        window.addEventListener("menu-close", onClose);
        return () => window.removeEventListener("menu-close", onClose);
    }, []);

    /* Tracking de la section visible → couleur du hamburger */
    useEffect(() => {
        const update = () => {
            const section = getCurrentSection();
            setHamColor(SECTION_COLORS[section]  ?? "#c43a08");
            setImgFilter(SECTION_FILTERS[section] ?? "none");
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, []);

    return (
        <button
            aria-label="Menu"
            className="mobile-menu-btn"
            onClick={() => {
                setOpen(o => !o);
                window.dispatchEvent(new Event("menu-toggle"));
            }}
            style={{
                position:       "fixed",
                bottom:         16,
                left:           0,
                right:          0,
                zIndex:         99999,
                border:         "none",
                cursor:         "pointer",
                background:     "transparent",
                paddingTop:     0,
                paddingBottom:  0,
                touchAction:    "manipulation",
                justifyContent: "center",
            }}
        >
            {/* Demi-cercle */}
            <div className="mobile-menu-demi" style={{
                position:             "absolute",
                bottom:               -40,
                left:                 0,
                right:                0,
                height:               "100%",
                backgroundImage:      "radial-gradient(ellipse 100% 100% at 50% 100%, rgba(4,10,18,0.90) 60%, transparent 100%)",
                backdropFilter:       "blur(32px) saturate(1.5)",
                WebkitBackdropFilter: "blur(32px) saturate(1.5)",
                borderRadius:         "50% 50% 0 0 / 40% 40% 0 0",
                zIndex:               -1,
                pointerEvents:        "none",
                opacity:              open ? 0 : 1,
                transition:           "opacity 0.3s ease",
            }} />

            <div className="mobile-menu-logo" style={{ position: "relative", width: 140, height: 140 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/assets/hero/LOGO_Faro_hamburger.svg"
                    alt=""
                    width={140}
                    height={140}
                    style={{ objectFit: "contain", display: "block", filter: imgFilter, transition: "filter 0.4s ease" }}
                />

                <svg
                    className={`ham-btn ham4${open ? " active" : ""}`}
                    viewBox="0 0 100 100"
                    width={42}
                    height={42}
                    style={{
                        position:  "absolute",
                        top:       "50%",
                        left:      "50%",
                        transform: open
                            ? "translate(-50%, calc(-50% + 25px)) rotate(45deg)"
                            : "translate(-50%, calc(-50% + 25px))",
                        "--ham-color": hamColor,
                        transition: "all 0.4s ease",
                    } as React.CSSProperties}
                >
                    <path className="line top"    d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20" />
                    <path className="line middle" d="m 70,50 h -40" />
                    <path className="line bottom" d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20" />
                </svg>
            </div>
        </button>
    );
}
