/*
 * - clickable left/right/down controls at bottom
 * - restart button
 * - Satisfying splash animation when letter hits the bottom
 * - Satisfying success animation
 * - dark/light theme
 */
class Board {
    constructor(rows, cols, answers) {
        this.cols = cols;
        this.rows = rows;
        this.grid = new Array(rows);
        this.index = 0;
        this.answers = answers;
        this.availableLetters = answers[3];

        var boardElem = document.getElementById('board');
        for (let r = 0; r < rows; r++) {
			this.grid[r] = new Array(cols);
			for (let c = 0; c < this.grid[r].length; c++) {
                this.createBlankTile(boardElem, r, c);
            }
		}

        this.pickNextLetter();
        this.moveLeft();

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
        const index = Math.floor(Math.random() * this.availableLetters.length);
        this.letter = this.availableLetters.charAt(index);
        this.setLetter(0, this.index, this.letter);
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
        this.setLetter(0, this.index, ' ');
    }

    moveLeft() {
        this.move(this.index - 1);
    }

    moveRight() {
        this.move(this.index + 1);
    }

    move(newIndex) {
        this.clearLetter(0, this.index);
        this.removeGlow(this.index);
        this.index = Math.max(Math.min(newIndex, this.cols - 1), 0);
        this.setLetter(0, this.index, this.letter);
        this.addGlow(this.index);
    }

    removeGlow(c) {
        /*
        let r = this.getAvailableRowInColumn(this.index);
        if (r) {
            this.grid[r][c].tile.classList.remove("glow");
        }
        */
    }

    addGlow(c) {
        /*
        let r = this.getAvailableRowInColumn(this.index);
        if (r) {
            this.grid[r][c].tile.classList.add("glow");
        }
        */
    }

    drop() {
        this.dropAt(this.index);
    }

    dropAt(c) {
        let r = this.getAvailableRowInColumn(c);
        if (r) {
            this.removeGlow(c);
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
            this.clearLetter(0, c);
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

function init() {
    const wordChoices = [
        ["COOK","STIR","CHOP","DICE"],
        ["RICE","BEAN","TACO","CHIP"],
        ["KICK","BALL","GOAL","CLUB"],
        ["CARS","ROAD","LANE","MILE"],
        ["INCH","FOOT","YARD","MILE"],
        ["DRUM","BASS","KICK","ROCK"],
        ["BABY","TOYS","CRIB","PLAY"]
    ];

    // Pick a set of words based on the day of the month
    const index = new Date().getDay() + 2;
    const b = new Board(5, 4, wordChoices[index % wordChoices.length]);
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
