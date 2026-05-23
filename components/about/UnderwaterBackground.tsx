'use client'

import { useEffect, useRef } from 'react'

export default function UnderwaterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      const parent = canvas.parentElement
      canvas.width  = parent ? parent.offsetWidth  : window.innerWidth
      canvas.height = parent ? parent.offsetHeight : window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    /* ---- PARTICLES ---- */
    interface Particle {
      x: number; y: number; r: number
      vx: number; vy: number
      alpha: number; phase: number; pSpeed: number
    }
    const NUM_P = 110
    const particles: Particle[] = Array.from({ length: NUM_P }, () => ({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      r:      0.5 + Math.random() * 1.5,
      vx:     (Math.random() - 0.5) * 0.25,
      vy:     (Math.random() - 0.5) * 0.15,
      alpha:  0.18 + Math.random() * 0.3,
      phase:  Math.random() * Math.PI * 2,
      pSpeed: 0.008 + Math.random() * 0.018,
    }))

    let t = 0
    let rafId: number

    function loop() {
      t++
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      /* Particles */
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.phase += p.pSpeed
        if (p.x < -4) p.x = canvas!.width  + 4
        if (p.x > canvas!.width  + 4) p.x = -4
        if (p.y < -4) p.y = canvas!.height + 4
        if (p.y > canvas!.height + 4) p.y = -4

        const pulse = 0.5 + 0.5 * Math.sin(p.phase)
        ctx!.save()
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(180, 230, 255, ${p.alpha * (0.35 + 0.65 * pulse)})`
        ctx!.fill()
        ctx!.restore()
      })

      /* Fade mask — transparent en haut, opaque vers le bas */
      const mask = ctx!.createLinearGradient(0, 0, 0, canvas!.height * 0.35)
      mask.addColorStop(0,   'rgba(0,0,0,0)')
      mask.addColorStop(1,   'rgba(0,0,0,1)')
      ctx!.globalCompositeOperation = 'destination-in'
      ctx!.fillStyle = mask
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
      ctx!.globalCompositeOperation = 'source-over'

      rafId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

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