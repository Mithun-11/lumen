"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export function LumenBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();
        // Transparent background to let CSS bg show through
        scene.background = null;

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 20;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;

        const posArray = new Float32Array(particlesCount * 3);
        const randomArray = new Float32Array(particlesCount * 3); // For random offset movement

        for (let i = 0; i < particlesCount * 3; i++) {
            // Spread particles across a wide area
            posArray[i] = (Math.random() - 0.5) * 60;
            randomArray[i] = (Math.random() - 0.5);
        }

        particlesGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(posArray, 3)
        );

        // Helper to create a circular texture
        const createCircleTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;

            const context = canvas.getContext('2d');
            if (!context) return null;

            const center = 16;
            const radius = 14;

            context.beginPath();
            context.arc(center, center, radius, 0, 2 * Math.PI);
            context.fillStyle = 'white';
            context.fill();

            return new THREE.CanvasTexture(canvas);
        };

        // Material
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.12,
            map: createCircleTexture(),
            transparent: true,
            alphaTest: 0.1, // Clips the square corners thanks to the transparency
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            depthWrite: false, // Prevents z-fighting for transparent particles
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Interaction
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (event: MouseEvent) => {
            mouseX = event.clientX / window.innerWidth - 0.5;
            mouseY = event.clientY / window.innerHeight - 0.5;
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        // Animation Loop
        const clock = new THREE.Clock();

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            // Update color based on theme
            const isDark = theme === 'dark' || theme === 'system'; // Simple check, refine if needed
            particlesMaterial.color.set(isDark ? 0xffffff : 0x000000);
            particlesMaterial.opacity = isDark ? 0.6 : 0.3;

            // Gentle rotation
            particlesMesh.rotation.y = elapsedTime * 0.05;
            particlesMesh.rotation.x = elapsedTime * 0.02;

            // Mouse parallax
            // Smoothly interpolate camera position or mesh rotation towards mouse
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;

            // Wave effect
            const positions = particlesGeometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                // Add a subtle wave motion
                // We use the initial random positions plus time to create unique movement for each
                const x = positions[i3];

                // Simple "breathing" or "floating" effect
                // We can't easily modify original positions without storing them, 
                // but for this simple effect, just rotating the whole mesh is usually enough.
                // Let's add dynamic y-movement based on x-position

                // Note: altering buffer data every frame can be expensive if not optimized. 
                // For 2000 particles it's fine.
                // Let's stick to Scene/Mesh rotation for performance and maybe a shader later if "crazy" is needed.
            }

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            renderer.dispose();
        };
    }, [theme]);

    return (
        <div
            ref={containerRef}
            className="fixed top-0 left-0 w-full h-full z-[0] pointer-events-none fade-in-0 duration-1000"
            style={{ opacity: 1 }}
        />
    );
}
