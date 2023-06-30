/*
 * - easy mode and hard mode
 * - Satisfying splash animation when letter hits the bottom
 * - Satisfying success animation
 * - Make dark mode stick
 */
class Board {
    constructor(rows, cols, answers) {
        this.cols = cols;
        this.rows = rows;
        this.index = 0;
        this.answers = answers;
        this.availableLetters = answers[3];
        this.attempts = 0;
        var boardElem = document.getElementById('board');

        this.grid = new Array(rows);
        for (let r = 0; r < rows; r++) {
			this.grid[r] = new Array(cols);
			for (let c = 0; c < this.grid[r].length; c++) {
                this.createBlankTile(boardElem, r, c);
            }
		}

        this.pickNextLetter();

        const b = this;
        window.addEventListener("keydown", function handleKeyDown(e) {
            if (e.key == 'ArrowLeft') {
                b.moveLeft();
            } else if (e.key == 'ArrowRight') {
                b.moveRight();
            } else if (e.key == ' ' || e.key == 'ArrowDown') {
                b.drop();
            }
        });
    }

    tryAgain() {
        this.availableLetters = this.answers[3];
        for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.cols; c++) {
                this.clearLetter(r, c);
            }
		}
        this.pickNextLetter();
    }

    createBlankTile(boardElem, r, c) {
        this.grid[r][c] = {};
        this.grid[r][c].letter = ' ';

        const tile = document.createElement('div');
        const b = this;
        tile.addEventListener("click", function handleClick(e) {
            b.dropAt(c);
        });

        tile.classList.add('tile');
        if (r == 0) {
            tile.classList.add('currentTile');
        }
        tile.textContent = this.grid[r][c].letter;
        this.grid[r][c].tile = tile;
        boardElem.appendChild(tile);
    }

    pickNextLetter() {
        // Pick next letter
        const index = Math.floor(Math.random() * this.availableLetters.length);
        this.letter = this.availableLetters.charAt(index);
        this.setLetter(0, this.index, this.letter);

        // Update available locations
        for (let c = 0; c < this.cols; c++) {
            let r = this.getAvailableRowInColumn(c);
            if (r) {    
                this.grid[r][c].tile.classList.add('available');
            }
        }
    }

    isBlank(r, c) {
        return this.getLetter(r, c) == ' ';
    }

    getLetter(r, c) {
        return this.grid[r][c].letter;
    }

    setLetter(r, c, l) {
        this.grid[r][c].letter = l;
        this.grid[r][c].tile.textContent = l;
    }

    clearLetter(r, c) {
        this.setLetter(r, c, ' ');
        this.grid[r][c].tile.classList.remove('filled');
        this.grid[r][c].tile.classList.remove('correct');
        this.grid[r][c].tile.classList.remove('available');
    }

    moveLeft() {
        this.move(this.index - 1);
    }

    moveRight() {
        this.move(this.index + 1);
    }

    move(newIndex) {
        this.clearLetter(0, this.index);
        this.index = Math.max(Math.min(newIndex, this.cols - 1), 0);
        this.setLetter(0, this.index, this.letter);
    }

    drop() {
        this.dropAt(this.index);
    }

    dropAt(c) {
        let r = this.getAvailableRowInColumn(c);
        if (r) {
            this.setLetter(r, c, this.letter);
            let answerLetter = this.answers[r-1].charAt(c);
            this.availableLetters = this.availableLetters.replace(this.letter, '');
            if (r - 2 >= 0) {
                this.availableLetters = this.availableLetters + this.answers[r - 2].charAt(c);
            }
            this.grid[r][c].tile.classList.add('filled');
            if (this.letter == answerLetter) {
                this.grid[r][c].tile.classList.add('correct');
            } 
            this.pickNextLetter();
        }
    }
    
    /**
     * Get the lowest available row in the given column.
     */
    getAvailableRowInColumn(c) {
        for (let r = this.grid.length - 1; r > 0; r--) {
            if (this.isBlank(r, c)) {
                return r;
            }
        }
        return null;
    }
}

var globals = {

};

function init() {
    const wordChoices = [
        ["COOK","STIR","CHOP","DICE"],
        ["RICE","BEAN","TACO","CHIP"],
        ["KICK","BALL","GOAL","CLUB"],
        ["CARS","ROAD","LANE","MILE"],
        ["INCH","FOOT","YARD","MILE"],
        ["DRUM","BASS","KICK","ROCK"],
        ["BABY","TOYS","CRIB","PLAY"],
        ["BLUE","GRAY","PINK","CYAN"],
        ["HAND","FOOT","HEAD","FACE"]
    ];

    // Pick a set of words based on the URL param for now, or on the day of the month if none is provided
    const url = new URL(window.location.toLocaleString()).searchParams;
    const id = url.get('id');
    const index = id ? parseInt(id) : new Date().getDay();
    globals.b = new Board(5, 4, wordChoices[index % wordChoices.length]);
}

function tryAgain() {
    globals.b.tryAgain();
}

function toggleLightDark() {
    let body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("light-mode")) {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
    }
}

function startGame() {
    fadeOut(document.getElementById("intro"));
    s
}

function fadeOut(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 20);
}
