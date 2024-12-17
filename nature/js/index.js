const rectSize = 8;
const gameHeight = rectSize * mapHeight;
const gameWidth = rectSize * mapWidth;

class MyScene extends Phaser.Scene {
    constructor() {
        super();
        this.map = new GameMap();
        this.colorMap = new ColorMap();
        this.startX = -1;
        this.startY = -1;
        this.acornsEaten = 0;
    }

    preload() {
        this.load.image("grass", "./images/grass.png");
        this.load.image("grass2", "./images/grass2.png");
        this.load.image('squirrel', './images/squirrel.png');
        this.load.image('acorn', './images/acorn.png');
    }

    create() {
        this.drawMap();

        // Create player at the center of the map
        this.createPlayer(mapWidth / 2 * rectSize, mapHeight / 2 * rectSize);

        // Randomly place some acorns
        this.placeAcorns();

        // Listen to cursor
        this.cursors = this.input.keyboard.createCursorKeys();

        // Starting message
        this.updateMessage("Help me find some nuts to eat!");
    }

    createPlayer(x, y) {
        this.player = this.physics.add.sprite(x, y, 'squirrel');
        this.mapObjs.push(this.player);
    }

    placeAcorns() {
        this.acorns = [];
        if (Math.random() > .7) {
            let x = Math.random() * this.map.width;
            let y = Math.random() * this.map.height;
            let acorn = this.physics.add.sprite(x * rectSize, y * rectSize, 'acorn');
            this.acorns.push(acorn);
            this.mapObjs.push(acorn);
        }
        this.physics.add.overlap(this.player, this.acorns, this.collectAcorn, null, this);
    }

    collectAcorn(player, acorn) {
        if (this.acornsEaten < 4) {
            acorn.disableBody(true, true);
            this.acorns.splice(this.acorns.indexOf(acorn), 1);
            this.acornsEaten++;
            if (this.acornsEaten == 4) {
                this.updateMessage("Yum, but I'm full now. Time to take a nap.");
            } else {
                this.updateMessage("Yum!");
            }
        } else {
            this.updateMessage("I can't eat any more.");
        }
    }

    updateMessage(message) {
        document.getElementById('game-message').innerHTML = message;
        setTimeout(function() {
            document.getElementById('game-message').innerHTML = "";
        }, 5000);
    }

    drawMap() {
        this.mapObjs = [];
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
                            let image = this.add.image(x*rectSize, 
                                y*rectSize, 
                                Math.random() > .5 ? "grass" : "grass2").setOrigin(0, 0);
                            this.mapObjs.push(image);
                        } else {
                            let color = this.map.getColorAt(x, y);
                            let rect = new Phaser.GameObjects.Rectangle(this, 
                                x*rectSize, 
                                y*rectSize, 
                                rectSize, 
                                rectSize, color).setOrigin(0, 0);
                            this.mapObjs.push(rect);
                            this.add.existing(rect);
                        }
                    }
                }
            }
        }
    }

    drawLeftAndBelowTriangles(x, y, c1, c2) {
        let g = new Phaser.GameObjects.Graphics(this);
        this.drawTriangle(g, c1, x, y, [0,0], [1,0], [1,1]);
        this.drawTriangle(g, c2, x, y, [0,0], [0,1], [1,1]);
        this.add.existing(g);
        this.mapObjs.push(g);
    }

    drawRightAndBelowTriangles(x, y, c1, c2) {
        let g = new Phaser.GameObjects.Graphics(this);
        this.drawTriangle(g, c1, x, y, [0,0], [1,0], [0,1]);
        this.drawTriangle(g, c2, x, y, [1,0], [1,1], [0,1]);
        this.add.existing(g);
        this.mapObjs.push(g);
    }

    drawTriangle(g, c1, x, y, v1, v2, v3) {
        g.fillStyle(this.colorMap.getColorFor(c1));
        g.beginPath();
        g.moveTo(x*rectSize+rectSize*v1[0], y*rectSize+rectSize*v1[1]);
        g.lineTo(x*rectSize+rectSize*v2[0], y*rectSize+rectSize*v2[1]);
        g.lineTo(x*rectSize+rectSize*v3[0], y*rectSize+rectSize*v3[1]);
        g.fillPath();
    }


    update() {
        this.movePlayer();
        if (this.playerIsOutOfBounds()) {
            this.moveScreen(this.player.x, this.player.y);
        }
    }

    moveScreen(newPlayerX, newPlayerY) {
        this.mapObjs.forEach(obj => {
            obj.destroy();
        });
        this.map.resetMap();
        this.drawMap();

        // Compute the new player location
        if (newPlayerX < 0) {
            newPlayerX = gameWidth - rectSize;
        } else if (newPlayerX > gameWidth) {
            newPlayerX = 0;
        }
        if (newPlayerY < 0) {
            newPlayerY = gameHeight - rectSize;
        } else if (newPlayerY > gameHeight) {
            newPlayerY = 0;
        }
        this.createPlayer(newPlayerX, newPlayerY);
        this.placeAcorns();
    }

    playerIsOutOfBounds() {
        return !this.inScreenBounds(this.player.x, this.player.y);
    }

    inScreenBounds(x, y) {
        return x >= 0 && x < gameWidth && y >= 0 && y < gameHeight;
    }

    movePlayer() {
        // Keyboard input
        let maxVelocity = 60;
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -maxVelocity;
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = maxVelocity;
        } else {
            this.player.body.velocity.x = 0;
        }

        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -maxVelocity;
        } else if (this.cursors.down.isDown) {
            this.player.body.velocity.y = maxVelocity;
        } else {
            this.player.body.velocity.y = 0;
        }

        // Mouse/finger input
        if (this.input.pointer1.isDown) {
            if (this.startX == -1) {
                this.startX = this.input.pointer1.worldX;
                this.startY = this.input.pointer1.worldY;
            } else {
                let dx = (this.input.pointer1.worldX - this.startX) * 2;
                let dy = (this.input.pointer1.worldY - this.startY) * 2;
                this.player.body.velocity.x = this.clamp(dx, -maxVelocity, maxVelocity);
                this.player.body.velocity.y = this.clamp(dy, -maxVelocity, maxVelocity);
            }
        } else {
            this.startX = -1;
            this.startY = -1;
        }

        // Flip the sprite accordingly
        this.player.flipX = this.player.body.velocity.x > 0 ? true : false;
    }

    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
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
