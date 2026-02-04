import * as THREE from 'three';
import { metadata, addRows } from "./Map";
import { Position } from "./Position";

export const player = Player();
export const position = new Position(0, 0);
export const movesQueue = [];

/**
 * Move the player in the given direction, if valid.
 */
export function move(direction) {
    if (isValid(direction) && movesQueue.length < 3) {
        movesQueue.push(direction);
    }
}

export function stepCompleted() {
    const direction = movesQueue.shift();
    position.applyDirection(direction);

    // Check if we are running out of map
    if (position.row >= metadata.length - 10) { 
        addRows();
    }

    // Increment the score
    const scoreDom = document.getElementById("score");
    scoreDom.innerText = position.row.toString();
}

/**
 * Is this a valid direction given the current set of moves queued? (I.e., is
 * there an object in the way.)
 */
function isValid(direction) {
    let newPosition = new Position(position.row, position.tile);

    // Temporarily add the move
    movesQueue.push(direction);
    for (const move of movesQueue) {
        newPosition.applyDirection(move);
    }

    // Remove the temporary move
    movesQueue.pop();  

    // Out of bounds?
    if (newPosition.row < 0 || newPosition.row >= metadata.length) {
        return false;
    }

    // Hit a tree?  
    const newRow = metadata[newPosition.row];
    if (newRow.type === "forest" 
            && newRow.trees?.some(tree => tree.tileIndex === newPosition.tile)) {
        return false;
    }
    return true;
}

function Player() {
    const player = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(15, 15, 20),
        new THREE.MeshLambertMaterial({
            color: "yellow",
            flatShading: true
        })
    );
    body.position.z = 10;
    body.castShadow = true;
    body.receiveShadow = true;
    player.add(body);

    return body;
}