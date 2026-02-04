import * as THREE from 'three';
import { movesQueue, stepCompleted, player, position } from "./components/Player.js";
import { tileSize } from "./constants.js";

const moveClock = new THREE.Clock();

function setPosition(progress) {
    const startX = position.tile * tileSize;
    const startY = position.row * tileSize;
    let endX = startX;
    let endY = startY;

    if (movesQueue[0] === "left") endX -= tileSize;
    else if (movesQueue[0] === "right") endX += tileSize;
    else if (movesQueue[0] === "forward") endY += tileSize;
    else if (movesQueue[0] === "backward") endY -= tileSize;

    player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
    player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
    player.position.z = Math.sin(progress * Math.PI) * 8 + 10;
}

export function animatePlayer() {
    if (!movesQueue.length) return;
    if (!moveClock.running) { moveClock.start(); }

    const stepTime = 0.2; // Seconds it takes to step
    const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);   

    setPosition(progress);
    //setRotation(progress);

    // Once a step has ended
    if (progress >= 1) {
        stepCompleted();
        moveClock.stop();
    }
}