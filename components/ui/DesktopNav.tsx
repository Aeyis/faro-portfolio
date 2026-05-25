"use client";

import LogoFaro from "./LogoFaro";

const NAV_ITEMS = [
    { name: "À propos", href: "#about"   },
    { name: "Stack",    href: "#stack"   },
    { name: "Projets",  href: "#projets" },
    { name: "Contact",  href: "#contact" },
];

export default function DesktopNav() {
    return (
        <>
            <a href="#hero" className="dnav-logo" aria-label="Accueil">
                <LogoFaro size={60} />
            </a>

            <nav className="dnav-pill">
                {NAV_ITEMS.map(item => (
                    <a key={item.name} href={item.href} className="dnav-link">
                        {item.name}
                    </a>
                ))}
            </nav>
        </>
    );
}