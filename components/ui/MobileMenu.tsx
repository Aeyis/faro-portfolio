"use client";

import { useState, useEffect } from "react";

export default function MobileMenu() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onClose = () => setOpen(false);
        window.addEventListener("menu-close", onClose);
        return () => window.removeEventListener("menu-close", onClose);
    }, []);

    return (
        /* Pleine largeur, collé en bas — le border-radius crée le demi-cercle */
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
            {/* Demi-cercle indépendant — ajuste bottom pour le décaler */}
            <div style={{
                position:             "absolute",
                bottom:               -60,
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

            {/* Conteneur superposé : image hamburger Faro + SVG ham4 animé par-dessus */}
            <div style={{ position: "relative", width: 140, height: 140 }}>

                {/* Couche 1 : l'image hamburger Faro — toujours visible */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/assets/hero/LOGO_Faro_hamburger.svg"
                    alt=""
                    width={140}
                    height={140}
                    style={{ objectFit: "contain", display: "block" }}
                />

                {/* Couche 2 : le ham4 animé centré par-dessus */}
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
                        "--ham-color": "#c43a08",
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