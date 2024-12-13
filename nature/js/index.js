
const rectSize = 8;

/* variable-browser window (e.g. mobile)-friendly map dimensions */
const mapHeight = window.innerHeight / 44;
const mapWidth = window.innerWidth / 40;

const gameHeight = rectSize * mapHeight;
const gameWidth = rectSize * mapWidth;

const colorMap = new ColorMap();

class MyMap {
    constructor() {
        this.width = mapWidth;
        this.height = mapHeight;

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
        let result = new Array();
        if (this.inBounds(x+dx, y+dy) 
            && this.map[y][x] != this.map[y][x+dx]
            && this.map[y][x+dx] == this.map[y+dy][x] 
            && this.map[y][x+dx] == this.map[y+dy][x+dx]) {
                result[0] = this.map[y][x];
                result[1] = this.map[y][x+dx];
        }
        return result;
    }

    inBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    getColorAt(x, y) {
        return colorMap.getColorFor([this.map[y][x]]);
    }
    
    isWaterAt(px, py) {
        let x = Math.floor(px / rectSize);
        let y = Math.floor(py / rectSize);
        return this.map[y][x] == 'W';
    }
}

class MyScene extends Phaser.Scene {
    constructor() {
        super();
        this.map = new MyMap();
    }

    preload() {
        this.load.image("grass", "./images/grass.png");
        this.load.image("grass2", "./images/grass2.png");
        this.load.image('squirrel', './images/squirrel.png');
    }

    create() {
        // Draw map
        for (var y = 0; y < this.map.height; y++) {
            for (var x = 0; x < this.map.width; x++) { 
                var types = this.map.getLeftAndBelowIfMatching(x, y);
                if (types.length == 2) {
                    this.drawLeftAndBelowTriangles(x, y, types[0], types[1]);
                } else {
                    types = this.map.getRightAndBelowIfMatching(x, y);
                    if (types.length == 2) {
                        this.drawRightAndBelowTriangles(x, y, types[0], types[1]);
                    } else {
                        if (this.map.getCellAt(x, y) == 'M' && Math.random() > .95) {
                            this.add.image(x*rectSize, y*rectSize, Math.random() > .5 ? "grass" : "grass2").setOrigin(0, 0);
                        } else {
                            let color = this.map.getColorAt(x, y);
                            let rect = new Phaser.GameObjects.Rectangle(this, 
                                x*rectSize, y*rectSize, 
                                rectSize, rectSize, color).setOrigin(0, 0);
                            this.add.existing(rect);
                        }
                    }
                }
            }
        }

        // Create player
        this.player = this.physics.add.sprite(100, 100, 'squirrel');

        // Listen to cursor
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.movePlayer();
        if (this.map.isWaterAt(this.player.body.x, this.player.body.y)) {
        }
    }

    movePlayer() {
        let dx = 40;
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -dx;
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = dx;
        } else {
            this.player.body.velocity.x = 0;
        }

        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -dx;
        } else if (this.cursors.down.isDown) {
            this.player.body.velocity.y = dx;
        } else {
            this.player.body.velocity.y = 0;
        }
    }

    drawLeftAndBelowTriangles(x, y, c1, c2) {
        let g = new Phaser.GameObjects.Graphics(this);
        this.drawTriangle(g, c1, x, y, [0,0], [1,0], [1,1]);
        this.drawTriangle(g, c2, x, y, [0,0], [0,1], [1,1]);
        this.add.existing(g);
    }

    drawRightAndBelowTriangles(x, y, c1, c2) {
        let g = new Phaser.GameObjects.Graphics(this);
        this.drawTriangle(g, c1, x, y, [0,0], [1,0], [0,1]);
        this.drawTriangle(g, c2, x, y, [1,0], [1,1], [0,1]);
        this.add.existing(g);
    }

    drawTriangle(g, c1, x, y, v1, v2, v3) {
        g.fillStyle(colorMap.getColorFor(c1));
        g.beginPath();
        g.moveTo(x*rectSize+rectSize*v1[0], y*rectSize+rectSize*v1[1]);
        g.lineTo(x*rectSize+rectSize*v2[0], y*rectSize+rectSize*v2[1]);
        g.lineTo(x*rectSize+rectSize*v3[0], y*rectSize+rectSize*v3[1]);
        g.fillPath();
    }
}

const config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    pixelArt: true,
    parent: 'game-container',
    scale: {
        zoom: 4.5
    },
    physics: {
        default: 'arcade'
    },
    scene: MyScene
};

const game = new Phaser.Game(config);
