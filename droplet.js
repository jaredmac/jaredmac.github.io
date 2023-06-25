/*
 * - Upload to google pages
 * - Satisfying splash animation when letter hits the bottom
 * - Correct bug about which letters you get 
 * - Satisfying success animation
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
        tile.classList.add('tile');
        tile.textContent = this.grid[r][c].letter;
        this.grid[r][c].tile = tile;
        boardElem.appendChild(tile);
    }

    pickNextLetter() {
        const index = Math.floor(Math.random() * this.availableLetters.length);
        this.letter = this.availableLetters.charAt(index);
        this.moveLeft();
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
        this.index = Math.max(Math.min(newIndex, this.cols - 1), 0);
        this.setLetter(0, this.index, this.letter);
    }

    drop() {
        for (let r = this.grid.length - 1; r > 0; r--) {
            if (this.isBlank(r, this.index)) {
                this.setLetter(r, this.index, this.letter);
                let answerLetter = this.answers[r-1].charAt(this.index);
                this.availableLetters = this.availableLetters.replace(this.letter, '');
                if (r - 2 >= 0) {
                    this.availableLetters = this.availableLetters + this.answers[r - 2].charAt(this.index);
                }
                this.grid[r][this.index].tile.classList.add('filled');
                if (this.letter == answerLetter) {
                    this.grid[r][this.index].tile.classList.add('correct');
                } 
                this.clearLetter(0, this.index);
                this.pickNextLetter();
                break;
            }
        }
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