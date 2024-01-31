// src/TopicGraph/hooks/useThreeSetup.ts
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

export const useThreeSetup = (containerRef: React.RefObject<HTMLDivElement>) => {
  const composerRef = useRef<EffectComposer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 100;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composerRef.current = composer;

    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [containerRef]);

  return composerRef;
};