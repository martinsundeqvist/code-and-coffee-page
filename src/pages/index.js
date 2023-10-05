import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

    const loader = new GLTFLoader();

    let coffeeMugModel;
    loader.load(
      '/coffee-cup.gltf',
      (gltf) => {
        coffeeMugModel = gltf.scene;

        coffeeMugModel.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
              color: 0x800080, // Purple color in hexadecimal
              wireframe: true
            });
          }
        });

        scene.add(coffeeMugModel);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.log('An error happened', error);
      }
    );


    camera.position.z = 7;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      if (coffeeMugModel) { // Ensure the model has been loaded
        coffeeMugModel.rotation.x += 0.01;
        coffeeMugModel.rotation.y += 0.02; // Spins the coffee mug model
      }

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}></div>
  );
};

export default Home;
