"use client"

export default function LighthouseBeam() {
    return (
        <div style={{
            position: "absolute",
            left: "19%",
            top: "18%",
            width: 0,
            height: 0,
            zIndex: 6,
            transformOrigin: "0% 0%",
            animation: "beam-rotate 6s linear infinite",
        }}>
            {/* Beam */}
            <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "60vw",
                height: "8vw",
                background: "linear-gradient(to right, rgba(255,240,180,0.25), transparent)",
                transformOrigin: "0% 50%",
                clipPath: "polygon(0 50%, 100% 0%, 100% 100%)",
            }} />
        </div>
    )
}