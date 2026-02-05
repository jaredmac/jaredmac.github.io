import * as THREE from 'three';
import { StreetLabel } from "./StreetLabel.js";
import { tilesPerRow, tileSize } from '../constants.js';

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
    new StreetLabel(road, labelName);

    return road;
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
