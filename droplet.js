/*
 * - center the letter
 * - easy mode and hard mode: easy you get to replace the tiles?
 * - Satisfying success animation
 */

function createLetterElement(size, clazz) {
    var el = document.createElement('div');
    el.classList.add(clazz);
    el.style.height = size + 'px';
    el.style.width = size + 'px';
    el.style.lineHeight = size + 'px';
    el.style.fontSize = Math.floor(size / 2) + 'px';
    el.textContent = ' ';
    return el;
}

class Tile {
    constructor(boardElem, gridSize, listener) {
        this.letter = ' ';
        this.tile = createLetterElement(gridSize, 'tile');
        this.correct = false;
        this.listener = listener;
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
        this.answers = answers;
        this.resetAvailableLetters();

        // Create the current letter above the board
        this.letterElem = createLetterElement(gridSize, 'currentLetter');
        el.appendChild(this.letterElem);

        // Create the board itself
        let boardElem = document.createElement('div');
        boardElem.classList.add('board');
        boardElem.style.gridTemplateColumns = 'repeat(4, ' + gridSize + 'px)';
        boardElem.style.gap = (gridSize / 8) + 'px';
        el.appendChild(boardElem);

        this.grid = new Array(4);
        for (let r = 0; r < 4; r++) {
			this.grid[r] = new Array(4);
			for (let c = 0; c < this.grid[r].length; c++) {
                this.createBlankTile(boardElem, r, c, gridSize);
            }
		}
    }

    resetAvailableLetters() {
        this.availableLetters = this.answers[3];
    }

    tryAgain() {
        for (let r of this.grid) {
			for (let c of r) {
                c.clearLetter();
            }
		}
        this.resetAvailableLetters();
        this.pickNextLetterAtRandom();
    }

    createBlankTile(boardElem, r, c, gridSize) {
        const b = this;
        this.grid[r][c] = new Tile(boardElem, gridSize, function handleClick(e) {
            b.dropAt(c);
        });
    }

    pickNextLetterAtRandom() {
        const index = Math.floor(Math.random() * this.availableLetters.length);
        this.pickNextLetter(this.availableLetters.charAt(index));
    }

    pickNextLetter(l) {
        this.setCurrentLetter(l);
        
        // Update available grid locations
        for (let c = 0; c < 4; c++) {
            let r = this.getAvailableRowInColumn(c);
            if (r != -1) {    
                this.grid[r][c].setAvailable();
            }
        }
    }

    setCurrentLetter(l) {
        this.letter = l;
        this.letterElem.textContent = l;
    }

    endGame() {
        var correct = true;
        for (let r of this.grid) {
			for (let c of r) {
                if (!c.isCorrect()) {
                    correct = false;
                } 
            }
        }
    }

    isBlank(r, c) {
        return this.grid[r][c].letter == ' ';
    }

    dropAt(c) {
        let r = this.getAvailableRowInColumn(c);
        if (r != -1) {
            let correctLetter = this.answers[r].charAt(c);

            //this.letterElem.classList.add('dropAnimation');

            this.grid[r][c].dropLetter(this.letter, correctLetter);
            this.availableLetters = this.availableLetters.replace(this.letter, '');
            if (r - 1 >= 0) {
                this.availableLetters = this.availableLetters + this.answers[r - 1].charAt(c);
            }
            if (this.availableLetters.length == 0) {
                this.setCurrentLetter(' ');
                this.endGame();
            } else { 
                this.pickNextLetterAtRandom();
            }
        }
    }
    
    /**
     * Get the lowest available row in the given column, or -1 if the column is full.
     */
    getAvailableRowInColumn(c) {
        for (let r = this.grid.length - 1; r >= 0; r--) {
            if (this.isBlank(r, c)) {
                return r;
            }
        }
        return -1;
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
        ["MIST","RAIN","HAIL","SNOW"],
        ["BABY","TOYS","CRIB","PLAY"],
        ["BLUE","GRAY","PINK","CYAN"],
        ["HAND","FOOT","HEAD","FACE"],
        ["PINE","PLUM","PEAR","PALM"],
        ["AIDA","CATS","RENT","HAIR"],
        ["KIRK","AHAB","NEMO","HOOK"],
        ["TREK","WARS","DUST","GATE"],
        ["DUNE","JAWS","ARGO","CUJO"],
        ["BOLT","PINS","NAIL","GLUE"],
        ["NICE","OSLO","NUUK","KIEV"],
        ["RENO","ERIE","MESA","HILO"]
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
