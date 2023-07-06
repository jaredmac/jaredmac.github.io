/*
 * - add an animation on the intro screen showing how it works
 * - easy mode and hard mode: easy you get to replace the tiles?
 * - Satisfying success animation
 */
class Tile {
    constructor(boardElem, r, listener) {
        this.letter = ' ';
        this.tile = document.createElement('div');
        this.tile.classList.add('tile');
        this.correct = false;
        this.listener = listener;

        if (r == 0) {
            this.tile.classList.add('currentTile');
        }
        this.tile.textContent = this.letter;
        boardElem.appendChild(this.tile);
    }

    isCorrect() {
        return this.correct;
    }

    dropLetter(letter, correctLetter) {
        this.setLetter(letter);
        this.tile.classList.add('filled');
        if (letter == correctLetter) {
            this.tile.classList.add('correct');
            this.correct = true;
        } 
    }

    setLetter(l) {
        this.letter = l;
        this.tile.textContent = l;
        this.tile.removeEventListener('click', this.listener);
    }

    clearLetter() {
        this.setLetter(' ');
        this.tile.classList.remove('filled');
        this.tile.classList.remove('correct');
        this.tile.classList.remove('available');
    }

    setAvailable() {
        this.tile.classList.add('available');
        this.tile.addEventListener('click', this.listener);
    }
}

class Board {
    constructor(rows, cols, answers) {
        this.cols = cols;
        this.rows = rows;
        this.index = 0;
        this.answers = answers;
        this.availableLetters = answers[3];
        this.attempts = 0;
        let boardElem = document.getElementById('board');

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
        for (let r of this.grid) {
			for (let c of r) {
                c.clearLetter();
            }
		}
        this.pickNextLetter();
    }

    createBlankTile(boardElem, r, c) {
        const b = this;
        this.grid[r][c] = new Tile(boardElem, r, function handleClick(e) {
            b.dropAt(c);
        });
    }

    pickNextLetter() {
        if (this.availableLetters.length == 0) {
            this.endGame();
        } else {
            // Pick next letter
            const index = Math.floor(Math.random() * this.availableLetters.length);
            this.letter = this.availableLetters.charAt(index);
            this.setLetter(0, this.index, this.letter);

            // Update available grid locations
            for (let c = 0; c < this.cols; c++) {
                let r = this.getAvailableRowInColumn(c);
                if (r) {    
                    this.grid[r][c].setAvailable();
                }
            }
        }
    }

    endGame() {
        var correct = true;
        for (let c = 0; c < this.cols; c++) {
            for (let r = 1; r < this.rows; r++) {
                if (!this.grid[r][c].isCorrect()) {
                    correct = false;
                } 
            }
        }
        console.log("the end: " + correct);
    }

    isBlank(r, c) {
        return this.getLetter(r, c) == ' ';
    }

    getLetter(r, c) {
        return this.grid[r][c].letter;
    }

    setLetter(r, c, l) {
        this.grid[r][c].setLetter(l);
    }

    moveLeft() {
        this.move(this.index - 1);
    }

    moveRight() {
        this.move(this.index + 1);
    }

    move(newIndex) {
        this.grid[0][this.index].clearLetter();
        this.index = Math.max(Math.min(newIndex, this.cols - 1), 0);
        this.setLetter(0, this.index, this.letter);
    }

    drop() {
        this.dropAt(this.index);
    }

    dropAt(c) {
        let r = this.getAvailableRowInColumn(c);
        if (r) {
            let answerLetter = this.answers[r-1].charAt(c);
            this.grid[r][c].dropLetter(this.letter, answerLetter);
            this.availableLetters = this.availableLetters.replace(this.letter, '');
            if (r - 2 >= 0) {
                this.availableLetters = this.availableLetters + this.answers[r - 2].charAt(c);
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

function init(daily) {
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

    const index = daily ? new Date().getDay() : Math.floor(Math.random() * 1024);
    globals.b = new Board(5, 4, wordChoices[index % wordChoices.length]);
}

function tryAgain() {
    globals.b.tryAgain();
}

function initColors() {
    const colorMode = localStorage.getItem("colorMode");
    if (colorMode == "dark") {
        toggleLightDark();
    }
}

function toggleLightDark() {
    let body = document.body;
    if (body.classList.contains("light-mode")) {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        localStorage.setItem("colorMode", "dark");
    } else {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        localStorage.setItem("colorMode", "light");
    }
}

function startGame(daily) {
    init(daily);
    fadeOut(document.getElementById("intro"));
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
