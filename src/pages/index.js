import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Home = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Resize listener
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    // Coffee cup shape (using CylinderGeometry for simplicity)
    const geometry = new THREE.CylinderGeometry(3, 3, 6, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00FF00, // Neon Green
      wireframe: true
    });

    const coffeeCup = new THREE.Mesh(geometry, material);
    scene.add(coffeeCup);

    camera.position.z = 10;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      coffeeCup.rotation.x += 0.01;
      coffeeCup.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}></div>
  );
};

export default Home;
