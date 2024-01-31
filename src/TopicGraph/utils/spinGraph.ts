// Implements spinning animation for the graph
import { MutableRefObject } from 'react';
import * as THREE from 'three';

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