import { move } from "./components/Player.js";

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