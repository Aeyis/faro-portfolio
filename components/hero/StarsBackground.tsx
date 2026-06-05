"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; alpha: number; phase: number; speed: number };

export default function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    const ZONE = H * 0.72;

    const stars: Star[] = Array.from({ length: window.innerWidth < 768 ? 250 : 700 }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * ZONE,
      r:     Math.random() * 1.2 + 0.5,
      alpha: Math.random() * 0.4 + 0.4,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 1.5 + 0.5,
    }));

    let offset    = 0;
    let lastTime  = 0;
    let raf: number;

    const SPEED = 3; // pixels par seconde

    const draw = (now: number) => {
      const delta = lastTime ? (now - lastTime) / 1000 : 0;
      lastTime = now;

      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        const y       = ((s.y - offset) % ZONE + ZONE) % ZONE;
        const twinkle = s.alpha + Math.sin(now * 0.001 * s.speed + s.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, twinkle))})`;
        ctx.fill();
      }
      offset += SPEED * delta;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
