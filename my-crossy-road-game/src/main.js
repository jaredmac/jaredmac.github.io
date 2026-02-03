import * as THREE from "three";
import { Renderer } from "./components/Renderer";
import { Camera } from "./components/Camera";
import { DirectionalLight } from "./components/DirectionalLight";
import { player } from "./components/Player";
import { map, initializeMap } from "./components/Map";
import { animateVehicles } from "./animateVehicles";
import { animatePlayer } from "./animatePlayer";
import { hitTest } from "./hitTest";
import "./collectUserInput.js";
import './style.css'

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