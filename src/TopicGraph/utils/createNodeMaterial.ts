// Creates material for graph nodes
import * as THREE from 'three';
import { GraphNode } from '../GraphTypes';
import * as d3 from 'd3-scale';

const toxicityColorScale = d3.scaleLinear<string>()
    .domain([0, 1]) // Example domain
    .range(['green', 'red']); // Example range

export const createNodeMaterial = (node: GraphNode): THREE.SpriteMaterial | undefined => {
    const color = toxicityColorScale(node.average_toxicity_score || 0);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
        context.font = '16px Arial';
        context.fillStyle = color;
        context.fillText(node.name, 0, 16);
        const texture = new THREE.CanvasTexture(canvas);
        return new THREE.SpriteMaterial({ map: texture, transparent: true });
    }
    return undefined;
};
