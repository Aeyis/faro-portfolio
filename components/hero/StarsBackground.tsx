"use client";

import { useState, useEffect } from "react";

function generateBoxShadows(n: number): string {
  const shadows: string[] = [];
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    shadows.push(`${x}px ${y}px #FFF`);
  }
  return shadows.join(", ");
}

export default function StarsBackground() {
  const [shadows, setShadows] = useState({ small: "", medium: "", big: "" });

  useEffect(() => {
    setShadows({
      small:  generateBoxShadows(700),
      medium: generateBoxShadows(200),
      big:    generateBoxShadows(100),
    });
  }, []);

  if (!shadows.small) return null;

  return (
    <>
      <style>{`
        @keyframes animStar {
          from { transform: translateY(0px); }
          to   { transform: translateY(-2000px); }
        }
        .stars-s {
          width: 1px; height: 1px; background: transparent;
          box-shadow: ${shadows.small};
          animation: animStar 400s linear infinite;
        }
        .stars-s::after {
          content: " "; position: absolute; top: 2000px; left: 0;
          width: 1px; height: 1px; background: transparent;
          box-shadow: ${shadows.small};
        }
        .stars-m {
          width: 2px; height: 2px; background: transparent;
          box-shadow: ${shadows.medium};
          animation: animStar 600s linear infinite;
        }
        .stars-m::after {
          content: " "; position: absolute; top: 2000px; left: 0;
          width: 2px; height: 2px; background: transparent;
          box-shadow: ${shadows.medium};
        }
        .stars-l {
          width: 3px; height: 3px; background: transparent;
          box-shadow: ${shadows.big};
          animation: animStar 900s linear infinite;
        }
        .stars-l::after {
          content: " "; position: absolute; top: 2000px; left: 0;
          width: 3px; height: 3px; background: transparent;
          box-shadow: ${shadows.big};
        }
      `}</style>
      <div className="stars-s" style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }} />
      <div className="stars-m" style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }} />
      <div className="stars-l" style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }} />
    </>
  );
}