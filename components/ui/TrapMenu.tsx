"use client";

import { useState, useEffect } from "react";
import "@/styles/trap-menu.css";

const NAV_ITEMS = [
    { depth: "0 m",   name: "Accueil",  href: "#hero"    },
    { depth: "−12 m", name: "À propos", href: "#about"   },
    { depth: "−22 m", name: "Stack",    href: "#stack"   },
    { depth: "−34 m", name: "Projets",  href: "#projets" },
    { depth: "−40 m", name: "Contact",  href: "#contact" },
];

export default function TrapMenu() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onToggle = () => setOpen(o => !o);
        const onClose  = () => setOpen(false);
        const onKey    = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };

        window.addEventListener("menu-toggle", onToggle);
        window.addEventListener("menu-close",  onClose);
        window.addEventListener("keydown",     onKey);
        return () => {
            window.removeEventListener("menu-toggle", onToggle);
            window.removeEventListener("menu-close",  onClose);
            window.removeEventListener("keydown",     onKey);
        };
    }, []);

    const close = () => {
        setOpen(false);
        window.dispatchEvent(new Event("menu-close"));
    };

    return (
        <>
            {/* Fond assombri */}
            <div
                className={`trap-overlay${open ? " open" : ""}`}
                onClick={close}
                aria-hidden="true"
            />

            {/* Panel */}
            <nav
                className={`trap-panel${open ? " open" : ""}`}
                aria-hidden={!open}
            >
                <div className="trap-inner">
                    {NAV_ITEMS.map(item => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="tp-link"
                            onClick={close}
                        >
                            <span className="tp-name">{item.name}</span>
                            <div className="tp-right">
                                <span className="tp-depth">{item.depth}</span>
                                <span className="tp-arrow">→</span>
                            </div>
                        </a>
                    ))}
                </div>
            </nav>
        </>
    );
}