import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const WebGLBackground = ({ height = '100vh' }) => {
    const containerRef = useRef(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const targetMouseRef = useRef({ x: 0.5, y: 0.5 });

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, containerRef.current.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
                u_resolution: { value: new THREE.Vector2(window.innerWidth, containerRef.current.offsetHeight) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float u_time;
                uniform vec2 u_mouse;
                varying vec2 vUv;

                void main() {
                    vec2 st = vUv;
                    
                    // Create 3 large, visible bubbles
                    vec3 bubbleColor = vec3(0.0);
                    
                    // Bubble 1
                    vec2 pos1 = vec2(0.3 + sin(u_time * 0.3) * 0.2, 0.5 + cos(u_time * 0.25) * 0.15);
                    float dist1 = distance(st, pos1);
                    float bubble1 = 0.15 / dist1;
                    
                    // Bubble 2
                    vec2 pos2 = vec2(0.65 + cos(u_time * 0.35) * 0.15, 0.4 + sin(u_time * 0.28) * 0.18);
                    float dist2 = distance(st, pos2);
                    float bubble2 = 0.12 / dist2;
                    
                    // Bubble 3
                    vec2 pos3 = vec2(0.5 + sin(u_time * 0.4) * 0.25, 0.65 + cos(u_time * 0.32) * 0.12);
                    float dist3 = distance(st, pos3);
                    float bubble3 = 0.18 / dist3;
                    
                    // Combine bubbles
                    float bubbles = bubble1 + bubble2 + bubble3;
                    
                    // Deep blue colors
                    vec3 darkBlue = vec3(0.02, 0.05, 0.15);
                    vec3 mediumBlue = vec3(0.1, 0.2, 0.5);
                    vec3 brightBlue = vec3(0.3, 0.5, 1.0);
                    
                    // Background
                    vec3 bg = mix(darkBlue, mediumBlue, st.y * 0.5);
                    
                    // Add bubble glow
                    bubbleColor = mix(bg, brightBlue, smoothstep(0.0, 1.0, bubbles) * 0.8);
                    bubbleColor += brightBlue * smoothstep(0.5, 2.0, bubbles) * 0.5;
                    
                    gl_FragColor = vec4(bubbleColor, 1.0);
                }
            `
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, shaderMaterial);
        scene.add(mesh);

        const handleMouseMove = (event) => {
            targetMouseRef.current.x = event.clientX / window.innerWidth;
            targetMouseRef.current.y = 1.0 - event.clientY / window.innerHeight;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            const lerpFactor = 0.05;
            mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * lerpFactor;
            mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * lerpFactor;

            shaderMaterial.uniforms.u_time.value = elapsedTime;
            shaderMaterial.uniforms.u_mouse.value.set(mouseRef.current.x, mouseRef.current.y);

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            const width = window.innerWidth;
            const height = containerRef.current.offsetHeight;

            renderer.setSize(width, height);
            shaderMaterial.uniforms.u_resolution.value.set(width, height);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            geometry.dispose();
            shaderMaterial.dispose();
            if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height,
                position: 'relative',
                overflow: 'hidden'
            }}
        />
    );
};

export default WebGLBackground;
