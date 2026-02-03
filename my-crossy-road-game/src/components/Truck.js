import * as THREE from 'three';
import { tileSize } from '../constants';
import { Wheel } from './Wheel.js';

export function Truck(tileIndex, direction, color) {
    const truck = new THREE.Group();
    truck.position.x = tileIndex * tileSize;
    if (!direction) truck.rotation.z = Math.PI;

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(70, 35, 35),
        new THREE.MeshLambertMaterial({ 
            color: 0xb4c6fc,
            flatShading: true
        })
    );
    body.position.x = -15;
    body.position.z = 25;
    body.castShadow = true;
    body.receiveShadow = true;

    truck.add(body);

    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(30, 30, 30),
        new THREE.MeshLambertMaterial({
            color: color,
            flatShading: true
        })
    )
    cabin.position.x = 35;
    cabin.position.z = 20;
    truck.add(cabin);

    const frontWheel = Wheel(37);
    truck.add(frontWheel);

    const midWheel = Wheel(5);
    truck.add(midWheel);

    const backWheel = Wheel(-35);
    truck.add(backWheel);

    return truck;
}