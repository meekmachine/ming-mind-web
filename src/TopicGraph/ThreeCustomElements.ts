import * as THREE from 'three';
import { MutableRefObject } from 'react';
import { GraphNode } from './GraphTypes';
import * as d3 from 'd3-scale';

const toxicityColorScale = d3.scaleLinear<string>()
    .domain([0, 0.35])
    .range(['green', 'red']);

export const createTextMaterial = (text: string, color: string, fontSize: string = '16px', fontFamily: string = 'Arial'): THREE.SpriteMaterial | undefined => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
        context.font = `${fontSize} ${fontFamily}`;
        const textMetrics = context.measureText(text);

        canvas.width = textMetrics.width + 10; // Add some padding
        canvas.height = parseInt(fontSize, 10) + 10; // Height based on font size plus padding
        context.fillStyle = color;
        context.font = `${fontSize} ${fontFamily}`; // Reset font after resizing canvas
        context.fillText(text, 5, parseInt(fontSize, 10)); // Start drawing from a small offset

        const texture = new THREE.CanvasTexture(canvas);
        return new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            opacity: 0.6
        });
    }
    return undefined;
};

export const createNodeMaterial = (node: GraphNode): THREE.SpriteMaterial | undefined => {
    const color = toxicityColorScale(node.average_toxicity_score); // Use average_toxicity_score
    return createTextMaterial(node.name, color);
};

export const focusCameraOnNode = (
    camera: THREE.Camera, 
    nodePosition: { x: number; y: number; z: number }, 
    duration: number = 2000,
    zoomDistance: number = 100
): void => {
    const startPosition = new THREE.Vector3().copy(camera.position);
    const targetPosition = new THREE.Vector3(nodePosition.x, nodePosition.y, nodePosition.z + zoomDistance);

    const startTime = Date.now();

    function animateCamera() {
        const elapsedTime = Date.now() - startTime;
        const fraction = elapsedTime / duration;

        if (fraction < 1 && camera) {
            camera.position.lerpVectors(startPosition, targetPosition, fraction);
            camera.lookAt(nodePosition.x, nodePosition.y, nodePosition.z);
            requestAnimationFrame(animateCamera);
        } else {
            camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
            camera.lookAt(nodePosition.x, nodePosition.y, nodePosition.z);
        }
    }

    animateCamera();
};

export const spinGraph = (
    graph: any,  // Using 'any' to bypass TypeScript checks for 3D force graph
    setIsNodeInteracted: MutableRefObject<boolean>
) => {
    let angle = 0;
    const rotationSpeed = 0.002;

    const rotate = () => {
        if (!setIsNodeInteracted.current && graph.camera && graph.camera.position) {
            angle += rotationSpeed;
            const camera = graph.camera as any;

            // Adjust the radius and height as needed
            const radius = 1000;
            const height = 500;

            camera.position.x = radius * Math.sin(angle);
            camera.position.z = radius * Math.cos(angle);
            camera.position.y = height;

            camera.lookAt(new THREE.Vector3(0, 0, 0));
            if (graph.renderer) {
                graph.renderer().render(graph.scene(), camera);
            }
        }
    };

    return setInterval(rotate, 100);
};
