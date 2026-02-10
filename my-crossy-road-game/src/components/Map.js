import * as THREE from 'three';
import { Grass } from "./Grass.js";
import { Tree } from "./Tree.js";
import { Road } from "./Road.js";
import { minTileIndex, maxTileIndex } from "../constants.js";

export const metadata = [];
export const map = new THREE.Group();

export function initializeMap() {
    metadata.push(generateForestMetadata());
    metadata.push(generateForestMetadata());
    metadata.push(generateForestMetadata());
    metadata.push(generateForestMetadata());
    metadata.push(generateForestMetadata());
    doMetadata(metadata, 0);
    addRows();
}

export function addRows() {
    const newMetadata = generateRows(20);
    const startIndex = metadata.length;
    metadata.push(...newMetadata);
    doMetadata(newMetadata, startIndex);
}

export function doMetadata(newMetadata, startIndex) {
    newMetadata.forEach((rowData, index) => {
        const rowIndex = startIndex + index;
        if (rowData.type === "forest") {
            const grass = Grass(rowIndex);
            rowData.trees?.forEach(({ tileIndex, height }) => {
                const tree = Tree(tileIndex, height);
                grass.add(tree);
            });
            map.add(grass);
        }

        if (rowData.type === "car" || rowData.type === "truck") {
            const road = Road(rowIndex, rowData.direction, rowData.type, rowData.vehicles);
            map.add(road);   
        }
    });
}

export function generateRows(amount) {
    const rows = [];
    for (let i = 1; i < amount; i++) {
        const rowData = generateRow();
        rows.push(rowData);
    }
    return rows;
}

function generateRow() {
    const type = randomElement(["car", "truck", "forest"]);
    if (type === "car" || type === "truck") {
        return generateVehicleMetadata(type);
    } else {
        return generateForestMetadata();
    }   
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateForestMetadata() {
    const occupiedTiles = new Set();
    const trees = Array.from({ length: 4 }, () => {
        let tileIndex;
        do {
            tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
        } while (occupiedTiles.has(tileIndex));
        occupiedTiles.add(tileIndex);
        const height = randomElement([20, 45, 60]);
        return { tileIndex, height };
    });
    return { type: "forest", trees };
}

function generateVehicleMetadata(vehicleType) {
    const direction = randomElement([true, false]);
    const speed = randomElement([125, 156, 188, 400]);
    const occupiedTiles = new Set();
    const vehicles = Array.from({ length: 3 }, () => {
        let initialTileIndex;       
        do {
            initialTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
        } while (occupiedTiles.has(initialTileIndex));

        occupiedTiles.add(initialTileIndex-1);
        occupiedTiles.add(initialTileIndex);
        occupiedTiles.add(initialTileIndex+1);
        if (vehicleType === "truck") {
            occupiedTiles.add(initialTileIndex-2);
            occupiedTiles.add(initialTileIndex+2);
        }   

        const color = randomElement([0xfe2233, 0x33fd10, 0x33c0cd, 0x33f399, 0xfde833, 0xfd33ec]);
        return { initialTileIndex, color };
    });
    return { type: vehicleType, direction, speed, vehicles };
}
