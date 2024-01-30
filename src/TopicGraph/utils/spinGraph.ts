// Implements spinning animation for the graph
import * as THREE from 'three';

export const spinGraph = (
    graph: any, // Use the appropriate type for your graph
    setIsNodeInteracted: React.MutableRefObject<boolean>
): NodeJS.Timer => {
    let angle = 0;
    const rotationSpeed = 0.002;

    const rotate = () => {
        if (!setIsNodeInteracted.current) {
            angle += rotationSpeed;
            const camera = graph.camera as THREE.PerspectiveCamera;
            camera.position.x = Math.sin(angle) * 1000; // Example values
            camera.position.z = Math.cos(angle) * 1000;
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
    };

    return setInterval(rotate, 100);
};
