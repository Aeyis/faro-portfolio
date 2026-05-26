"use client";

import { useEffect, useRef } from "react";

interface Pointer {
    id:    number;
    x:     number;
    y:     number;
    dx:    number;
    dy:    number;
    down:  boolean;
    moved: boolean;
    color: number[];
}

interface FmtPair { internalFormat: number; format: number; }

interface Ext {
    formatRGBA:             FmtPair | null;
    formatRG:               FmtPair | null;
    formatR:                FmtPair | null;
    halfFloatTexType:       number;
    supportLinearFiltering: boolean;
}

type FBO = { texture: WebGLTexture; fbo: WebGLFramebuffer; texId: number };
interface DoubleFBO {
    read:  FBO;
    write: FBO;
    swap(): void;
}

interface Props { variant?: "blue" | "green"; }

export default function FluidCursor({ variant = "blue" }: Props) {
    const canvasRef   = useRef<HTMLCanvasElement>(null);
    const variantRef  = useRef(variant);

    useEffect(() => {
        if (!canvasRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const canvas = canvasRef.current!;

        canvas.width  = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const cfg = {
            TEXTURE_DOWNSAMPLE:   1,
            DENSITY_DISSIPATION:  0.97,
            VELOCITY_DISSIPATION: 0.98,
            PRESSURE_DISSIPATION: 0.8,
            PRESSURE_ITERATIONS:  25,
            CURL:                 28,
            SPLAT_RADIUS:         0.005,
        };

        const randColor = (): number[] => variantRef.current === "green"
            ? [Math.random() * 0.05, Math.random() * 0.25 + 0.3, Math.random() * 0.1]
            : [Math.random() * 0.1,  Math.random() * 0.3 + 0.2, Math.random() * 0.5 + 0.5];

        const pointers: Pointer[] = [{
            id: -1, x: 0, y: 0, dx: 0, dy: 0,
            down: false, moved: false, color: randColor(),
        }];
        const splatStack: number[] = [];

        // ── WebGL context ──
        const ctxParams = { alpha: true, depth: false, stencil: false, antialias: false };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gl = (canvas.getContext("webgl2", ctxParams) ?? canvas.getContext("webgl", ctxParams)) as any;
        if (!gl) return;

        const isWebGL2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let halfFloatExt: any = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let linearExt:    any = null;

        if (isWebGL2) {
            gl.getExtension("EXT_color_buffer_float");
            linearExt = gl.getExtension("OES_texture_float_linear");
        } else {
            halfFloatExt = gl.getExtension("OES_texture_half_float");
            linearExt    = gl.getExtension("OES_texture_half_float_linear");
        }

        gl.clearColor(0.0, 0.0, 0.0, 0.0);

        const halfFloatTexType: number = isWebGL2
            ? gl.HALF_FLOAT
            : halfFloatExt?.HALF_FLOAT_OES ?? gl.UNSIGNED_BYTE;

        const supportLinearFiltering = !!linearExt;

        function supportFmt(iFmt: number, fmt: number, type: number): boolean {
            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, iFmt, 4, 4, 0, fmt, type, null);
            const fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
            return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        }

        function getSupportedFmt(iFmt: number, fmt: number, type: number): FmtPair | null {
            if (!supportFmt(iFmt, fmt, type)) {
                if (iFmt === gl.R16F)    return getSupportedFmt(gl.RG16F,   gl.RG,   type);
                if (iFmt === gl.RG16F)   return getSupportedFmt(gl.RGBA16F, gl.RGBA, type);
                return null;
            }
            return { internalFormat: iFmt, format: fmt };
        }

        const ext: Ext = {
            halfFloatTexType,
            supportLinearFiltering,
            formatRGBA: isWebGL2
                ? getSupportedFmt(gl.RGBA16F, gl.RGBA, halfFloatTexType)
                : getSupportedFmt(gl.RGBA,    gl.RGBA, halfFloatTexType),
            formatRG: isWebGL2
                ? getSupportedFmt(gl.RG16F, gl.RG, halfFloatTexType)
                : getSupportedFmt(gl.RGBA,  gl.RGBA, halfFloatTexType),
            formatR: isWebGL2
                ? getSupportedFmt(gl.R16F, gl.RED, halfFloatTexType)
                : getSupportedFmt(gl.RGBA, gl.RGBA, halfFloatTexType),
        };

        // ── Shader sources ──
        const baseVert = `
            precision highp float;
            attribute vec2 aPosition;
            varying vec2 vUv;
            varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
            uniform vec2 texelSize;
            void main () {
                vUv = aPosition * 0.5 + 0.5;
                vL = vUv - vec2(texelSize.x, 0.0);
                vR = vUv + vec2(texelSize.x, 0.0);
                vT = vUv + vec2(0.0, texelSize.y);
                vB = vUv - vec2(0.0, texelSize.y);
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }`;

        const clearFrag = `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform float value;
            void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`;

        const displayFrag = `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uTexture;
            void main () {
                vec4 color = texture2D(uTexture, vUv);
                float alpha = clamp(length(color.rgb) * 5.0, 0.0, 1.0);
                gl_FragColor = vec4(color.rgb, alpha);
            }`;

        const splatFrag = `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uTarget;
            uniform float aspectRatio;
            uniform vec3 color;
            uniform vec2 point;
            uniform float radius;
            void main () {
                vec2 p = vUv - point.xy;
                p.x *= aspectRatio;
                vec3 splat = exp(-dot(p, p) / radius) * color;
                vec3 base  = texture2D(uTarget, vUv).xyz;
                gl_FragColor = vec4(base + splat, 1.0);
            }`;

        const advectionFrag = `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uVelocity;
            uniform sampler2D uSource;
            uniform vec2 texelSize;
            uniform float dt;
            uniform float dissipation;
            void main () {
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                gl_FragColor = dissipation * texture2D(uSource, coord);
                gl_FragColor.a = 1.0;
            }`;

        const advectionManualFrag = `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uVelocity;
            uniform sampler2D uSource;
            uniform vec2 texelSize;
            uniform float dt;
            uniform float dissipation;
            vec4 bilerp (in sampler2D sam, in vec2 p) {
                vec4 st; st.xy = floor(p - 0.5) + 0.5; st.zw = st.xy + 1.0;
                vec4 uv = st * texelSize.xyxy;
                vec4 a = texture2D(sam, uv.xy); vec4 b = texture2D(sam, uv.zy);
                vec4 c = texture2D(sam, uv.xw); vec4 d = texture2D(sam, uv.zw);
                vec2 f = p - st.xy;
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }
            void main () {
                vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;
                gl_FragColor = dissipation * bilerp(uSource, coord);
                gl_FragColor.a = 1.0;
            }`;

        const divergenceFrag = `
            precision highp float;
            varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
            uniform sampler2D uVelocity;
            vec2 sampleVel (in vec2 uv) {
                vec2 m = vec2(1.0);
                if (uv.x < 0.0) { uv.x = 0.0; m.x = -1.0; }
                if (uv.x > 1.0) { uv.x = 1.0; m.x = -1.0; }
                if (uv.y < 0.0) { uv.y = 0.0; m.y = -1.0; }
                if (uv.y > 1.0) { uv.y = 1.0; m.y = -1.0; }
                return m * texture2D(uVelocity, uv).xy;
            }
            void main () {
                float L = sampleVel(vL).x; float R = sampleVel(vR).x;
                float T = sampleVel(vT).y; float B = sampleVel(vB).y;
                gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
            }`;

        const curlFrag = `
            precision highp float;
            varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
            uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y;
                float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;
                gl_FragColor = vec4(R - L - T + B, 0.0, 0.0, 1.0);
            }`;

        const vorticityFrag = `
            precision highp float;
            varying vec2 vUv; varying vec2 vT; varying vec2 vB;
            uniform sampler2D uVelocity; uniform sampler2D uCurl;
            uniform float curl; uniform float dt;
            void main () {
                float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x;
                float C = texture2D(uCurl, vUv).x;
                vec2 force = vec2(abs(T) - abs(B), 0.0);
                force *= 1.0 / length(force + 0.00001) * curl * C;
                vec2 vel = texture2D(uVelocity, vUv).xy;
                gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
            }`;

        const pressureFrag = `
            precision highp float;
            varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
            uniform sampler2D uPressure; uniform sampler2D uDivergence;
            vec2 bnd (in vec2 uv) { return min(max(uv, 0.0), 1.0); }
            void main () {
                float L = texture2D(uPressure, bnd(vL)).x; float R = texture2D(uPressure, bnd(vR)).x;
                float T = texture2D(uPressure, bnd(vT)).x; float B = texture2D(uPressure, bnd(vB)).x;
                float div = texture2D(uDivergence, vUv).x;
                gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
            }`;

        const gradSubtractFrag = `
            precision highp float;
            varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
            uniform sampler2D uPressure; uniform sampler2D uVelocity;
            vec2 bnd (in vec2 uv) { return min(max(uv, 0.0), 1.0); }
            void main () {
                float L = texture2D(uPressure, bnd(vL)).x; float R = texture2D(uPressure, bnd(vR)).x;
                float T = texture2D(uPressure, bnd(vT)).x; float B = texture2D(uPressure, bnd(vB)).x;
                vec2 vel = texture2D(uVelocity, vUv).xy;
                vel.xy -= vec2(R - L, T - B);
                gl_FragColor = vec4(vel, 0.0, 1.0);
            }`;

        // ── Compile / link ──
        function compile(type: number, src: string): WebGLShader {
            const s = gl.createShader(type)!;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        }

        const baseV = compile(gl.VERTEX_SHADER, baseVert);

        function mkProg(fragSrc: string) {
            const prog = gl.createProgram()!;
            gl.attachShader(prog, baseV);
            gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
            gl.linkProgram(prog);
            const uniforms: Record<string, WebGLUniformLocation> = {};
            const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < n; i++) {
                const name = gl.getActiveUniform(prog, i)!.name;
                uniforms[name] = gl.getUniformLocation(prog, name)!;
            }
            return { uniforms, bind: () => gl.useProgram(prog) };
        }

        const clearProg      = mkProg(clearFrag);
        const displayProg    = mkProg(displayFrag);
        const splatProg      = mkProg(splatFrag);
        const advectionProg  = mkProg(ext.supportLinearFiltering ? advectionFrag : advectionManualFrag);
        const divergenceProg = mkProg(divergenceFrag);
        const curlProg       = mkProg(curlFrag);
        const vorticityProg  = mkProg(vorticityFrag);
        const pressureProg   = mkProg(pressureFrag);
        const gradSubProg    = mkProg(gradSubtractFrag);

        // ── Blit quad ──
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        const blit = (dest: WebGLFramebuffer | null) => {
            gl.bindFramebuffer(gl.FRAMEBUFFER, dest);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        };

        // ── FBOs ──
        let texW: number, texH: number;
        let density: DoubleFBO, velocity: DoubleFBO;
        let divergence: FBO, curl: FBO, pressure: DoubleFBO;

        function createFBO(texId: number, w: number, h: number, iFmt: number, fmt: number, type: number, filter: number): FBO {
            gl.activeTexture(gl.TEXTURE0 + texId);
            const texture = gl.createTexture()!;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, iFmt, w, h, 0, fmt, type, null);
            const fbo = gl.createFramebuffer()!;
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            gl.viewport(0, 0, w, h);
            gl.clear(gl.COLOR_BUFFER_BIT);
            return { texture, fbo, texId };
        }

        function createDoubleFBO(texId: number, w: number, h: number, iFmt: number, fmt: number, type: number, filter: number): DoubleFBO {
            let a = createFBO(texId,     w, h, iFmt, fmt, type, filter);
            let b = createFBO(texId + 1, w, h, iFmt, fmt, type, filter);
            return {
                get read()  { return a; },
                get write() { return b; },
                swap() { const t = a; a = b; b = t; },
            };
        }

        function initFBOs() {
            texW = gl.drawingBufferWidth  >> cfg.TEXTURE_DOWNSAMPLE;
            texH = gl.drawingBufferHeight >> cfg.TEXTURE_DOWNSAMPLE;
            const type   = ext.halfFloatTexType;
            const filter = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
            const rgba   = ext.formatRGBA!;
            const rg     = ext.formatRG!;
            const r      = ext.formatR!;
            density    = createDoubleFBO(2, texW, texH, rgba.internalFormat, rgba.format, type, filter);
            velocity   = createDoubleFBO(0, texW, texH, rg.internalFormat,   rg.format,   type, filter);
            divergence = createFBO(4, texW, texH, r.internalFormat, r.format, type, gl.NEAREST);
            curl       = createFBO(5, texW, texH, r.internalFormat, r.format, type, gl.NEAREST);
            pressure   = createDoubleFBO(6, texW, texH, r.internalFormat, r.format, type, gl.NEAREST);
        }

        initFBOs();

        // ── Splat ──
        function splat(x: number, y: number, dx: number, dy: number, color: number[]) {
            splatProg.bind();
            gl.uniform1i(splatProg.uniforms.uTarget, velocity.read.texId);
            gl.uniform1f(splatProg.uniforms.aspectRatio, canvas.width / canvas.height);
            gl.uniform2f(splatProg.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
            gl.uniform3f(splatProg.uniforms.color, dx, -dy, 1.0);
            gl.uniform1f(splatProg.uniforms.radius, cfg.SPLAT_RADIUS);
            blit(velocity.write.fbo);
            velocity.swap();

            gl.uniform1i(splatProg.uniforms.uTarget, density.read.texId);
            gl.uniform3f(splatProg.uniforms.color, color[0] * 0.3, color[1] * 0.3, color[2] * 0.3);
            blit(density.write.fbo);
            density.swap();
        }

        function multipleSplats(n: number) {
            for (let i = 0; i < n; i++) {
                const color = randColor();
                splat(canvas.width * Math.random(), canvas.height * Math.random(),
                    800 * (Math.random() - 0.5), 800 * (Math.random() - 0.5), color);
            }
        }

        multipleSplats(Math.floor(Math.random() * 12) + 4);

        // ── Render loop ──
        let lastTime = Date.now();
        let rafId: number;

        function update() {
            if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
                canvas.width  = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
                initFBOs();
            }

            const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
            lastTime = Date.now();
            gl.viewport(0, 0, texW, texH);

            if (splatStack.length > 0) multipleSplats(splatStack.pop()!);

            // Advect velocity
            advectionProg.bind();
            gl.uniform2f(advectionProg.uniforms.texelSize, 1.0 / texW, 1.0 / texH);
            gl.uniform1i(advectionProg.uniforms.uVelocity, velocity.read.texId);
            gl.uniform1i(advectionProg.uniforms.uSource,   velocity.read.texId);
            gl.uniform1f(advectionProg.uniforms.dt, dt);
            gl.uniform1f(advectionProg.uniforms.dissipation, cfg.VELOCITY_DISSIPATION);
            blit(velocity.write.fbo); velocity.swap();

            // Advect density
            gl.uniform1i(advectionProg.uniforms.uVelocity, velocity.read.texId);
            gl.uniform1i(advectionProg.uniforms.uSource,   density.read.texId);
            gl.uniform1f(advectionProg.uniforms.dissipation, cfg.DENSITY_DISSIPATION);
            blit(density.write.fbo); density.swap();

            // Apply pointer splats
            for (const p of pointers) {
                if (p.moved) { splat(p.x, p.y, p.dx, p.dy, p.color); p.moved = false; }
            }

            // Curl
            curlProg.bind();
            gl.uniform2f(curlProg.uniforms.texelSize, 1.0 / texW, 1.0 / texH);
            gl.uniform1i(curlProg.uniforms.uVelocity, velocity.read.texId);
            blit(curl.fbo);

            // Vorticity
            vorticityProg.bind();
            gl.uniform2f(vorticityProg.uniforms.texelSize, 1.0 / texW, 1.0 / texH);
            gl.uniform1i(vorticityProg.uniforms.uVelocity, velocity.read.texId);
            gl.uniform1i(vorticityProg.uniforms.uCurl, curl.texId);
            gl.uniform1f(vorticityProg.uniforms.curl, cfg.CURL);
            gl.uniform1f(vorticityProg.uniforms.dt, dt);
            blit(velocity.write.fbo); velocity.swap();

            // Divergence
            divergenceProg.bind();
            gl.uniform2f(divergenceProg.uniforms.texelSize, 1.0 / texW, 1.0 / texH);
            gl.uniform1i(divergenceProg.uniforms.uVelocity, velocity.read.texId);
            blit(divergence.fbo);

            // Pressure clear
            clearProg.bind();
            gl.activeTexture(gl.TEXTURE0 + pressure.read.texId);
            gl.bindTexture(gl.TEXTURE_2D, pressure.read.texture);
            gl.uniform1i(clearProg.uniforms.uTexture, pressure.read.texId);
            gl.uniform1f(clearProg.uniforms.value, cfg.PRESSURE_DISSIPATION);
            blit(pressure.write.fbo); pressure.swap();

            // Pressure solve
            pressureProg.bind();
            gl.uniform2f(pressureProg.uniforms.texelSize, 1.0 / texW, 1.0 / texH);
            gl.uniform1i(pressureProg.uniforms.uDivergence, divergence.texId);
            for (let i = 0; i < cfg.PRESSURE_ITERATIONS; i++) {
                gl.activeTexture(gl.TEXTURE0 + pressure.read.texId);
                gl.bindTexture(gl.TEXTURE_2D, pressure.read.texture);
                gl.uniform1i(pressureProg.uniforms.uPressure, pressure.read.texId);
                blit(pressure.write.fbo); pressure.swap();
            }

            // Gradient subtract
            gradSubProg.bind();
            gl.uniform2f(gradSubProg.uniforms.texelSize, 1.0 / texW, 1.0 / texH);
            gl.uniform1i(gradSubProg.uniforms.uPressure, pressure.read.texId);
            gl.uniform1i(gradSubProg.uniforms.uVelocity, velocity.read.texId);
            blit(velocity.write.fbo); velocity.swap();

            // Display
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            displayProg.bind();
            gl.uniform1i(displayProg.uniforms.uTexture, density.read.texId);
            blit(null);

            rafId = requestAnimationFrame(update);
        }

        rafId = requestAnimationFrame(update);

        // ── Mouse / touch events (window-level, clipped to canvas) ──
        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

            pointers[0].moved  = true;
            pointers[0].dx     = (x - pointers[0].x) * 10.0;
            pointers[0].dy     = (y - pointers[0].y) * 10.0;
            pointers[0].x      = x;
            pointers[0].y      = y;
            pointers[0].down   = true;
            pointers[0].color  = randColor();
        };

        const onTouchMove = (e: TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            for (let i = 0; i < e.targetTouches.length; i++) {
                const t = e.targetTouches[i];
                if (!pointers[i]) pointers.push({ id: t.identifier, x: 0, y: 0, dx: 0, dy: 0, down: false, moved: false, color: [0.1, 0.4, 1.0] });
                const p = pointers[i];
                p.moved = p.down;
                p.dx = (t.clientX - rect.left - p.x) * 10.0;
                p.dy = (t.clientY - rect.top  - p.y) * 10.0;
                p.x  = t.clientX - rect.left;
                p.y  = t.clientY - rect.top;
                p.down  = true;
                p.color = randColor();
            }
        };

        window.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("touchmove",  onTouchMove, { passive: true });

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("touchmove",  onTouchMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position:      "absolute",
                inset:         0,
                width:         "100%",
                height:        "100%",
                pointerEvents: "none",
                zIndex:        0,
            }}
        />
    );
}