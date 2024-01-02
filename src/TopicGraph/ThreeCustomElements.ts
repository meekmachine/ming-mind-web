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

export const spinGraph = (
    graph: any,  // Using 'any' to bypass TypeScript checks
    setIsNodeInteracted: MutableRefObject<boolean>
) => {
    let angle = 0;
    const rotationSpeed = 0.002;

    const rotate = () => {
        if (graph.camera && graph.camera.position && !setIsNodeInteracted.current) {

            angle += rotationSpeed;
            const camera = graph.camera as THREE.Camera;
            camera.position.x = 1000 * Math.sin(angle);
            camera.position.z = 1000 * Math.cos(angle);
            camera.lookAt(new THREE.Vector3(0, 0, 0)); // Assuming looking at the center
        }
    };
    return setInterval(rotate, 100);
};

export const setupNodeHover = (
    graph: any, // Using 'any' to bypass TypeScript checks
    setIsNodeInteracted: MutableRefObject<boolean>
) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (event) => {
        // Check if the camera and scene are defined
        if (!graph.camera || !graph.scene) {
            return;
        }

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, graph.camera as THREE.Camera);
        const intersects = raycaster.intersectObjects(graph.scene.children);

        if (intersects.length > 0) {
            setIsNodeInteracted.current = true;
            const intersectedNode = intersects[0].object as any as GraphNode;
            // Implement logic for focusing on the node
        } else {
            setIsNodeInteracted.current = false;
        }
    });
};

// ... other functions
