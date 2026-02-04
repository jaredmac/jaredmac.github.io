import * as THREE from 'three';
import { Renderer } from "./components/Renderer.js";
import { Camera } from "./components/Camera.js";
import { DirectionalLight } from "./components/DirectionalLight.js";
import { player } from "./components/Player.js";
import { map, initializeMap } from "./components/Map.js";
import { animateVehicles } from "./animateVehicles.js";
import { animatePlayer } from "./animatePlayer.js";
import { hitTest } from "./hitTest.js";
import "./collectUserInput.js";

const scene = new THREE.Scene();
scene.add(player);
scene.add(map);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const dirLight = DirectionalLight();
dirLight.target = player;
player.add(dirLight);

const camera = Camera();
player.add(camera);  

initializeGame();
function initializeGame() {
  initializeMap();
  console.log("In initializeGame(): " + __THREE__);
}

const renderer = Renderer();
renderer.render(scene, camera);
renderer.setAnimationLoop(animate);

function animate() {
  animateVehicles();
  animatePlayer();
  if (hitTest()) {
    document.getElementById("final-score").innerText = document.getElementById("score").innerText;
    document.getElementById("game-over").style.visibility = "visible";
    renderer.setAnimationLoop(null);  
    return;
  }
  renderer.render(scene, camera);
}