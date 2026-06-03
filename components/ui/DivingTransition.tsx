"use client";

import { useEffect, useRef } from "react";

interface Props { height: number; }

export default function DivingTransition({ height }: Props) {
    const canvasRef  = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas  = canvasRef.current;
        const section = sectionRef.current;
        if (!canvas || !section) return;

        const ctx = canvas.getContext("2d")!;
        let W = canvas.width  = window.innerWidth;
        let H = canvas.height = height;

        const onResize = () => {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = height;
        };
        window.addEventListener("resize", onResize);

        /* ── Scroll tracking ── */
        let scrollY     = window.scrollY;
        let lastScrollY = scrollY;
        let scrollVel   = 0;
        const onScroll  = () => { scrollY = window.scrollY; };
        window.addEventListener("scroll", onScroll, { passive: true });

        /* ── Bubble class ── */
        class Bubble {
            x = 0; y = 0; r = 0; vy = 0;
            parallaxFactor = 0; wobbleAmp = 0;
            wobbleSpeed = 0; wobbleOff = 0;
            opacity = 0; frame = 0;
            burst = false; dead = false;

            constructor(burst = false) { this.init(burst); }

            init(burst = false) {
                this.burst  = burst;
                this.x      = Math.random() * W;
                this.r      = burst ? 1 + Math.random() * 8 : 2 + Math.random() * 16;
                this.vy     = burst ? -(3 + Math.random() * 9) : -(0.6 + Math.random() * 2);
                this.y      = burst ? H + this.r + Math.random() * H * 0.5
                                    : Math.random() * H * 1.5 + H * 0.2;
                this.parallaxFactor = burst ? 0.4 + Math.random() * 1.0
                                            : 0.3 + (this.r / 18) * 1.5;
                this.wobbleAmp   = 0.3 + Math.random() * 1.5;
                this.wobbleSpeed = 0.015 + Math.random() * 0.035;
                this.wobbleOff   = Math.random() * Math.PI * 2;
                this.opacity     = burst ? 0.35 + Math.random() * 0.5 : 0.12 + Math.random() * 0.45;
                this.frame       = Math.random() * 200;
                this.dead        = false;
            }

            update(vel: number) {
                this.frame++;
                this.y += this.vy;
                if (vel > 0) this.y -= vel * this.parallaxFactor * 2.2;
                if (this.y < -this.r * 3) this.dead = true;
            }

            draw() {
                const wx = this.x + Math.sin(this.frame * this.wobbleSpeed + this.wobbleOff) * this.wobbleAmp * this.r;
                const wy = this.y;
                if (wy > H + this.r || wy < -this.r * 3) return;

                ctx.save();
                ctx.globalAlpha = this.opacity;

                const g = ctx.createRadialGradient(
                    wx - this.r * 0.3, wy - this.r * 0.3, this.r * 0.05,
                    wx, wy, this.r
                );
                g.addColorStop(0,    "rgba(255,255,255,0.95)");
                g.addColorStop(0.25, "rgba(180,240,255,0.5)");
                g.addColorStop(0.7,  "rgba(80,180,240,0.12)");
                g.addColorStop(1,    "rgba(40,120,200,0.04)");

                ctx.beginPath();
                ctx.arc(wx, wy, this.r, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();

                ctx.globalAlpha = this.opacity * 0.85;
                ctx.beginPath();
                ctx.arc(wx - this.r * 0.3, wy - this.r * 0.35, this.r * 0.2, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255,255,255,0.85)";
                ctx.fill();

                ctx.globalAlpha = this.opacity * 0.22;
                ctx.beginPath();
                ctx.arc(wx, wy, this.r, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(120,210,255,0.7)";
                ctx.lineWidth = 0.5;
                ctx.stroke();

                ctx.restore();
            }
        }

        let bubbles: Bubble[] = Array.from({ length: 180 }, () => new Bubble(false));
        let burstAccum = 0;
        let waveF = 0;
        let rafId: number;

        /* ── Rayons ── */
        const RAYS = [
            { x: 0.05, w: 160, op: 0.10, delay: 0   },
            { x: 0.22, w: 220, op: 0.08, delay: 1.8  },
            { x: 0.40, w: 140, op: 0.09, delay: 0.9  },
            { x: 0.58, w: 190, op: 0.07, delay: 2.4  },
            { x: 0.75, w: 160, op: 0.09, delay: 0.4  },
            { x: 0.90, w: 120, op: 0.07, delay: 1.3  },
        ];

        function drawRays(progress: number) {
            const op = Math.max(0, 1 - progress * 1.8);
            RAYS.forEach(r => {
                const sway = Math.sin(waveF * 0.5 + r.delay) * 6;
                ctx.save();
                ctx.globalAlpha = r.op * op;
                const gx = ctx.createLinearGradient(0, 0, 0, H * 0.8);
                gx.addColorStop(0,   "rgba(180,240,255,0.9)");
                gx.addColorStop(0.6, "rgba(80,180,240,0.2)");
                gx.addColorStop(1,   "rgba(0,80,160,0)");
                ctx.beginPath();
                ctx.moveTo(W * r.x + sway - r.w / 2, 0);
                ctx.lineTo(W * r.x + sway + r.w / 2, 0);
                ctx.lineTo(W * r.x + sway * 0.3 + r.w * 0.1, H * 0.85);
                ctx.lineTo(W * r.x + sway * 0.3 - r.w * 0.1, H * 0.85);
                ctx.closePath();
                ctx.fillStyle = gx;
                ctx.filter = "blur(18px)";
                ctx.fill();
                ctx.restore();
            });
        }

function loop() {
            const dy   = scrollY - lastScrollY;
            lastScrollY = scrollY;
            scrollVel   = scrollVel * 0.75 + dy * 0.25;

            const rect     = section!.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, -rect.top / (rect.height || 1)));

            ctx.clearRect(0, 0, W, H);

            /* fond */
            const bg = ctx.createLinearGradient(0, 0, 0, H);
            bg.addColorStop(0,    "rgba(0,0,0,0)");
            bg.addColorStop(0.55, "rgba(0,0,0,0)");
            bg.addColorStop(0.72, "rgba(8,61,85,0.25)");
            bg.addColorStop(0.85, "rgba(4,37,53,0.55)");
            bg.addColorStop(1,    "rgba(2,21,32,0.85)");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);

            drawRays(progress);

            /* dégradé opacité haut — très fort pour ne pas toucher racine */
            const fadeTop = ctx.createLinearGradient(0, 0, 0, H * 0.80);
            fadeTop.addColorStop(0,    "rgba(0,0,0,1)");
            fadeTop.addColorStop(0.50, "rgba(0,0,0,1)");
            fadeTop.addColorStop(0.70, "rgba(0,0,0,0.92)");
            fadeTop.addColorStop(0.88, "rgba(0,0,0,0.5)");
            fadeTop.addColorStop(1,    "rgba(0,0,0,0)");
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = fadeTop;
            ctx.fillRect(0, 0, W, H * 0.80);
            ctx.globalCompositeOperation = "source-over";

            /* burst */
            if (scrollVel > 2) {
                burstAccum += scrollVel * 0.7;
                const nb = Math.floor(burstAccum);
                burstAccum -= nb;
                for (let i = 0; i < nb; i++) bubbles.push(new Bubble(true));
            }

            /* maintien pool + nettoyage */
            bubbles = bubbles.filter(b => !b.dead);
            while (bubbles.filter(b => !b.burst).length < 180) {
                const b = new Bubble(false);
                b.y = H + b.r + Math.random() * H;
                bubbles.push(b);
            }
            if (bubbles.length > 700) bubbles.splice(0, bubbles.length - 700);

            bubbles.forEach(b => { b.update(scrollVel); b.draw(); });

            /* vignette */
            const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.85);
            vg.addColorStop(0, "rgba(0,20,40,0)");
            vg.addColorStop(1, `rgba(0,8,18,${0.1 + progress * 0.4})`);
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, W, H);

            /* dégradé opacité bas */
            const fadeBot = ctx.createLinearGradient(0, H * 0.75, 0, H);
            fadeBot.addColorStop(0, "rgba(0,0,0,0)");
            fadeBot.addColorStop(1, "rgba(0,0,0,1)");
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = fadeBot;
            ctx.fillRect(0, H * 0.75, W, H * 0.25);
            ctx.globalCompositeOperation = "source-over";

            rafId = requestAnimationFrame(loop);
        }

        loop();

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll);
        };
    }, [height]);

    return (
        <div ref={sectionRef} style={{ position: "relative", width: "100%", height }}>
            <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
        </div>
    );
}
