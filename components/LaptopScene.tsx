"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type LaptopSceneProps = {
  reducedMotion: boolean;
};

export default function LaptopScene({ reducedMotion }: LaptopSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.18, 5.7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    mount.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.5);
    keyLight.position.set(3.2, 4.5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbdd7ff, 2);
    fillLight.position.set(-4, 1.8, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd6b7, 2.6);
    rimLight.position.set(0, 2, -4);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.05);
    scene.add(ambientLight);

    const modelRoot = new THREE.Group();
    scene.add(modelRoot);

    let model: THREE.Object3D | null = null;
    let frameId = 0;
    let targetRotation = 0;

    const loader = new GLTFLoader();
    loader.load("/laptop.glb", (gltf) => {
      model = gltf.scene;

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxAxis = Math.max(size.x, size.y, size.z) || 1;

      model.position.sub(center);
      model.scale.setScalar(2.45 / maxAxis);
      model.rotation.set(-0.02, -0.24, 0);

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      modelRoot.add(model);
    });

    const resize = () => {
      const width = Math.max(mount.clientWidth, 280);
      const height = Math.max(mount.clientHeight, 280);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onScroll = () => {
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollRange > 0 ? window.scrollY / scrollRange : 0;
      targetRotation = -0.18 + progress * Math.PI * 1.65;
    };

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      if (model) {
        modelRoot.rotation.y += (targetRotation - modelRoot.rotation.y) * 0.065;
        modelRoot.rotation.x = 0;
        if (!reducedMotion) modelRoot.position.y = Math.sin(performance.now() * 0.001) * 0.035;
      }
      renderer.render(scene, camera);
    };

    resize();
    onScroll();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, [reducedMotion]);

  return (
    <div
      ref={mountRef}
      className="laptop-scene"
      aria-label="Modelo 3D de laptop que rota suavemente al desplazarse"
    />
  );
}
