import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeHeroBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // Create 3D Molecular Mesh Network
    const particlesCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const scales = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      scales[i] = Math.random() * 0.15 + 0.05;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Texture/Material
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x0d631b,
      size: 0.35,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(geometry, particleMaterial);
    scene.add(particlesMesh);

    // Floating DNA Helix Strand simulation
    const dnaGroup = new THREE.Group();
    const dnaNodes = 30;
    const nodeGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const nodeMat1 = new THREE.MeshBasicMaterial({ color: 0x005faf, transparent: true, opacity: 0.7 });
    const nodeMat2 = new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.7 });

    for (let i = 0; i < dnaNodes; i++) {
      const t = (i / dnaNodes) * Math.PI * 4;
      const y = (i - dnaNodes / 2) * 0.4;
      
      const n1 = new THREE.Mesh(nodeGeo, nodeMat1);
      n1.position.set(Math.cos(t) * 2, y, Math.sin(t) * 2);
      dnaGroup.add(n1);

      const n2 = new THREE.Mesh(nodeGeo, nodeMat2);
      n2.position.set(Math.cos(t + Math.PI) * 2, y, Math.sin(t + Math.PI) * 2);
      dnaGroup.add(n2);

      // Connecting strand
      const lineGeo = new THREE.BufferGeometry().setFromPoints([n1.position, n2.position]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.25 });
      const line = new THREE.Line(lineGeo, lineMat);
      dnaGroup.add(line);
    }

    dnaGroup.position.set(-12, 0, -5);
    dnaGroup.rotation.z = Math.PI / 6;
    scene.add(dnaGroup);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      dnaGroup.rotation.y += 0.01;

      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0 overflow-hidden" 
    />
  );
}
