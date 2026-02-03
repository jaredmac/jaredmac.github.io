export class Position {
    constructor(row, tile) {
        this.row = row;
        this.tile = tile;
    }
    
    applyDirection(direction) {
        if (direction === "forward") {
            this.row += 1;
        } else if (direction === "backward") {
            this.row -= 1;
        } else if (direction === "left") { 
            this.tile -= 1;
        } else if (direction === "right") {
            this.tile  += 1;
        }
    }
}
