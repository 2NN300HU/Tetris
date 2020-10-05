const game = document.getElementById("game");
const gameNext = document.getElementById("next");
const box = game.getContext("2d");
const nextBox = gameNext.getContext("2d");
const scoreBox = document.getElementById("score");
const highScoreBox = document.getElementById("highScore");
const message = document.getElementById("message")
let move;
let myVal;
let flag;
let gameOn;
let speed = 300;
let score;
let highScore;
const blockSample = [[[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], [[0, 0, 1], [1, 1, 1], [0, 0, 0]], [[1, 0, 0], [1, 1, 1], [0, 0, 0]], [[1, 1], [1, 1]], [[0, 1, 1], [1, 1, 0], [0, 0, 0]], [[0, 1, 0], [1, 1, 1], [0, 0, 0]], [[1, 1, 0], [0, 1, 1], [0, 0, 0]]]
const colorSample = ["red", "yellow", "blue", "green", "white", "purple", "orange"];
let nextNum = Math.floor(Math.random() * 7);
let wall;
let count;
let reward = 10;
let block;
let shadow;
let nextBlock;

let screen = new View();
screen.start();

function createWall() {
    let wall = [];
    for (let y = 0; y < 800 / block.size; y++) {
        let a = [];
        a.push(1);
        a.push(1);
        for (let x = 0; x < 400 / block.size; x++) {
            a.push(0);
        }
        a.push(1);
        a.push(1);
        wall.push(a);
    }
    let b = [];
    for (let x = 0; x < 400 / block.size + 4; x++) {
        b.push(1);
    }
    wall.push(b);
    b = [];
    for (let x = 0; x < 400 / block.size + 4; x++) {
        b.push(1);
    }
    wall.push(b);

    return wall;
}

window.onkeydown = function (event) {
    if (event.keyCode === 37 && gameOn) {
        if (!block.moveCheck(-1, 0)) {
            shadow.eraseBlock();
            shadow.blockX -= 1;
            shadow.shadow();
            block.eraseBlock();
            block.blockX -= 1;
            block.drawBlock();

        }

    } else if (event.keyCode === 38 && gameOn) {
        shadow.blockRotate(1);
        block.blockRotate(1);
        if (!block.rotateCheck()) {
            shadow.eraseBlock();
            shadow.block = shadow.rotated;
            shadow.shadow();
            block.eraseBlock();
            block.block = block.rotated;
            block.drawBlock();
        }

    } else if (event.keyCode === 39 && gameOn) {

        if (!block.moveCheck(1, 0)) {
            shadow.eraseBlock();
            shadow.blockX += 1;
            shadow.shadow();
            block.eraseBlock();
            block.blockX += 1;
            block.drawBlock();
        }

    } else if (event.keyCode === 40 && gameOn) {
        shadow.blockRotate(-1);
        block.blockRotate(-1);
        if (!block.rotateCheck()) {
            shadow.eraseBlock();
            shadow.block = shadow.rotated;
            shadow.shadow();
            block.eraseBlock();
            block.block = block.rotated;
            block.drawBlock();
        }

    } else if (event.keyCode === 32 && gameOn) {

        block.moveDown();

    }
    flag = 1;
}

function Block(bck, clr, bx) {
    this.box = bx;
    this.size = 40;
    this.block = bck;
    this.rotated = bck;
    this.blockY = 0;
    this.color = clr;
    this.blockX = Math.round((400 / this.size - this.block.length) / 2);
    this.drawBlock = function () {
        for (let x = 0; x < this.block.length; x++) {
            for (let y = 0; y < this.block.length; y++) {
                if (this.block[y][x] === 1) {
                    this.drawCell(x + this.blockX, y + this.blockY, this.color);
                }
            }
        }

    }
    this.eraseBlock = function () {
        for (let x = 0; x < this.block.length; x++) {
            for (let y = 0; y < this.block.length; y++) {
                if (this.block[y][x] === 1) {
                    this.eraseCell(x + this.blockX, y + this.blockY);
                }
            }
        }

    }
    this.saveBlock = function () {
        for (let x = 0; x < this.block.length; x++) {
            for (let y = 0; y < this.block.length; y++) {
                if (this.block[y][x] === 1) {
                    this.saveCell(x + this.blockX, y + this.blockY);
                }
            }
        }
    }

    this.saveCell = function (x, y) {
        this.drawCell(x, y, "darkgrey");
        wall[y][x + 2] = 1;
    }
    this.drawCell = function (x, y, color) {
        this.box.fillStyle = color;
        this.box.fillRect(this.size * x, this.size * y, this.size, this.size);
    }

    this.eraseCell = function (x, y) {
        this.box.clearRect(this.size * x, this.size * y, this.size, this.size);
    }
    this.moveDown = function () {
        if (block.moveCheck(0, 1) && count === 0) {
            count++;
        } else if (block.moveCheck(0, 1) && count === 1) {
            block.saveBlock();
            while (true) {
                let temp = this.sumLine();
                if (temp === null) {
                    break;
                } else {
                    this.removeLine(temp);
                }
            }
            count = 0;
            block = new Block(blockSample[nextNum], colorSample[nextNum], box);
            shadow.block = blockSample[nextNum];
            shadow.blockX=block.blockX;
            if (block.moveCheck(0, 0)) {
                screen.dead();
            }else{
                shadow.shadow();
                block.drawBlock();
                nextBlock.eraseBlock();
                nextNum = Math.floor(Math.random() * 7);
                nextBlock.block = blockSample[nextNum];
                nextBlock.color = colorSample[nextNum];
                nextBlock.drawBlock();
            }
        } else if (!block.moveCheck(0, 1)) {
            block.eraseBlock();
            block.blockY += 1;
            block.drawBlock();
            count = 0;
        }
    }

    this.moveCheck = function (mx, my) {
        for (let x = 0; x < this.block.length; x++) {
            for (let y = 0; y < this.block.length; y++) {
                if (this.block[y][x] * wall[y + this.blockY + my][x + this.blockX + mx + 2]) {

                    return true;
                }
            }
        }
        return false;
    }
    this.blockRotate = function (rad) {
        let arr = [];
        for (let y = 0; y < this.block.length; y++) {
            let a = [];
            for (let x = 0; x < this.block.length; x++) {
                a.push(0);
            }
            arr.push(a);
        }
        let f;
        if (this.block.length === 4) {
            f = 1.5;
        } else if (this.block.length === 3) {
            f = 1;
        } else {
            f = 0.5;
        }
        for (let x = 0; x < this.block.length; x++) {
            for (let y = 0; y < this.block.length; y++) {
                if (this.block[y][x]) {
                    arr[(x - f) * (-1) * rad + f][(y - f) * rad + f] = 1;
                }
            }
        }
        this.rotated = arr;
    }
    this.rotateCheck = function () {
        for (let x = 0; x < this.block.length; x++) {
            for (let y = 0; y < this.block.length; y++) {
                if (this.rotated[y][x] * wall[y + this.blockY][x + this.blockX + 2]) {
                    return true;
                }
            }
        }
        return false;
    }
    this.sumLine = function () {
        for (let y = 0; y < wall.length - 2; y++) {
            let sum = 0;
            for (let x = 0; x < wall[0].length; x++) {
                sum += wall[y][x];
            }
            if (sum === wall[0].length) {
                return y;
            }
        }
        return null;
    }
    this.removeLine = function (ry) {
        for (let x = 2; x < wall[0].length - 2; x++) {
            if (wall[ry][x] === 1) {
                this.eraseCell(x - 2, ry);
                wall[ry][x] = 0;
            }
        }
        for (let y = ry - 1; y >= 0; y--) {
            for (let x = 2; x < wall[0].length - 2; x++) {
                if (wall[y][x] === 1) {
                    this.eraseCell(x - 2, y);
                    wall[y][x] = 0;
                    this.drawCell(x - 2, y + 1, "darkgrey");
                    wall[y + 1][x] = 1;
                }
            }
        }

        score += reward;
        highScore = Math.max(score, highScore);
    }
    this.shadow = function () {
        this.blockY = block.blockY;
        while (!this.moveCheck(0, 1)) {
            this.blockY += 1;
        }
        this.drawBlock();
    }
}

function play() {
    scoreBox.innerHTML = String(score);
    highScoreBox.innerHTML = String(highScore);
    block.moveDown();

}

function wait() {
    if (flag === 0) {
        setTimeout(wait, speed);
    } else {

        screen.setGame();
        myVal = setInterval(play, speed);
    }
}

function View() {
    this.save = new ScoreSave();
    this.print = function (msg) {
        message.innerHTML = (msg);
    }

    this.wait = wait;
    this.clear = function () {
        box.clearRect(0, 0, 400, 800);
        message.innerHTML = "";
    }
    this.dead = function () {
        gameOn = false
        let msg = "GAME OVER<br>";
        if (score === highScore) {
            msg += "HIGH SCORE!" + "<br>";
        } else {
            msg += "HIGH SCORE : " + String(highScore) + "<br>";
        }
        msg += "SCORE : " + String(score) + "<br>" + "PRESS ANY KEY TO RESTART";
        flag = 0;
        clearInterval(myVal);
        this.print(msg);
        this.save.saveHighScore(highScore);
        nextNum = Math.floor(Math.random() * 7);
        nextBlock.eraseBlock();
        this.wait();
    }

    this.start = function () {
        gameOn = false;
        move = 0;
        highScore = this.save.loadHighScore();
        let msg = "Welcome to Tetris!<br>PRESS ANY KEY TO START"
        this.print(msg)
        highScoreBox.innerHTML = String(highScore);
        scoreBox.innerHTML = "0";
        flag = 0;
        this.wait();
    }

    this.setGame = function () {
        move = 0;
        count = 0;
        score = 0;
        block = new Block(blockSample[nextNum], colorSample[nextNum], box);
        shadow = new Block(blockSample[nextNum], "grey", box);
        nextNum = Math.floor(Math.random() * 7);
        nextBlock = new Block(blockSample[nextNum], colorSample[nextNum], nextBox);
        nextBlock.blockX = 0;
        wall = createWall();
        screen.clear();
        shadow.shadow();
        block.drawBlock();
        nextBlock.drawBlock();
        gameOn = true
    }
}

function ScoreSave() {
    this.cookie = new Cookies("highscore");
    this.loadHighScore = function () {
        let highScore;
        const old = this.cookie.getCookie();
        if (old === null) {
            highScore = 0;
        } else {
            highScore = old;
        }
        return highScore;
    }
    this.saveHighScore = function (value) {
        const old = this.cookie.getCookie();
        if (old === null) {
            this.cookie.setCookie(value);
        } else if (old < value) {
            this.cookie.deleteCookie();
            this.cookie.setCookie(value);
        }
    }
}

function Cookies(name) {
    this.name = name;
    this.setCookie = function (value) {
        let date = new Date();
        date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
        document.cookie = this.name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
    }

    this.deleteCookie = function () {
        document.cookie = this.name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    this.getCookie = function () {
        let value = document.cookie.match('(^|;) ?' + this.name + '=([^;]*)(;|$)');
        return value ? value[2] : null;
    }
}
