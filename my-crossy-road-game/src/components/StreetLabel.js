import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

export function StreetLabel(parent, text) {
    const loader = new FontLoader();
    loader.load("https://cdn.jsdelivr.net/npm/three@0.182.0/examples/fonts/helvetiker_regular.typeface.json",
        function (font) {   
            console.log("font is " + font);
            const geometry = new TextGeometry(text, {
                font: font,
                size: 20,
                depth: 1
            });
            const material = new THREE.MeshBasicMaterial({ color: 0x666666 });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(-1, -8, 0);
            parent.add(mesh);
        });
}