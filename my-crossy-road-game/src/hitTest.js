import * as THREE from 'three';
import { metadata as rows } from "./components/Map.js";
import { player, position } from "./components/Player.js";

export function hitTest() {
    let hit = false;
    const row = rows[position.row];
    if (row && (row.type === "car" || row.type === "truck")) {
        const playerBoundingBox = new THREE.Box3().setFromObject(player);
        row.vehicles.forEach((vehicle) => {
            const vehicleBoundingBox = new THREE.Box3().setFromObject(vehicle.ref);
            if (playerBoundingBox.intersectsBox(vehicleBoundingBox)) {
                hit = true;
            }
        });
    }
    return hit;
}