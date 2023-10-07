import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const Home = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    let textHoverSpeed = 0.01;
    let textHoverHeight = 0.1;  // How much it should move up and down
    let textHoverTime = 0;
    let textColorPulseSpeed = 0.01;
    let textColorPulseTime = 0;
    
    const container = containerRef.current;
    renderer.setSize(container.clientWidth, container.clientWidth);
    containerRef.current.appendChild(renderer.domElement);

    // Resize listener
    window.addEventListener('resize', () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    });

    const gltfLoader = new GLTFLoader();

    let coffeeMugModel;
    gltfLoader.load(
      '/coffee-cup.gltf',
      (gltf) => {
        coffeeMugModel = gltf.scene;

        coffeeMugModel.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
              color: 0x800080, 
              wireframe: true,
              emissive: 0x800080
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

    const fontLoader = new FontLoader();

    let textMesh;

    fontLoader.load('/young-serif-regular.json', (font) => {
      const textGeometry = new TextGeometry('Coffee & Code', {
        font: font,
        size: 1,
        height: 0.2,
      });

      textGeometry.computeBoundingBox();
      const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;

      const textMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        emissive: 0xFFFFFF,
        wireframe: true,
        opacity: 0
      });
      textMaterial.transparent = true;

      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-textWidth / 2, 2, 3);
      scene.add(textMesh);
    });

    let animationProgress = 0;


    camera.position.z = 8;

    let elapsedTime = 0;
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      if (coffeeMugModel) {
        elapsedTime += 0.03;
        coffeeMugModel.rotation.x += 0.01;
        coffeeMugModel.rotation.y += 0.01;
        const pulseFactor = (Math.sin(elapsedTime) + 1) / 2; // Gives value between 0 and 1
   
        const currentColor = new THREE.Color();
        const purpleColor = new THREE.Color(0x800080);
        const whiteColor = new THREE.Color(0xFFFFFF);
        const lightPurpleColor = new THREE.Color(0xA020F0);
   
        currentColor.lerpColors(purpleColor, whiteColor, pulseFactor);
        
        coffeeMugModel.traverse((child) => {
          if (child.isMesh) {
            child.material.emissive = currentColor;
          }
        });
      }

      if (textMesh) {
        // Increase opacity
        textMesh.material.opacity += 0.01;
        if (textMesh.material.opacity > 1) {
          textMesh.material.opacity = 1;
        }
      
        // Hovering animation
        textHoverTime += textHoverSpeed;
        textMesh.position.y = 2 + Math.sin(textHoverTime) * textHoverHeight;
      
        // Transition color from white to purple based on opacity
        const currentTextColor = new THREE.Color();
        const purpleColor = new THREE.Color(0x800080);
        const whiteColor = new THREE.Color(0xFFFFFF);
        
        let colorFactor = textMesh.material.opacity;
        currentTextColor.lerpColors(whiteColor, purpleColor, colorFactor);
        
        textMesh.material.emissive = currentTextColor;

        if (elapsedTime > 5) {
          const deepPurpleColor = new THREE.Color(0x800080);
          const lightPurpleColor = new THREE.Color(0xDDBDDD);

          textColorPulseTime += textColorPulseSpeed;
          const pulseFactor = (Math.sin(textColorPulseTime) + 1) / 2;  // Gives value between 0 and 1
          const currentTextColor = new THREE.Color();

          currentTextColor.lerpColors(deepPurpleColor, lightPurpleColor, pulseFactor);
          textMesh.material.emissive = currentTextColor;
        }
      }

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <div>
      {/* Adjusted the container's styling */}
      <div ref={containerRef} style={{ width: '100vw', height: '70vh', overflow: 'hidden' }}></div>

      {/* Rest of the JSX */}
      <div style={{ 
            textAlign: 'center', 
            background: '#F3E5F5',
            color: '#800080',
          }}>
          <p>We're a friendly London-based tech community that arranges local meetups for catching up, discussing technical topic and
          working on projects. We're open to all skill levels, tech stacks and backgrounds. Whether you draw up technical designs, design
          UX, code frontend / backend or microcontrollers you're welcome to join in. See below for some links to connect and join us at our
          next event.</p>
      </div>
    </div>
  );
   
};

export default Home;
