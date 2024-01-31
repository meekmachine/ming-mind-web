// src/TopicGraph/utils/zoomOutBeforeExpand.ts
import * as THREE from 'three';

export const zoomOutBeforeExpand = (
    camera: THREE.PerspectiveCamera,
    nodePosition: { x: number; y: number; z: number },
    zoomOutDistance: number = 50, // How much to zoom out
    duration: number = 200 // Duration of the zoom out effect in milliseconds
) => {
    const originalPosition = camera.position.clone();
    const direction = new THREE.Vector3().subVectors(camera.position, new THREE.Vector3(nodePosition.x, nodePosition.y, nodePosition.z)).normalize();
    const targetPosition = originalPosition.clone().add(direction.multiplyScalar(zoomOutDistance));

    const startTime = performance.now();

    const animate = () => {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const fraction = Math.min(elapsed / duration, 1);

        camera.position.lerpVectors(originalPosition, targetPosition, fraction);

        if (fraction < 1) {
            requestAnimationFrame(animate);
        } else {
            // Optionally, reset the camera back to its original position or proceed with other actions
        }
    };

    requestAnimationFrame(animate);
};
