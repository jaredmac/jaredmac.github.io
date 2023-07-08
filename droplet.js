/*
 * - add an animation on the intro screen showing how it works
 * - easy mode and hard mode: easy you get to replace the tiles?
 * - Satisfying success animation
 */
class Tile {
    constructor(boardElem, r, gridSize, listener) {
        this.letter = ' ';
        this.tile = document.createElement('div');
        this.tile.classList.add('tile');
        this.tile.style.height = gridSize + 'px';
        this.tile.style.width = gridSize + 'px';
        this.tile.style.lineHeight = gridSize + 'px';
        this.tile.style.fontSize = Math.floor(gridSize / 2) + 'px';
        
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
    constructor(el, answers, gridSize) {
        this.rows = 5;
        this.cols = 4;
        this.index = 0;
        this.answers = answers;
        this.availableLetters = answers[3];
        this.attempts = 0;
        let boardElem = el;
        boardElem.style.gridTemplateColumns = 'repeat(4, ' + gridSize + 'px)';
        boardElem.style.gridGap = (gridSize / 8) + 'px';

        this.grid = new Array(this.rows);
        for (let r = 0; r < this.rows; r++) {
			this.grid[r] = new Array(this.cols);
			for (let c = 0; c < this.grid[r].length; c++) {
                this.createBlankTile(boardElem, r, c, gridSize);
            }
		}

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
        this.pickNextLetterAtRandom();
    }

    createBlankTile(boardElem, r, c, gridSize) {
        const b = this;
        this.grid[r][c] = new Tile(boardElem, r, gridSize, function handleClick(e) {
            b.dropAt(c);
        });
    }

    pickNextLetterAtRandom() {
        const index = Math.floor(Math.random() * this.availableLetters.length);
        this.pickNextLetter(this.availableLetters.charAt(index));
    }

    pickNextLetter(l) {
        this.letter = l;
        this.setLetter(0, this.index, this.letter);

        // Update available grid locations
        for (let c = 0; c < this.cols; c++) {
            let r = this.getAvailableRowInColumn(c);
            if (r) {    
                this.grid[r][c].setAvailable();
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
            if (this.availableLetters.length == 0) {
                this.endGame();
            } else { 
                this.pickNextLetterAtRandom();
            }
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
        ["HAND","FOOT","HEAD","FACE"],
        ["PINE","PLUM","PEAR","PALM"],
        ["AIDA","CATS","RENT","HAIR"],
        ["KIRK","AHAB","NEMO","HOOK"],
        ["TREK","WARS","DUST","GATE"],
        ["DUNE","JAWS","ARGO","CUJO"]
    ];

    const index = daily ? new Date().getDay() : Math.floor(Math.random() * 1024);
    globals.b = new Board(document.getElementById('board'), 
        wordChoices[index % wordChoices.length],
        80);
    globals.b.pickNextLetterAtRandom();
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
