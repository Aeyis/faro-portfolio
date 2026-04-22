'use client'

import { useEffect, useRef } from 'react'

/* ============================================================
   BUBBLE CANVAS — Panache de bulles qui remontent
   Utilisé comme transition entre le Hero et la section underwater

   Usage :
   <BubbleCanvas />

   Props optionnelles :
   - density  : nombre de bulles émises par cycle (défaut 3)
   - maxSize  : taille max d'une bulle en px (défaut 120)
   - speed    : vitesse de montée (défaut 4)
   - spread   : rayon horizontal du panache (défaut 80)
   - maxCount : plafond total de bulles (défaut 120)
============================================================ */

interface BubbleCanvasProps {
  density?:  number
  maxSize?:  number
  speed?:    number
  spread?:   number
  maxCount?: number
  wave?:     boolean  // mode vague unique : toutes les bulles partent en même temps
}

export default function BubbleCanvas({
  density  = 3,
  maxSize  = 120,
  speed    = 4,
  spread   = 80,
  maxCount = 120,
  wave     = false,
}: BubbleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    /* ---- Resize ---- */
    function resize() {
      if (!canvas) return
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    /* ---- Paramètres ---- */
    const P = { density, maxSize, speed, spread }

    /* ============================================================
       DESSIN D'UNE BULLE
       Reproduit le SVG Bubulles02 : gradient teal, reflets blancs
    ============================================================ */
    function drawBubble(
      x: number, y: number, r: number,
      alpha: number, wobble: number, wobblePhase: number,
      isLarge: boolean = false
    ) {
      /* Petites bulles : dessin simplifié pour les performances */
      if (!isLarge && r < 12) {
        ctx!.save()
        ctx!.globalAlpha = alpha
        ctx!.beginPath()
        ctx!.arc(x, y, r, 0, Math.PI * 2)
        ctx!.fillStyle = 'rgba(40,140,120,0.85)'
        ctx!.fill()
        ctx!.strokeStyle = `rgba(255,255,255,${alpha * 0.4})`
        ctx!.lineWidth = 0.6
        ctx!.stroke()
        ctx!.restore()
        return
      }

      ctx!.save()
      ctx!.globalAlpha = alpha

      /* Halo lumineux sur les grandes bulles (sans shadowBlur) */
      if (isLarge && r > 30) {
        const halo = ctx!.createRadialGradient(x, y, r * 0.6, x, y, r * 1.8)
        halo.addColorStop(0,   `rgba(69,180,146,${alpha * 0.18})`)
        halo.addColorStop(1,   'rgba(69,180,146,0)')
        ctx!.beginPath()
        ctx!.arc(x, y, r * 1.8, 0, Math.PI * 2)
        ctx!.fillStyle = halo
        ctx!.fill()
      }

      /* Contour avec ondulation optionnelle */
      ctx!.beginPath()
      if (wobble > 0) {
        const steps = 12
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2
          const bump  = 1
            + wobble * Math.sin(angle * 3 + wobblePhase)
            + wobble * 0.5 * Math.sin(angle * 5 - wobblePhase * 1.3)
          const rx = x + Math.cos(angle) * r * bump
          const ry = y + Math.sin(angle) * r * bump
          i === 0 ? ctx!.moveTo(rx, ry) : ctx!.lineTo(rx, ry)
        }
        ctx!.closePath()
      } else {
        ctx!.arc(x, y, r, 0, Math.PI * 2)
      }

      /* Corps gradient teal */
      const grd = ctx!.createRadialGradient(x - r * 0.15, y - r * 0.15, r * 0.05, x, y, r)
      grd.addColorStop(0,   'rgba(69,180,146,0.9)')
      grd.addColorStop(0.5, 'rgba(10,80,80,0.85)')
      grd.addColorStop(1,   'rgba(4,40,48,0.9)')
      ctx!.fillStyle = grd
      ctx!.fill()

      /* Bordure blanche */
      ctx!.strokeStyle = `rgba(255,255,255,${alpha * 0.55})`
      ctx!.lineWidth   = Math.max(0.8, r * 0.04)
      ctx!.stroke()

      /* Reflet principal (haut) */
      ctx!.save()
      ctx!.beginPath()
      ctx!.ellipse(x, y - r * 0.42, r * 0.48, r * 0.26, 0, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(239,247,246,${alpha * 0.78})`
      ctx!.fill()
      ctx!.restore()

      /* Petit reflet gauche */
      ctx!.save()
      ctx!.beginPath()
      ctx!.ellipse(x - r * 0.55, y + r * 0.25, r * 0.13, r * 0.3, -0.4, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(237,237,237,${alpha * 0.42})`
      ctx!.fill()
      ctx!.restore()

      /* Minuscule reflet bas-gauche */
      ctx!.save()
      ctx!.beginPath()
      ctx!.ellipse(x - r * 0.32, y + r * 0.58, r * 0.09, r * 0.17, -0.3, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(237,237,237,${alpha * 0.32})`
      ctx!.fill()
      ctx!.restore()

      ctx!.restore()
    }

    /* ============================================================
       CLASSE BULLE
    ============================================================ */
    class Bubble {
      x: number; y: number; r: number
      vy: number; vx: number
      originX: number
      swayAmp: number; swayFreq: number; swayPhase: number
      wobble: number; wobbleSpeed: number; wobblePhase: number
      t: number; maxT: number
      alpha: number; maxAlpha: number; alive: boolean; isLarge: boolean

      constructor(ox: number, oy: number) {
        const angle = Math.random() * Math.PI * 2
        const dist  = Math.random() * P.spread * 0.45
        this.x      = ox + Math.cos(angle) * dist
        this.y      = oy + Math.sin(angle) * dist * 0.25
        this.originX = this.x

        /* Mix de tailles */
        const t = Math.random()
        if      (t < 0.45) this.r = Math.random() * P.maxSize * 0.25 + 3
        else if (t < 0.80) this.r = Math.random() * P.maxSize * 0.45 + P.maxSize * 0.22
        else               this.r = Math.random() * P.maxSize * 0.38 + P.maxSize * 0.55

        /* Vitesse — les grosses montent plus vite */
        const baseV = (this.r / P.maxSize) * 3 + 1
        this.vy     = -(baseV * P.speed * (0.6 + Math.random() * 0.8))
        this.vx     = (Math.random() - 0.5) * P.speed * 0.4

        /* Oscillation latérale */
        this.swayAmp   = P.spread * 0.06 + Math.random() * 6
        this.swayFreq  = 0.025 + Math.random() * 0.035
        this.swayPhase = Math.random() * Math.PI * 2

        /* Ondulation forme (40% des bulles) */
        this.wobble      = Math.random() < 0.4 ? Math.random() * 0.07 + 0.03 : 0
        this.wobbleSpeed = Math.random() * 0.08 + 0.04
        this.wobblePhase = Math.random() * Math.PI * 2

        this.t        = 0
        this.maxT     = (canvas!.height * 2.4 + this.r) / Math.abs(this.vy)
        this.alpha    = 0
        this.maxAlpha = 0.35 + Math.random() * 0.65  // profondeur : certaines très transparentes
        this.alive    = true
        this.isLarge  = false
      }

      update() {
        this.t++
        this.y       += this.vy
        this.originX += this.vx * 0.03
        this.x        = this.originX + Math.sin(this.t * this.swayFreq + this.swayPhase) * this.swayAmp
        this.wobblePhase += this.wobbleSpeed

        const p = this.t / this.maxT
        if      (p < 0.07) this.alpha = p / 0.07
        else if (p > 0.22) this.alpha = Math.max(0, 1 - (p - 0.22) / 0.32)
        else               this.alpha = 1

        if (this.t >= this.maxT || this.y + this.r < 0) this.alive = false
      }

      draw() {
        drawBubble(this.x, this.y, this.r, this.alpha * this.maxAlpha, this.wobble, this.wobblePhase, this.isLarge)
      }
    }

    /* ============================================================
       POOL DE BULLES
    ============================================================ */
    const bubbles: Bubble[] = []

    function burst(x: number, y: number, n: number) {
      if (bubbles.length >= maxCount) return
      const add = Math.min(n, maxCount - bubbles.length)
      for (let i = 0; i < add; i++) bubbles.push(new Bubble(x, y))
    }

    /* ============================================================
       ÉMISSION AUTO — 8 points sur toute la largeur
    ============================================================ */
    const EMIT_POINTS = 8
    function getEmitX(i: number) {
      return (canvas!.width / EMIT_POINTS) * i + (canvas!.width / EMIT_POINTS) * 0.5
    }

    let frame = 0
    function autoEmit() {
      frame++
      const i = frame % EMIT_POINTS
      if (frame % 3 === 0) {
        const x = getEmitX(i) + (Math.random() - 0.5) * (canvas!.width / EMIT_POINTS) * 0.8
        burst(x, canvas!.height + 10, Math.ceil(P.density))
      }
    }

    /* ============================================================
       PRÉ-REMPLISSAGE continu (mode normal)
    ============================================================ */
    if (!wave) {
      for (let i = 0; i < EMIT_POINTS; i++) {
        const x = getEmitX(i)
        for (let j = 0; j < 10; j++) {
          const b = new Bubble(x + (Math.random() - 0.5) * 80, canvas.height + 10)
          b.y -= Math.random() * canvas.height * 1.1
          b.originX = b.x
          const preFrames = Math.floor(Math.random() * b.maxT * 0.85)
          b.t = preFrames
          const p = b.t / b.maxT
          b.alpha = p > 0.78 ? 1 - (p - 0.78) / 0.22 : 1
          bubbles.push(b)
        }
      }
    }

    /* ============================================================
       BOUCLE PRINCIPALE
    ============================================================ */
    let rafId: number
    let running = false
    let spawnQueue: (() => void)[] = []

    function buildQueue() {
      spawnQueue = []
      bubbles.length = 0
      const cx = canvas!.width / 2
      const total = maxCount + Math.floor(maxCount * 0.10)

      for (let i = 0; i < total; i++) {
        const isLarge = i >= maxCount
        spawnQueue.push(() => {
          const spread = canvas!.width * 0.45
          const u1 = Math.max(0.0001, Math.random()), u2 = Math.random()
          const gauss = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
          const x = isLarge
            ? cx + (Math.random() - 0.5) * canvas!.width * 0.7
            : cx + gauss * spread * 0.4
          const b = new Bubble(x, canvas!.height + 20 + Math.random() * 30)
          if (isLarge) {
            b.r = P.maxSize * (2 + Math.random() * 1.5)
            b.isLarge = true
            b.wobble = 0
            b.maxAlpha = 0.5 + Math.random() * 0.4
            b.t = -Math.floor(Math.random() * 25)
          } else {
            b.t = -Math.floor(Math.random() * 30)
          }
          bubbles.push(b)
        })
      }
    }

    function spawnWave() { buildQueue() }

    function loop() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      if (!wave) autoEmit()

      /* Dépiler 20 bulles max par frame depuis la queue */
      let spawned = 0
      while (spawnQueue.length > 0 && spawned < 20) {
        spawnQueue.shift()!()
        spawned++
      }

      for (let i = bubbles.length - 1; i >= 0; i--) {
        bubbles[i].update()
        bubbles[i].draw()
        if (!bubbles[i].alive) bubbles.splice(i, 1)
      }

      rafId = requestAnimationFrame(loop)
    }

    function start() {
      if (running) return
      running = true
      if (wave) spawnWave()
      loop()
    }

    function stop() {
      running = false
      cancelAnimationFrame(rafId)
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      bubbles.length = 0
    }

    /* ============================================================
       DÉCLENCHEMENT — event custom du ScrollTrigger hero (mode wave)
       ou démarrage immédiat (mode continu)
    ============================================================ */
    if (wave) {
      window.addEventListener('hero-bubble-start', start)
      window.addEventListener('hero-bubble-stop', stop)

      return () => {
        window.removeEventListener('hero-bubble-start', start)
        window.removeEventListener('hero-bubble-stop', stop)
        cancelAnimationFrame(rafId)
        window.removeEventListener('resize', resize)
      }
    } else {
      start()
    }

    /* ---- Cleanup ---- */
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [density, maxSize, speed, spread, maxCount])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}