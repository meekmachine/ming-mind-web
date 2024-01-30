// Handles camera focusing on a node
import * as THREE from 'three';

export const focusCameraOnNode = (
    camera: THREE.Camera, 
    nodePosition: { x: number; y: number; z: number }, 
    duration: number = 2000,
    zoomDistance: number = 100
): void => {
    const startPosition = new THREE.Vector3().copy(camera.position);
    const targetPosition = new THREE.Vector3(nodePosition.x, nodePosition.y, nodePosition.z + zoomDistance);

    const animateCamera = (time: number) => {
        const elapsedTime = time - startTime;
        const fraction = elapsedTime / duration;

        if (fraction < 1) {
            camera.position.lerpVectors(startPosition, targetPosition, fraction);
            camera.lookAt(nodePosition.x, nodePosition.y, nodePosition.z);
            requestAnimationFrame(animateCamera);
        } else {
            camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
            camera.lookAt(nodePosition.x, nodePosition.y, nodePosition.z);
        }
    };

    const startTime = performance.now();
    requestAnimationFrame(animateCamera);
};
