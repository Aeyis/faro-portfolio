"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/dive-menu.css";

const NAV_ITEMS = [
    { depth: "0 m",   name: "Accueil",  zone: "Surface · Zone épipélagique", pressure: "1.0 bar", temp: "26 °C", href: "#hero"    },
    { depth: "−12 m", name: "À propos", zone: "Zone peu profonde",           pressure: "2.2 bar", temp: "22 °C", href: "#about"   },
    { depth: "−22 m", name: "Stack",    zone: "Zone mésopélagique",          pressure: "3.2 bar", temp: "18 °C", href: "#stack"   },
    { depth: "−34 m", name: "Projets",  zone: "Zone crépusculaire",          pressure: "4.4 bar", temp: "14 °C", href: "#projets" },
    { depth: "−40 m", name: "Contact",  zone: "Fond · Profondeur maximale",  pressure: "5.0 bar", temp: "10 °C", href: "#contact" },
];

export default function DiveMenu() {
    const [open, setOpen] = useState(false);
    const bubblesRef      = useRef<HTMLDivElement>(null);
    const navRef          = useRef<HTMLElement>(null);

    useEffect(() => {
        const onToggle = () => setOpen(o => !o);
        const onClose  = () => setOpen(false);
        window.addEventListener("menu-toggle", onToggle);
        window.addEventListener("menu-close",  onClose);
        return () => {
            window.removeEventListener("menu-toggle", onToggle);
            window.removeEventListener("menu-close",  onClose);
        };
    }, []);

    useEffect(() => {
        const ids = ["hero", "about", "stack", "projets", "contact"];
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting)
                        navRef.current?.setAttribute("data-section", entry.target.id);
                });
            },
            { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
        );
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const container = bubblesRef.current;
        if (!container || container.children.length > 0) return;
        for (let i = 0; i < 12; i++) {
            const b    = document.createElement("div");
            b.className = "bubble";
            const size  = 3 + Math.random() * 6;
            b.style.cssText = [
                `width:${size}px`,
                `height:${size}px`,
                `left:${5 + Math.random() * 88}%`,
                `bottom:-10px`,
                `animation-duration:${5 + Math.random() * 6}s`,
                `animation-delay:${Math.random() * 8}s`,
            ].join(";");
            container.appendChild(b);
        }
    }, []);

    const close = () => {
        setOpen(false);
        window.dispatchEvent(new Event("menu-close"));
    };

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <nav ref={navRef} className={`dive-overlay${open ? " open" : ""}`} aria-hidden={!open} data-section="hero">
            <div className="overlay-bg" />

            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            <div className="bubbles" ref={bubblesRef} />

            <div className="depth-layout">
                <div className="nav-list">
                    {NAV_ITEMS.map(item => (
                        <a key={item.name} href={item.href} className="nav-item" onClick={close}>
                            <div className="depth-bar" />
                            <div className="card-body">
                                <span className="depth-badge">{item.depth}</span>
                                <div className="card-divider" />
                                <div className="card-text">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-zone">{item.zone}</span>
                                </div>
                                <div className="card-right">
                                    <span className="pressure">{item.pressure}</span>
                                    <span className="temp">{item.temp}</span>
                                </div>
                            </div>
                            <span className="arrow">→</span>
                        </a>
                    ))}
                </div>
            </div>


        </nav>
    );
}