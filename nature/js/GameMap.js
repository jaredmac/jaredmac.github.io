/* Map dimensions are based on the size of the browser/mobile device */
const mapHeight = window.innerHeight / 44;
const mapWidth = window.innerWidth / 40;

class GameMap {
    constructor() {
        this.width = mapWidth;
        this.height = mapHeight;
        this.colorMap = new ColorMap();
        this.resetMap();
    }

    resetMap() {
        this.map = [];
        const perlin = new PerlinNoise();
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                const value = perlin.noise(x/20, y/20);
                if (value < -0.3) {
                    row.push('W');
                } else if (value < -0.1) {
                    row.push('S');
                } else if (value < 0.2) {
                    row.push('M');
                } else {
                    row.push('F');
                }
            }
            this.map.push(row);
        }
    }

    getCellAt(x, y) {
        return this.map[y][x];
    }

    getLeftAndBelowIfMatching(x, y) {
        return this.getIfMatching(x, y, -1, 1);
    }

    getRightAndBelowIfMatching(x, y) {
        return this.getIfMatching(x, y, 1, 1);
    }

    getIfMatching(x, y, dx, dy) {
        let result = [];
        if (this.inMapBounds(x+dx, y+dy) 
            && this.map[y][x] != this.map[y][x+dx]
            && this.map[y][x+dx] == this.map[y+dy][x] 
            && this.map[y][x+dx] == this.map[y+dy][x+dx]) {
                result[0] = this.map[y][x];
                result[1] = this.map[y][x+dx];
        }
        return result;
    }

    inMapBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    getColorAt(x, y) {
        return this.colorMap.getColorFor([this.map[y][x]]);
    }
}
