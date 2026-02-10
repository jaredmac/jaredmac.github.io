import * as THREE from 'three';
import { tilesPerRow, tileSize } from '../constants.js';
import { StreetLabel } from './StreetLabel.js';

export function Road(rowIndex) {
    const road = new THREE.Group();
    road.position.y = rowIndex * tileSize;

    const foundation = new THREE.Mesh(
        new THREE.PlaneGeometry(tilesPerRow * tileSize, tileSize),
        new THREE.MeshLambertMaterial({ color: 0x454a59 })
    );
    foundation.receiveShadow = true;
    
    road.add(foundation);
    
    const labelName = randomElement(["Reed Street", "Rindge Ave", "Mass Ave", "Cedar St" ]);
    StreetLabel(road, labelName); // async, but we don't need to await

    return road;
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
