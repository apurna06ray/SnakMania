// game constants & variables
let inputDir = { x: 0, y: 0 };
let scoreBox = document.getElementById("scoreBox");
let highScore = localStorage.getItem("highScore") || 0;
const foodSound = new Audio("audio/eat.mp3");
const gameOverSound = new Audio("audio/over.mp3");
const moveSound = new Audio("audio/move.mp3");
const musicSound = new Audio("audio/bg.mp3");
let board = document.getElementById("board");
let startBtn = document.getElementById("startBtn");
let restartBtn = document.getElementById("restartBtn");
startBtn.style.display = "inline"; 
restartBtn.style.display = "none";
let gameStarted = false;
let speed = 3;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
]
let food = { x: 6, y: 7 };

// game functions

function main(ctime) {
    window.requestAnimationFrame(main);
    if (!gameStarted) return;
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();

}
function isCollide(snake) {
    // self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // wall collision
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;

}
function gameEngine() {
    // part 1: updating the snake array and food.
    if (isCollide(snakeArr)) {
        // 🔊 Game over sound
        gameOverSound.currentTime = 0;
        gameOverSound.play().catch(() => { });

        // 🎵 Stop music properly
        musicSound.pause();
        musicSound.currentTime = 0;

        inputDir = { x: 0, y: 0 };

        gameStarted = false;
        setTimeout(() => {
            alert("Game Over. Press any key to play again!");
        }, 100);

        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = "Score: 0 | High: " + highScore;
    }
    // if you have eaten the food , increment the score and regenerated the food 

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {

        // 🔊 sound
        foodSound.currentTime = 0;
        foodSound.play().catch(() => { });

        // score
        score += 1;

        // high score update
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }

        // display
        scoreBox.innerHTML = "Score: " + score + " | High: " + highScore;

        // speed increase
        if (score % 5 === 0 && speed < 10) {
            speed += 1;
        }

        // snake grow
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });

        // new food
        let a = 2;
        let b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        }
    }
    // moving the snake 
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };


    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
    // part 2: display the snake and food.
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add('snake');
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement)
    });

    // display the food

    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement)

}

// main logic start here
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {

    // 🎵 Background music start (sirf ek baar)
    if (musicSound.paused) {
        musicSound.loop = true;
        musicSound.play().catch(() => { });
    }

    // 🔊 Move sound
    moveSound.currentTime = 0;
    moveSound.play().catch(() => { });

    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) {
                inputDir.x = 0;
                inputDir.y = -1;
            }
            break;

        case "ArrowDown":
            if (inputDir.y !== -1) {
                inputDir.x = 0;
                inputDir.y = 1;
            }
            break;

        case "ArrowLeft":
            if (inputDir.x !== 1) {
                inputDir.x = -1;
                inputDir.y = 0;
            }
            break;

        case "ArrowRight":
            if (inputDir.x !== -1) {
                inputDir.x = 1;
                inputDir.y = 0;
            }
            break;
    }
});
startBtn.addEventListener("click", () => {
    gameStarted = true;
    inputDir = { x: 0, y: 1 };

    startBtn.style.display = "none";
    restartBtn.style.display = "inline";
});
restartBtn.addEventListener("click", () => {
    snakeArr = [{ x: 13, y: 15 }];
    inputDir = { x: 0, y: 1 };
    score = 0;
    speed = 3;

    gameStarted = true; 

    scoreBox.innerHTML = "Score: 0 | High: " + highScore;
});