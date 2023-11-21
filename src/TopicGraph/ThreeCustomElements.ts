// ThreeCustomElements.ts
import { Sprite, SpriteMaterial, CanvasTexture } from 'three';

export const createTextMaterial = (text: string): SpriteMaterial | undefined => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
        context.font = '48px Lucida Sans';
        context.fillStyle = 'white';
        context.fillText(text, 0, 48);

        const texture = new CanvasTexture(canvas);
        return new SpriteMaterial({ 
            map: texture,
            transparent: true,
            opacity: 0.6
        });
    }
};
export {};
