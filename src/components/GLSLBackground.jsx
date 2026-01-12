import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useSettings } from '../context/SettingsContext';

// Shaders Collection
const defaultVertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

// Mode 0: Original Purple/Blue Flow
const shaderEffect0 = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform vec2 resolution;
    uniform float time;

    const int complexity = 18;
    const float fluid_speed = 1240.0;

    mat2 rotate2d(float theta) {
        float s = sin(theta), c = cos(theta);
        return mat2(c, -s, s, c);
    }

    void main() {
        vec2 p = (2.0 * gl_FragCoord.xy - resolution) / max(resolution.x, resolution.y);
        float vv = 0.;
        float vv2 = 0.0;
        
        for(int i=1; i<complexity; i++) {
            p *= rotate2d(.35 * float(i));
            p.x += sin(time + length(p * .4) + p.y) * 0.2;
            p.y += sin(p.x) * 0.1;
            vec2 newp = p * .995;
            newp.x += 0.6 / float(i) * sin(float(i) * p.y * 1.1 + time / fluid_speed * float(i + 41)) + 0.5;
            newp.y += 0.6 / float(i) * sin(float(i) * p.x * 0.7 + time / fluid_speed * float(i + 14)) - 0.5;
            p = newp;
            p.y += sin(p.x * 3.0 + time * 0.4) * 0.005;
            p.x += sin(p.x * 4.4 + p.y + 7.131 + time) * 0.006;
            vv += sin(p.x - p.y * 5.3) * 0.33;
            vv2 += cos(p.y + p.x * (.3 + float(i) * 0.56)) * 0.05;
        }
        
        vec3 col = vec3(0.5 / vv * 5.1, 0.05 / vv2 * 1.45, vv2 * 4.4);
        
        // Purple/Blue tinted adjustments
        if (col.g > 0.0) { col.b = 0.0; col.r = 0.0; }
        float d1 = length(col * col);
        d1 = pow(.5 / d1, .953);
        col = vec3(d1 * 1.593, d1 * 0.75, d1 * 0.83) * 0.1;

        gl_FragColor = vec4(col, 0.5);
    }
`;

// Mode 1: New Green/Cyan Noise Effect (User Provided)
const shaderEffect1 = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    // Note: GL_OES_standard_derivatives is now enabled via ShaderMaterial options

    #define NUM_OCTAVES 10

    uniform float time;
    uniform vec2 resolution;

    float random(vec2 pos) {
        return fract(sin(dot(pos.xy, vec2(1399.9898, 78.233))) * 43758.5453123);
    }

    float noise(vec2 pos) {
        vec2 i = floor(pos);
        vec2 f = fract(pos);
        float a = random(i + vec2(0.0, 0.0));
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 pos) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i=0; i<NUM_OCTAVES; i++) {
            v += a * noise(pos);
            pos = rot * pos * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }

    void main(void) {
        vec2 p = (gl_FragCoord.xy * 3.0 - resolution.xy) / min(resolution.x, resolution.y);

        float t = 0.0;
        float time2 = 3.0 * time / 2.0;

        vec2 q = vec2(0.0);
        q.x = fbm(p + 0.00 * time2);
        q.y = fbm(p + vec2(1.0));
        vec2 r = vec2(0.0);
        r.x = fbm(p + 1.0 * q + vec2(1.7, 9.2) + 0.15 * time2);
        r.y = fbm(p + 1.0 * q + vec2(8.3, 2.8) + 0.126 * time2);
        float f = fbm(p + r);
        vec3 color = mix(
            vec3(1.101961, 6.0, 8),
            vec3(1, 1.0, 0.666667),
            clamp((f * f) * 4.0, 0.0, 1.0)
        );

        color = mix(
            color,
            vec3(0.0, 1, 0.2),
            clamp(length(q), 0.0, 1.0)
        );

        color = mix(
            color,
            vec3(0, .4, .3),
            clamp(length(r.x), 0.0, 1.0)
        );

        color = (f *f * f + 0.6 * f * f + 0.5 * f) * color;

        gl_FragColor = vec4(color, 1.0);
    }
`;

// Mode 2: Red Sci-Fi Tunnel (User Provided)
const shaderEffect2 = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float time;
    uniform vec2 resolution;

    // shadertoy emulation
    #define iTime time
    #define iResolution vec3(resolution,1.)

    void mainImage(out vec4 O, vec2 I)
    {
        vec3 p=iResolution,d = -.5*vec3(I+I-p.xy,p)/p.x,c = d-d, i=c;
        for(int x=0;x<100;++x) {
            if (i.x>=1.) break;
            p = c,
            p.z -= iTime+(i.x+=.01),
            p.xy *= mat2(sin((p.z*=.1)+vec4(0,11,33,0)));
            c += length(sin(p.yx)+cos(p.xz+iTime))*d;
        }
        O = vec4(15,0,1,1)/length(c);
    }

    void main(void)
    {
        mainImage(gl_FragColor, gl_FragCoord.xy);
        // Force modest alpha to not overwhelm text
        gl_FragColor.a = 0.5; 
    }
`;

// Mode 3: Dark Fluid (User Provided)
const shaderEffect3 = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform vec2 resolution;
    uniform float time;

    const float Pi = 3.14159;

    const int   complexity      = 30;    // More points of color.
    const float fluid_speed     = 20000.0;  // Drives speed, higher number will make it slower.
    const float color_intensity = 0.3;
    const float red = 0.1;
    const float green = 0.2;
    const float blue = 0.3;

    void main()
    {
        vec2 p=(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
        for(int i=1;i<complexity;i++)
        {
            vec2 newp=p + time*0.0003;
            newp.x+=0.6/float(i)*sin(float(i)*p.y+time/fluid_speed*float(i+2000)) + 0.5;
            newp.y+=0.6/float(i)*sin(float(i)*p.x+time/fluid_speed*float(i+1909)) - 0.5;
            p=newp;
        }
        vec3 col=vec3(color_intensity*sin(3.0*p.x)+red,color_intensity*sin(3.0*p.x)+green,color_intensity*sin(3.0*p.x)+blue);
        gl_FragColor=vec4(col, 1.0);
    }
`;

// Placeholder for other modes
const shaderEffectDefault = shaderEffect0;

const shaders = [shaderEffect0, shaderEffect1, shaderEffect2, shaderEffect3];

const GLSLBackground = () => {
    const containerRef = useRef(null);
    const { glslBackgroundEnabled, currentGlslEffect } = useSettings();

    useEffect(() => {
        if (!glslBackgroundEnabled || !containerRef.current) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ alpha: true });

        // Attempt to enable OES_standard_derivatives if possible (though often implied in newer three.js/webgl2)
        // Note: In WebGL2 this is standard. In WebGL1 it might need enabling.
        // Three.js usually handles context creation.

        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const uniforms = {
            time: { value: 0.0 },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        };

        const geometry = new THREE.PlaneGeometry(2, 2);

        // Select shader based on currentGlslEffect
        const selectedFragmentShader = shaders[currentGlslEffect] || shaderEffect0;

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: defaultVertexShader,
            fragmentShader: selectedFragmentShader,
            transparent: true,
            extensions: {
                derivatives: true
            }
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        let animationId;
        const animate = (time) => {
            uniforms.time.value = time / 1000;
            renderer.render(scene, camera);
            animationId = requestAnimationFrame(animate);
        };
        animate(0);

        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, [glslBackgroundEnabled, currentGlslEffect]); // Re-run when effect changes

    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!glslBackgroundEnabled || isMobile) return null;

    return (
        <div ref={containerRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
    );
};

export default GLSLBackground;
