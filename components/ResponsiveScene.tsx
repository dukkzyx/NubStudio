"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type ResponsiveSceneProps = {
  reducedMotion: boolean;
};

const models = [
  {
    path: "/tablet.glb",
    position: new THREE.Vector3(-0.78, 0.18, -0.04),
    rotation: new THREE.Euler(0.06, -0.28, -0.05),
    size: 2.32,
  },
  {
    path: "/celular.glb",
    position: new THREE.Vector3(0.96, 0.12, 0.18),
    rotation: new THREE.Euler(0.06, 0.28, 0.06),
    size: 1.76,
  },
] as const;

const clamp = THREE.MathUtils.clamp;
const ease = (value: number) => 1 - Math.pow(1 - clamp(value, 0, 1), 3);
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

function createScreenContent({
  compact,
  title,
  lines,
}: {
  compact?: boolean;
  title: string;
  lines: string[];
}) {
  const canvas = document.createElement("canvas");
  canvas.width = compact ? 420 : 680;
  canvas.height = compact ? 720 : 430;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const radius = compact ? 30 : 28;
  context.fillStyle = "#101823";
  context.beginPath();
  context.roundRect(0, 0, canvas.width, canvas.height, radius);
  context.fill();

  const padding = compact ? 36 : 42;
  const heroHeight = compact ? 120 : 92;
  const heroGradient = context.createLinearGradient(0, padding, canvas.width, padding + heroHeight);
  heroGradient.addColorStop(0, "#8ed8ff");
  heroGradient.addColorStop(1, "#d9f99d");
  context.fillStyle = heroGradient;
  context.beginPath();
  context.roundRect(padding, padding, canvas.width - padding * 2, heroHeight, 24);
  context.fill();

  context.fillStyle = "#071015";
  context.font = `800 ${compact ? 28 : 30}px Inter, Arial, sans-serif`;
  context.fillText(title, padding + 24, padding + (compact ? 76 : 58));

  let y = padding + heroHeight + (compact ? 50 : 46);
  context.lineCap = "round";
  lines.forEach((line, index) => {
    context.fillStyle = index === 0 ? "#f7f8fb" : "#a9afbd";
    context.font = `${index === 0 ? 800 : 650} ${compact ? 22 : 24}px Inter, Arial, sans-serif`;
    context.fillText(line, padding, y);
    y += compact ? 42 : 38;
  });

  const cardTop = y + (compact ? 26 : 18);
  const cards = compact ? 3 : 4;
  const gap = compact ? 22 : 20;
  const cardHeight = compact ? 72 : 78;
  const cardWidth = compact
    ? canvas.width - padding * 2
    : (canvas.width - padding * 2 - gap * (cards - 1)) / cards;

  for (let index = 0; index < cards; index += 1) {
    const x = compact ? padding : padding + index * (cardWidth + gap);
    const yPos = compact ? cardTop + index * (cardHeight + gap) : cardTop;
    context.fillStyle = index % 2 === 0 ? "rgba(142, 216, 255, 0.22)" : "rgba(217, 249, 157, 0.22)";
    context.beginPath();
    context.roundRect(x, yPos, cardWidth, cardHeight, 18);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.flipY = false;
  return texture;
}

export default function ResponsiveScene({ reducedMotion }: ResponsiveSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0.1, 7.35);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    mount.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    keyLight.position.set(3.6, 4.2, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbdd7ff, 2.2);
    fillLight.position.set(-4, 2, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd9f99d, 2.6);
    rimLight.position.set(0, 2.2, -4);
    scene.add(rimLight);

    scene.add(new THREE.AmbientLight(0xffffff, 1.08));

    const modelRoot = new THREE.Group();
    modelRoot.position.y = 1.08;
    modelRoot.rotation.y = -0.48;
    scene.add(modelRoot);

    let frameId = 0;
    let targetRotation = -0.48;
    let targetScale = 1;
    let targetX = 0;
    let targetY = 1.08;
    const loader = new GLTFLoader();

    models.forEach(({ path, position, rotation, size }) => {
      loader.load(path, (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const modelSize = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxAxis = Math.max(modelSize.x, modelSize.y, modelSize.z) || 1;

        model.position.sub(center).add(position);
        model.scale.setScalar(size / maxAxis);
        model.rotation.copy(rotation);

        const isTablet = path.includes("tablet");
        const screenTexture = createScreenContent(
          isTablet
            ? {
                title: "Nub Studio",
                lines: ["Webs rapidas", "Diseno responsive", "Lista para vender"],
              }
            : {
                compact: true,
                title: "Web premium",
                lines: ["Cotiza facil", "Carga rapida", "Mobile first"],
              },
        );

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const childName = child.name.toLowerCase();
            const isScreen =
              childName.includes("screen") ||
              childName.includes("display") ||
              childName.includes("glass tablet") ||
              childName.includes("black glass");
            const isOldInterface =
              childName.includes("content tile") ||
              childName.includes("interface line") ||
              childName.includes("screen glow");

            if (isOldInterface) child.visible = false;
            if (screenTexture && isScreen) {
              child.material = new THREE.MeshBasicMaterial({
                map: screenTexture,
                toneMapped: false,
              });
            }
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        modelRoot.add(model);
      });
    });

    const resize = () => {
      const width = Math.max(mount.clientWidth, 280);
      const height = Math.max(mount.clientHeight, 280);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onScroll = () => {
      const rect = mount.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const section = mount.closest("section");
      const sectionRect = section?.getBoundingClientRect() ?? rect;
      const scrollable = Math.max(sectionRect.height - viewport, 1);
      const progress = clamp(-sectionRect.top / scrollable, 0, 1);
      const rotateStage = ease(progress / 0.16);
      const tabletStage = ease((progress - 0.14) / 0.2);
      const phoneStage = ease((progress - 0.56) / 0.2);
      const resetStage = ease((progress - 0.9) / 0.1);

      targetRotation = -0.5 + rotateStage * 0.9;
      targetScale = mix(1, 1.48, tabletStage);
      targetX = mix(0, 0.58, tabletStage);
      targetY = mix(1.08, 0.78, tabletStage);

      if (phoneStage > 0) {
        targetScale = mix(1.48, 1.58, phoneStage);
        targetX = mix(0.58, -1.02, phoneStage);
        targetY = mix(0.78, 0.74, phoneStage);
        targetRotation = mix(targetRotation, -0.22, phoneStage);
      }

      if (resetStage > 0) {
        targetScale = mix(targetScale, 1, resetStage);
        targetX = mix(targetX, 0, resetStage);
        targetY = mix(targetY, 1.08, resetStage);
        targetRotation = mix(targetRotation, -0.5, resetStage);
      }
    };

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      modelRoot.rotation.y += (targetRotation - modelRoot.rotation.y) * 0.07;
      modelRoot.position.x += (targetX - modelRoot.position.x) * 0.075;
      modelRoot.position.y += (targetY - modelRoot.position.y) * 0.075;
      modelRoot.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.075);
      if (!reducedMotion) modelRoot.position.y += Math.sin(performance.now() * 0.001) * 0.006;
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
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            const mappedMaterial = material as THREE.Material & { map?: THREE.Texture };
            if (mappedMaterial.map) mappedMaterial.map.dispose();
            material.dispose();
          });
        }
      });
    };
  }, [reducedMotion]);

  return (
    <div
      ref={mountRef}
      className="responsive-scene"
      aria-label="Modelos 3D de celular y tablet que rotan al desplazarse"
    />
  );
}
