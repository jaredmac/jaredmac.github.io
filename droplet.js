/*
 * - easy mode and hard mode: easy you get to replace the tiles?
 * - Satisfying success animation
 * - Done screen: reveal the theme, show the count, show the average
 */

function createLetterElement(size, clazz) {
    var el = document.createElement('div');
    el.classList.add(clazz);
    el.style.height = size + 'px';
    el.style.width = size + 'px';
    el.style.lineHeight = (size - 5) + 'px';
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
    constructor(el, answers, theme, gridSize) {
        this.answers = answers;
        this.theme = theme;
        this.attempt = 1;
        this.interactive = true;
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

    setNonInteractive() {
        this.interactive = false;
    }

    resetAvailableLetters() {
        this.availableLetters = this.answers[3];
    }

    tryAgain() {
        this.attempt++;
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

        if (this.interactive) {
            if (correct) {
                this.showCongratulations();
            } else {
                this.showTryAgainButton();
            }
        }
    }

    showCongratulations() {
        // Display the number of tries
        let tryEl = document.getElementById("tries");
        tryEl.textContent = this.attempt;
        tryEl.textContent += this.attempt == 1 ? " try." : " tries.";

        // Display the theme
        let themeEl = document.getElementById("theme");
        themeEl.style.fontVariant = 'small-caps';
        themeEl.textContent = this.theme;

        // Show the congratulations dialog
        let  congrats = document.getElementById("congratulationsContent");
        fadeIn(congrats);
    }

    showTryAgainButton() {
        let tryAgainContent = document.getElementById("tryAgainContent");
        fadeIn(tryAgainContent);
        let tryAgainButton = document.getElementById("tryAgainButton");
        tryAgainButton.onclick=function() {
            tryAgainContent.style.visibility = 'hidden';
            tryAgainContent.style.display = 'none';
            globals.b.tryAgain();
        };
    }

    isBlank(r, c) {
        return this.grid[r][c].letter == ' ';
    }

    dropAt(c) {
        let r = this.getAvailableRowInColumn(c);
        if (r != -1) {
            let correctLetter = this.answers[r].charAt(c);

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
        ["COOK","STIR","CHOP","DICE", "cooking"],
        ["RICE","BEAN","TACO","CHIP", "Mexican food"],
        ["KICK","BALL","GOAL","CLUB", "soccer/football"],
        ["CARS","ROAD","LANE","MILE", "driving"],
        ["INCH","FOOT","YARD","MILE", "units of measure"],
        ["MIST","RAIN","HAIL","SNOW", "precipitation"],
        ["BABY","TOYS","CRIB","PLAY", "baby things"],
        ["BLUE","GRAY","PINK","CYAN", "colors"],
        ["HAND","FOOT","HEAD","FACE", "body parts"],
        ["PINE","PLUM","PEAR","PALM", "trees that start with 'P'"],
        ["AIDA","CATS","RENT","HAIR", "musicals"],
        ["KIRK","AHAB","NEMO","HOOK", "captains"],
        ["TREK","WARS","DUST","GATE", "types of star"],
        ["DUNE","JAWS","ARGO","CUJO", "movies"],
        ["BOLT","PINS","NAIL","GLUE", "fasteners"],
        ["NICE","OSLO","NUUK","KIEV", "European cities"],
        ["RENO","ERIE","MESA","HILO", "US cities"]
    ];

    const date = new Date();
    const dayInYear = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;    
    const index = daily ? dayInYear : Math.floor(Math.random() * wordChoices.length);
    const i = index % wordChoices.length;

    updateTitle(i);

    globals.b = new Board(document.getElementById('board'), 
        wordChoices[i].slice(0, 4),
        wordChoices[i].slice(4)[0],
        80);
    globals.b.pickNextLetterAtRandom();
}

function updateTitle(index) {
    const titleEl = document.getElementById('titleNum');
    titleEl.textContent = "#" + index;
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
    document.getElementById("intro").style.display = 'none';
}

function fadeIn(element) {
    console.log("fadeIn");
    console.log(element);
    element.style.opacity = 0;
    element.style.visibility = 'visible';
    element.style.display = 'block';
    var op = 0; 
    var timer = setInterval(function () {
        if (op >= 0.9) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        op = op + 0.1;
    }, 20);
}