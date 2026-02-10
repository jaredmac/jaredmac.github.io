import * as THREE from 'three';
import { tilesPerRow, tileSize } from '../constants.js';
import { Car } from './Car.js';
import { Truck } from './Truck.js';
import { StreetLabel } from './StreetLabel.js';

export function Road(rowIndex, direction, vehicleType, vehicles) {
    const road = new THREE.Group();
    road.position.y = rowIndex * tileSize;

    const foundation = new THREE.Mesh(
        new THREE.PlaneGeometry(tilesPerRow * tileSize, tileSize),
        new THREE.MeshLambertMaterial({ color: 0x454a59 })
    );
    foundation.receiveShadow = true;
    
    road.add(foundation);
    
    const labelName = randomElement(["Reed Street", "Rindge Ave", "Mass Ave", "Cedar Street" ]);
    StreetLabel(road, labelName); 

    // Add the vehicles to the road
    vehicles.forEach((vehicleData) => {
        console.log("vehicleData.direction is " + vehicleData.direction);
        const vehicle = vehicleType === "car" 
            ? Car(vehicleData.initialTileIndex, 
                direction, 
                vehicleData.color) 
            : Truck(vehicleData.initialTileIndex, 
                direction, 
                vehicleData.color);
            vehicleData.ref = vehicle;
        road.add(vehicle);
    });

    return road;
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
