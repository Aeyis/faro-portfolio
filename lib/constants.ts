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
    backgroundClouds: 0.08,
    cloud4: 0.13,
    cloud3: 0.17,
    cloud2: 0.22,
    cloud1: 0.28,
    sea: 0.4,
    ground: 0.5,
    faro: 0.5,
    treesBack: 0.6,
    treesMid: 0.7,
    treesFront: 0.75,
} as const;

// --------------------------------------------------------- //
// ----- Dimensions du canvas Figma ------------------------- //
// --------------------------------------------------------- //
export const CANVAS = { width: 1920, height: 1258 } as const;

// --------------------------------------------------------- //
// --------- Coordonnées Figma ----------------------------- //
// --------------------------------------------------------- //
export const HERO_LAYERS = {
    backgroundStars:  { x: -1050, y:75, w: 3800,  h: 1150 },
    backgroundCloud1: { x: 190,    y: 150,  w: 1794,    h: 1070    },
    backgroundCloud2: { x: 180,    y: 30,  w: 1694,    h: 1107.74 },
    backgroundCloud3: { x: -2885,  y: -550.96,w: 3851,    h: 2518.33 },
    cloud1:           { x: -1995,   y: -1205,   w: 6000,    h: 2800 },
    cloud2:           { x: -2100,  y: -740,   w: 6000,    h: 2200    },
    cloud3:           { x: -2200,  y: -970,   w: 5800,    h: 2500    },
    cloud4:           { x: -1500,   y: -750,   w: 5500,    h: 2500    },
    sea:              { x: -1430,  y: -900,   w: 4532,    h: 2396    },
    ground:           { x: 0,      y: 763,    w: 790,     h: 359.73  },
    faro:             { x: 228,    y: 167,    w: 255,     h: 802     },
    treesLeft:        { x: -1,     y: 187,    w: 1602,    h: 899     },
    treeShadow1:      { x: 150,     y: 0,      w: 1824,    h: 1026    },
    treeShadow2:      { x: 582,    y: 573,    w: 1346,    h: 650     },
    treeShadow3:      { x: 684,    y: 569,    w: 1247.76, h: 689.43  },
    treeLight1:       { x: 357,    y: 10,     w: 1564,    h: 880     },
    treeFront:        { x: -9,     y: 853,    w: 1920,    h: 428.01  },
} as const;