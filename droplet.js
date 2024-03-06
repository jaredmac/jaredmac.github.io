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
    constructor(boardElem, correctLetter, gridSize, listener) {
        this.letter = ' ';
        this.tile = createLetterElement(gridSize, 'tile');
        this.correctLetter = correctLetter;
        this.correct = false;
        this.listener = listener;
        boardElem.appendChild(this.tile);
    }

    isCorrect() {
        return this.correct;
    }

    dropLetter(letter) {
        this.setLetter(letter);
        this.tile.classList.add('filled');
        if (letter == this.correctLetter) {
            this.tile.classList.add('correct');
            this.correct = true;
        } 
    }

    reveal() {
        this.setLetter(this.correctLetter);
        this.tile.classList.add('correct');
        this.correct = true;
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

class Timer {
    constructor() {
        this.started = false;
        this.seconds = 0;
    }

    hasStarted() {
        return this.started;
    }

    add(seconds) {
        this.seconds += seconds;
    }

    start() {
        this.started = true;
        var that = this;
        this.timerId = setInterval(function() {
            that.seconds++;
            var timerEl = document.getElementById("timer");
            timerEl.textContent = pad(Math.floor(that.seconds / 60)) + ":" + pad(that.seconds % 60);
            function pad(num) {
                if (num < 10) {
                    return "0" + num;
                } else {
                    return "" + num;
                }
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.timerId);
    }
}

class Board {
    constructor(el, answers, theme, gridSize, interactive) {
        this.answers = answers;
        this.theme = theme;
        this.attempt = 1;
        this.interactive = interactive;
        this.resetAvailableLetters();

        // Create the current letter above the board. Don't show it 
        // if not interactive to save space
        this.letterElem = createLetterElement(gridSize, 'currentLetter');
        el.textContent = '';
        if (interactive) {
            el.appendChild(this.letterElem);
        }

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
                this.createBlankTile(boardElem, r, c, answers[r].charAt(c), gridSize);
            }
		}

        if (this.interactive) {
            this.timer = new Timer();
            show("belowBoard");
            show("timer");
        }
    }

    resetAvailableLetters() {
        this.availableLetters = this.answers[3];
    }

    tryAgain(penalty) {
        // Make sure we re-show the timer 
        show("belowBoard");

        // Add the penalty, if any
        this.timer.add(penalty);
        this.attempt++;

        this.clearBoard();
        this.resetAvailableLetters();
        this.pickNextLetterAtRandom();
    }

    revealAll() {
        for (let r of this.grid) {
            for (let c of r) {
                c.reveal();
            }
        }
    }

    clearBoard() {
        for (let r of this.grid) {
            for (let c of r) {
                c.clearLetter();
            }
        }
    }

    createBlankTile(boardElem, r, c, correctLetter, gridSize) {
        const b = this;
        this.grid[r][c] = new Tile(boardElem, correctLetter, gridSize, function handleClick(e) {
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
        var correctCount = 0;
        for (let r of this.grid) {
			for (let c of r) {
                correctCount += c.isCorrect() ? 1 : 0;
            }
        }

        if (this.interactive) {
            if (correctCount == 16) {
                this.showCongratulations();
            } else {
                this.showTryAgainButton(correctCount);
            }
        }
    }

    showCongratulations() {
        // Stop and hide the timer
        this.timer.stop();
        hide("belowBoard");

        // Show confetti and wait a bit
        confetti({
            count: 100
        });

        // Display the theme
        let themeEl = document.getElementById("theme");
        fadeIn(themeEl);
        themeEl.textContent = this.theme;
        
        // Wait a bit before showing the rest
        var that = this;        
        setTimeout(function () {
            // Display the number of tries
            let tryEl = document.getElementById("tries");
            tryEl.textContent = that.attempt;
            tryEl.textContent += that.attempt == 1 ? " attempt" : " attempts";

            // Show the time
            let timerResultEl = document.getElementById("timerResult");
            timerResultEl.textContent = document.getElementById("timer").textContent;

            // Show the congratulations
            fadeIn("congratulationsContent");
        }, 5000);
    }

    showTryAgainButton(correctCount) {
        // Temporarily hide the timer 
        hide("belowBoard");
        
        let tryAgainMessage = document.getElementById("tryAgainMessage");
        if (correctCount > 12) {
            tryAgainMessage.textContent = "Almost!";
        } else if (correctCount > 7) {
            tryAgainMessage.textContent = "You're getting there. Don't give up!";
        } else if (correctCount > 1) {
            tryAgainMessage.textContent = "Good start. You can do it!";
        } else {
            tryAgainMessage.textContent = "Don't despair. You got this!";
        }
        fadeIn("tryAgainContent");

        let tryAgainButton = document.getElementById("tryAgainButton");
        var that = this;
        tryAgainButton.onclick=function() {
            hide("tryAgainContent");
            that.tryAgain(0);
        };
    }

    isBlank(r, c) {
        return this.grid[r][c].letter == ' ';
    }

    dropAt(c) {
        // Start the timer at the first letter drop (a la NYTimes crossword)
        this.startTimerIfNotAlready();
        let r = this.getAvailableRowInColumn(c);
        if (r != -1) {
            this.grid[r][c].dropLetter(this.letter);
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

    startTimerIfNotAlready() {
        if (this.interactive && !this.timer.hasStarted()) {
            this.timer.start();
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
        ["COOK","STIR","CHOP","DICE", "cooking actions"],
        ["RICE","BEAN","TACO","CHIP", "mexican food"],
        ["KICK","BALL","GOAL","CLUB", "soccer"],
        ["CARS","ROAD","LANE","MILE", "driving"],
        ["INCH","FOOT","YARD","MILE", "units of measure"],
        ["MIST","RAIN","HAIL","SNOW", "precipitation"],
        ["BLUE","GRAY","PINK","CYAN", "colors"],
        ["HAND","FOOT","HEAD","FACE", "body parts"],
        ["PINE","PLUM","PEAR","PALM", "trees that start with 'p'"],
        ["AIDA","CATS","RENT","HAIR", "musicals"],
        ["KIRK","AHAB","NEMO","HOOK", "captains"],
        ["TREK","WARS","DUST","GATE", "star ____"],
        ["DUNE","JAWS","ARGO","CUJO", "movies"],
        ["NICE","OSLO","NUUK","KIEV", "european cities"],
        ["RENO","ERIE","MESA","HILO", "us cities"],
        ["DASH","FLEE","DART","RACE", "move quickly"],
        ["LIFT","FLEX","PUSH","PULL", "gym actions"],
        ["PICK","PASS","FOUL","DUNK", "basketball"]
    ];

    // Pick a theme based on the day or at random
    const date = new Date();
    const dayInYear = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;    
    const index = daily ? dayInYear : Math.floor(Math.random() * wordChoices.length);
    const i = index % wordChoices.length;

    updateTitle(i);

    globals.b = new Board(document.getElementById('board'), 
        wordChoices[i].slice(0, 4),
        wordChoices[i].slice(4)[0],
        80, true);
    globals.b.pickNextLetterAtRandom();
}

function updateTitle(index) {
    const titleEl = document.getElementById('titleNum');
    titleEl.textContent = "#" + index;
}

function tryAgain(penalty) {
    globals.b.tryAgain(penalty);
}

function initColors() {
    const colorMode = localStorage.getItem("colorMode");
    if (colorMode == "dark") {
        toggleLightDark();
    }
}

function toggleLightDark() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("colorMode", "dark");
    } else {
        localStorage.setItem("colorMode", "light");
    }
}

function toggleHelp() {
    let helpEl = document.getElementById("help");
    if (window.getComputedStyle(helpEl).display == 'none') {
        let words = ["BLUE","GRAY","PINK","CYAN"];
        showBoard('help-board', words, "colors");
        showPartialBoard('help-board-partial', words, "colors");
        fadeIn(helpEl);
    } else { 
        fadeOut(helpEl);
    }
}

function startGame(daily) {
    init(daily);
    hide("intro");
}

function fadeIn(el) {
    var element = el instanceof Element ? el : document.getElementById(el);
    element.style.opacity = 0;
    var op = 0; 
    var timer = setInterval(function () {
        if (op >= 0.9) {
            element.style.opacity = 1;
            element.style.display = 'block';
            clearInterval(timer);
        } else {
            element.style.opacity = op;
            op = op + 0.1;
        }
    }, 10);
}

function fadeOut(el) {
    var element = el instanceof Element ? el : document.getElementById(el);
    element.style.opacity = 1;
    var op = 1; 
    var timer = setInterval(function () {
        if (op <= 0.1) {
            element.style.opacity = 0;
            element.style.display = 'none';
            clearInterval(timer);
        } else {
            element.style.opacity = op;
            op = op - 0.1;
        }
    }, 10);
}

function hide(id) {
    let el = document.getElementById(id);
    el.style.display = 'none';
}

function show(id) {
    let el = document.getElementById(id);
    el.style.display = 'block';
}