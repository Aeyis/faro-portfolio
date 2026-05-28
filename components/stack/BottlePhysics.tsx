'use client';

import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

interface Props {
  bottleSrc: string;
  items: string[];
  bl?: number;
  br?: number;
  bt?: number;
  bb?: number;
  onShake?: () => void;
}

const W = 552;
const H = 1380;

export default function BottlePhysics({ bottleSrc, items, bl = 120, br = 340, bt = 300, bb = 840, onShake }: Props) {
  const CW = br - bl;
  const CH = bb - bt;
  const sceneRef  = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grabbed   = useRef(false);
  const prevPos   = useRef({ x: 0, y: 0 });
  const curTilt   = useRef(0);
  const curTiltY  = useRef(0);
  const rafId      = useRef<number | null>(null);
  const lastDir    = useRef(0);
  const shakeCount = useRef(0);
  const lastShakeT = useRef(0);
  const onShakeRef = useRef(onShake);
  useEffect(() => { onShakeRef.current = onShake; }, [onShake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene  = sceneRef.current;
    if (!canvas || !scene) return;

    const { Engine, Render, Runner, Bodies, Body, World, Events } = Matter;

    const engine = Engine.create({
      gravity:            { x: 0, y: 1.2 },
      positionIterations: 12,
      velocityIterations: 10,
    });

    const render = Render.create({
      canvas,
      engine,
      options: { width: CW, height: CH, background: 'transparent', wireframes: false },
    });
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const T  = 40;
    const sw = { isStatic: true, render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 } };
    World.add(engine.world, [
      Bodies.rectangle(CW / 2,     CH + T / 2,  CW + 20, T,  sw),
      Bodies.rectangle(-T / 2,     CH / 2,       T,       CH, sw),
      Bodies.rectangle(CW + T / 2, CH / 2,       T,       CH, sw),
      Bodies.rectangle(CW / 2,     -T / 2,       CW,      T,  sw),
    ]);

    const r     = 20;
    const scale = (r * 2) / 128;
    const bodies = items.slice(0, 12).map((src, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x   = (CW / 4) * (col + 1) + (Math.random() - 0.5) * 10;
      const y   = r + row * (r * 2 + 10) + (Math.random() - 0.5) * 6;
      return Bodies.circle(x, y, r, {
        restitution: 0.25,
        friction:    0.08,
        frictionAir: 0.018,
        render: { sprite: { texture: src, xScale: scale, yScale: scale } },
      });
    });
    World.add(engine.world, bodies);

    const MAX_SPEED = 14, MAX_ANG = 0.5;
    Events.on(engine, 'beforeUpdate', () => {
      bodies.forEach(b => {
        const v = b.velocity;
        const s = Math.sqrt(v.x * v.x + v.y * v.y);
        if (s > MAX_SPEED) Body.setVelocity(b, { x: v.x / s * MAX_SPEED, y: v.y / s * MAX_SPEED });
        if (Math.abs(b.angularVelocity) > MAX_ANG) Body.setAngularVelocity(b, Math.sign(b.angularVelocity) * MAX_ANG);
      });
    });

    const getPos = (e: MouseEvent | TouchEvent) =>
      'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
                     : { x: e.clientX, y: e.clientY };

    const onStart = (e: MouseEvent | TouchEvent) => {
      grabbed.current    = true;
      prevPos.current    = getPos(e);
      lastDir.current    = 0;
      shakeCount.current = 0;
      lastShakeT.current = Date.now();
      if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null; }
      e.preventDefault();
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!grabbed.current) return;
      const { x, y } = getPos(e);
      const dx = x - prevPos.current.x;
      const dy = y - prevPos.current.y;
      prevPos.current = { x, y };

      bodies.forEach(b => {
        Body.setVelocity(b, { x: b.velocity.x + dx * 0.3, y: b.velocity.y + dy * 0.3 });
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5)
          Body.setAngularVelocity(b, b.angularVelocity + (Math.random() - 0.5) * 0.07);
      });

      if (Math.abs(dx) > 6) {
        const dir = dx > 0 ? 1 : -1;
        const now = Date.now();
        if (now - lastShakeT.current > 1000) {
          // trop lent : reset
          lastDir.current    = dir;
          shakeCount.current = 0;
          lastShakeT.current = now;
        } else if (lastDir.current === 0) {
          // première direction
          lastDir.current    = dir;
          lastShakeT.current = now;
        } else if (dir !== lastDir.current) {
          // inversion détectée
          shakeCount.current++;
          lastShakeT.current = now;
          lastDir.current    = dir;
          if (shakeCount.current >= 6) { shakeCount.current = 0; onShakeRef.current?.(); }
        }
      }

      curTilt.current  = curTilt.current  * 0.6 + Math.max(-18, Math.min(18, dx * 1.4)) * 0.4;
      curTiltY.current = curTiltY.current * 0.6 + Math.max(-30, Math.min(30, dy * 1.2)) * 0.4;
      scene.style.rotate    = `${curTilt.current}deg`;
      scene.style.transform = `translateY(${curTiltY.current}px)`;
      e.preventDefault();
    };

    const onEnd = () => {
      if (!grabbed.current) return;
      grabbed.current = false;
      const spring = () => {
        curTilt.current  *= 0.87;
        curTiltY.current *= 0.87;
        scene.style.rotate    = `${curTilt.current}deg`;
        scene.style.transform = `translateY(${curTiltY.current}px)`;
        if (Math.abs(curTilt.current) > 0.05 || Math.abs(curTiltY.current) > 0.05) {
          rafId.current = requestAnimationFrame(spring);
        } else {
          scene.style.rotate    = '0deg';
          scene.style.transform = '';
          curTilt.current  = 0;
          curTiltY.current = 0;
          rafId.current    = null;
        }
      };
      rafId.current = requestAnimationFrame(spring);
    };

    scene.addEventListener('mousedown',  onStart as EventListener);
    window.addEventListener('mousemove', onMove  as EventListener);
    window.addEventListener('mouseup',   onEnd);
    scene.addEventListener('touchstart', onStart as EventListener, { passive: false });
    window.addEventListener('touchmove', onMove  as EventListener, { passive: false });
    window.addEventListener('touchend',  onEnd);

    return () => {
      scene.removeEventListener('mousedown',  onStart as EventListener);
      window.removeEventListener('mousemove', onMove  as EventListener);
      window.removeEventListener('mouseup',   onEnd);
      scene.removeEventListener('touchstart', onStart as EventListener);
      window.removeEventListener('touchmove', onMove  as EventListener);
      window.removeEventListener('touchend',  onEnd);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      World.clear(engine.world, false);
      Engine.clear(engine);
      Render.stop(render);
      Runner.stop(runner);
    };
  }, [bl, br, bt, bb]);

  return (
    <div
      ref={sceneRef}
      style={{
        position:        'relative',
        width:            W,
        height:           H,
        cursor:          'grab',
        userSelect:      'none',
        transformOrigin: 'center 72%',
        willChange:      'transform',
      }}
    >
      <img
        src={bottleSrc}
        alt=""
        width={W}
        height={H}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none', display: 'block' }}
      />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', left: bl, top: bt, zIndex: 2 }}
      />
    </div>
  );
}