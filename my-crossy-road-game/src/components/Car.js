import * as THREE from 'three';
import { tileSize } from '../constants';
import { Wheel } from './Wheel.js';

export function Car(tileIndex, direction, color) {
    const car = new THREE.Group();
    car.position.x = tileIndex * tileSize;
    if (!direction) car.rotation.z = Math.PI;

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(60, 30, 15),
        new THREE.MeshLambertMaterial({ 
            color: color,
            flatShading: true
        })
    );
    body.position.z = 12;
    body.castShadow = true;
    car.add(body);

    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(33, 24, 12),
        new THREE.MeshLambertMaterial({
            color: "white",
            flatShading: true
        })
    )
    cabin.position.x = -6;
    cabin.position.z = 25.5;
    car.add(cabin);

    const frontWheel = Wheel(18)
    car.add(frontWheel);

    const backWheel = Wheel(-18)
    car.add(backWheel);

    return car;
}