import { move } from "./components/Player.js";

document.getElementById("forward").addEventListener("click", () => {
    move("forward");
});
document.getElementById("backward").addEventListener("click", () => {
    move("backward");
});             
document.getElementById("left").addEventListener("click", () => {
    move("left");
});
document.getElementById("right").addEventListener("click", () => {
    move("right");
}); 

window.addEventListener("keydown", (event) => { 
    switch(event.key) { 
        case "ArrowUp": 
            event.preventDefault();
            move("forward");
            break; 
        case "ArrowDown": 
            event.preventDefault();
            move("backward");
            break;
        case "ArrowLeft": 
            event.preventDefault();
            move("left");
            break;
        case "ArrowRight": 
            event.preventDefault();
            move("right");
            break; 
    }
});