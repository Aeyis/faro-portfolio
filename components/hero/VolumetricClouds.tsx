"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const NUM = 120;

const VERT = `
  attribute vec3 position;
  attribute vec2 uv;
  attribute vec3 instancePosition;
  attribute float delay;
  attribute float rotate;

  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;
  uniform float time;

  varying vec2 vUv;
  varying float vAlpha;

  mat4 rotateMat4Z(float r) {
    return mat4(
      cos(r), -sin(r), 0.0, 0.0,
      sin(r),  cos(r), 0.0, 0.0,
      0.0,     0.0,    1.0, 0.0,
      0.0,     0.0,    0.0, 1.0
    );
  }

  void main(void) {
    float driftX  = sin(time * 0.08 + delay * 6.28) * 180.0;
    float driftY  = sin(time * 0.05 + delay * 3.14) * 25.0;
    float slowRot = rotate * 0.18 + time * 0.012;

    mat4 rm = rotateMat4Z(slowRot);
    vec3 rotPos = (rm * vec4(position, 1.0)).xyz;

    vec3 worldPos = instancePosition + vec3(driftX, driftY, 0.0) + rotPos;

    float edgeFade = 1.0 - smoothstep(0.3, 1.0, abs(sin(time * 0.05 + delay * 6.28)));
    vAlpha = 0.55 + edgeFade * 0.45;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
  }
`;

const FRAG = `
  precision highp float;

  uniform sampler2D tex;

  varying vec2 vUv;
  varying float vAlpha;

  void main() {
    vec4 t = texture2D(tex, vUv);
    vec3 color = vec3(0.82, 0.88, 0.95);
    float alpha = t.a * 0.06 * vAlpha;
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function VolumetricClouds() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 1, 10000);
    camera.position.set(0, 0, 900);
    camera.lookAt(new THREE.Vector3());

    const uniforms = {
      time: { value: 0 },
      tex:  { value: null as THREE.Texture | null },
    };

    // Build instanced geometry
    const base = new THREE.PlaneGeometry(900, 900, 12, 12);
    const geo  = new THREE.InstancedBufferGeometry();
    geo.setAttribute("position", base.attributes.position);
    geo.setAttribute("uv",       base.attributes.uv);
    geo.setIndex(base.index);

    const positions = new Float32Array(NUM * 3);
    const delays    = new Float32Array(NUM);
    const rotates   = new Float32Array(NUM);

    for (let i = 0; i < NUM; i++) {
      positions[i * 3 + 0] = (Math.random() * 2 - 1) * 950;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * 160;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * 80;
      delays[i]  = Math.random();
      rotates[i] = Math.random() * Math.PI * 2;
    }

    geo.setAttribute("instancePosition", new THREE.InstancedBufferAttribute(positions, 3));
    geo.setAttribute("delay",            new THREE.InstancedBufferAttribute(delays, 1));
    geo.setAttribute("rotate",           new THREE.InstancedBufferAttribute(rotates, 1));

    const mat = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader:   VERT,
      fragmentShader: FRAG,
      transparent:    true,
      depthWrite:     false,
      blending:       THREE.AdditiveBlending,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Load fog texture
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(
      "https://ykob.github.io/sketch-threejs/img/sketch/fog/fog.png",
      (t) => { uniforms.tex.value = t; }
    );

    // Resize
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // Loop
    let rafId: number;
    const clock = new THREE.Clock();
    clock.start();

    const loop = () => {
      uniforms.time.value += clock.getDelta();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        bottom: "18%",
        left: 0,
        width: "100%",
        height: "45%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
