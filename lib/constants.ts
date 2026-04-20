// --------------------------------------------------------- //
// ------------------COULEURS------------------------------- //
// --------------------------------------------------------- //
export const COLORS = {
    skyTop: "#0a0f1e",
    skyHorizon: "#c45c1a",
    skyMid: "#1a2a4a",
    sea: "#0d4a4a",
    ground: "#0a0f0a",
} as const;

// --------------------------------------------------------- //
// ---------------- HAUTEUR DES SECTIONS (px) -------------- //
// --------------------------------------------------------- //
export const SECTION_HEIGHTS = {
    hero: 4000,
    transition: 1500,
    about: 1000,
    stack: 1000,
    contact: 800,
} as const;
// --------------------------------------------------------- //
// ----- VITESSE PARALLAX (0=fixe, 1= vitesse scroll) ------- //
// --------------------------------------------------------- //
export const PARALLAX_SPEEDS = {
    stars: 0.05,
    backgroundClouds: 0.1,
    clouds: 0.2,
    sea: 0.4,
    ground: 0.5,
    faro: 0.5,
    treesBack: 0.6,
    treesMid: 0.7,
    treesFront: 0.9,
} as const;
