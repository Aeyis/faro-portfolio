"use client";

export default function MobileMenuButton() {
    return (
        <button
            aria-label="Menu"
            onClick={() => window.dispatchEvent(new Event("menu-toggle"))}
            style={{
                position:        "fixed",
                top:             16,
                right:           16,
                zIndex:          200,
                width:           44,
                height:          44,
                display:         "flex",
                flexDirection:   "column",
                alignItems:      "center",
                justifyContent:  "center",
                gap:             6,
                background:      "transparent",
                border:          "none",
                cursor:          "pointer",
                padding:         0,
            }}
            className="md:hidden"
        >
            <span style={{ width: 26, height: 2, background: "#fff", borderRadius: 2, display: "block" }} />
            <span style={{ width: 26, height: 2, background: "#fff", borderRadius: 2, display: "block" }} />
            <span style={{ width: 18, height: 2, background: "#fff", borderRadius: 2, display: "block", alignSelf: "flex-start", marginLeft: 4 }} />
        </button>
    );
}
