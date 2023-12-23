/*
 * PLAY
 * THIS
 * WORD
 * GAME
 */ 
class Intro {
    constructor() {
        let boardEl = document.getElementById('intro-board');
        this.board = new Board(boardEl, ["PLAY", "THIS", "WORD", "GAME"], "intro", 30, false);
        this.script = [
            "M",2,"G",0,"W",0,"E",3,
            "D",3,"A",1,"R",2,"O",1,
            "I",2,"T",0,"H",1,"S",3,
            "P",0,"L",1,"Y",3,"A",2
        ];
        this.i = 0;
        setTimeout(this.dropEachLetter.bind(this), 500);
    }

    dropEachLetter() {
        this.board.pickNextLetter(this.script[this.i]);
        this.board.dropAt(this.script[this.i+1]);
        this.i = this.i + 2;
        if (this.i + 1 < this.script.length) {
            setTimeout(this.dropEachLetter.bind(this), 500);
        }
    }
}