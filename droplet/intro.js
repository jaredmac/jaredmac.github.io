/*
 * Intro screen that plays a dummy version of the game.
 */

function getPreviewBoardSize() {
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if (viewportWidth >= 1200) {
        return 80;
    }
    if (viewportWidth >= 992) {
        return 70;
    }
    if (viewportWidth >= 768) {
        return 60;
    }
    if (viewportWidth >= 576) {
        return 50;
    }
    return 40;
}

class Intro {
    constructor(id, delay) {
        let boardEl = document.getElementById(id);
        this.board = new Board(boardEl, ["PLAY", "THIS", "WORD", "GAME"], "intro", getPreviewBoardSize(), false, true);
        this.script = [
            "M",2,"G",0,"W",0,"E",3,
            "D",3,"A",1,"R",2,"O",1,
            "I",2,"T",0,"H",1,"S",3,
            "P",0,"L",1,"Y",3,"A",2
        ];
        this.i = 0;
        this.delay = delay;
        setTimeout(this.dropEachLetter.bind(this), this.delay);
    }

    dropEachLetter() {
        this.board.pickNextLetter(this.script[this.i]);
        this.board.dropAt(this.script[this.i+1]);
        this.i = this.i + 2;
        if (this.i + 1 < this.script.length) {
            setTimeout(this.dropEachLetter.bind(this), this.delay);
        }
    }
}

/**
 * Just show a static board, no animation
 */
function showBoard(id, words, theme) {
    let boardEl = document.getElementById(id);
    let board = new Board(boardEl, words, theme, getPreviewBoardSize(), false);
    board.revealAll();
}

/**
 * Show a partial static board, no animation
 */
function showPartialBoard(id, words, theme) {
    let boardEl = document.getElementById(id);
    let board = new Board(boardEl, words, theme, getPreviewBoardSize(), false);
    board.pickNextLetter("A");
    board.dropAt(2);
    board.pickNextLetter("N");
    board.dropAt(3);
    board.pickNextLetter("Y");
    board.dropAt(0);
    board.pickNextLetter("P");
    board.dropAt(2);
}