"use client";

import { useEffect, useRef } from "react";

const VERT = `precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;
void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG = `precision mediump float;
varying vec2 vUv;
uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_scale;
uniform float u_illumination;
uniform float u_surface_distortion;
uniform float u_water_distortion;
uniform vec3 u_tint;

vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
    vec4 x12=x0.xyxy+C.xxzz;
    x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
    m=m*m; m=m*m;
    vec3 x2=2.*fract(p*C.www)-1.;
    vec3 h=abs(x2)-0.5;
    vec3 a0=x2-floor(x2+0.5);
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g;
    g.x=a0.x*x0.x+h.x*x0.y;
    g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.*dot(m,g);
}
mat2 rotate2D(float r){return mat2(cos(r),sin(r),-sin(r),cos(r));}
float surface_noise(vec2 uv,float t,float scale){
    vec2 n=vec2(.1); vec2 N=vec2(.1);
    mat2 m=rotate2D(.5);
    for(int j=0;j<10;j++){
        uv*=m; n*=m;
        vec2 q=uv*scale+float(j)+n+(.5+.5*float(j))*(mod(float(j),2.)-1.)*t;
        n+=sin(q); N+=cos(q)/scale; scale*=1.2;
    }
    return(N.x+N.y+.1);
}
void main(){
    vec2 uv=vUv;
    uv.y=1.-uv.y;
    uv.x*=u_ratio;
    float t=.002*u_time;
    float outer_noise=snoise((.3+.1*sin(t))*uv+vec2(0.,.2*t));
    vec2 sn_uv=2.*uv+(outer_noise*.2);
    float sn=surface_noise(sn_uv,t,u_scale);
    sn*=pow(uv.y,.3);
    sn=pow(sn,2.);
    vec2 img_uv=vUv;
    img_uv+=(u_water_distortion*outer_noise);
    img_uv+=(u_surface_distortion*sn);
    vec4 img=texture2D(u_image_texture,img_uv);
    img*=(1.+u_illumination*sn);
    vec3 color=img.rgb;
    color+=u_illumination*u_tint*sn;
    gl_FragColor=vec4(color,1.0);
}`;

export default function WaterBackground({ width, height, tint = [0.2, 1.0, 0.5], bgColors = ["#112918","#071a0e","#030e07"] }: { width: number; height: number; tint?: [number,number,number]; bgColors?: [string,string,string] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = (canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
        if (!gl) return;

        const compile = (src: string, type: number) => {
            const s = gl.createShader(type)!;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        };
        const program = gl.createProgram()!;
        gl.attachShader(program, compile(VERT, gl.VERTEX_SHADER));
        gl.attachShader(program, compile(FRAG, gl.FRAGMENT_SHADER));
        gl.linkProgram(program);
        gl.useProgram(program);

        const u = (n: string) => gl.getUniformLocation(program, n);
        const uTime  = u("u_time");
        const uRatio = u("u_ratio");

        gl.uniform1f(u("u_scale"),             7);
        gl.uniform1f(u("u_illumination"),       0.22);
        gl.uniform1f(u("u_surface_distortion"), 0.07);
        gl.uniform1f(u("u_water_distortion"),   0.04);
        gl.uniform1i(u("u_image_texture"),      0);
        gl.uniform3f(u("u_tint"),               tint[0], tint[1], tint[2]);
        gl.uniform1f(uRatio, width / height);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const off = document.createElement("canvas");
        off.width = 256; off.height = 256;
        const ctx = off.getContext("2d")!;
        const grad = ctx.createRadialGradient(128, 100, 0, 128, 128, 220);
        grad.addColorStop(0,   bgColors[0]);
        grad.addColorStop(0.5, bgColors[1]);
        grad.addColorStop(1,   bgColors[2]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off);

        gl.viewport(0, 0, width, height);

        let rafId: number;
        const render = () => {
            gl.uniform1f(uTime, performance.now());
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            rafId = requestAnimationFrame(render);
        };
        rafId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafId);
            gl.deleteTexture(tex);
            gl.deleteBuffer(buf);
            gl.deleteProgram(program);
        };
    }, [width, height]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
        />
    );
}