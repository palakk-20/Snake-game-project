const board = document.querySelector(".board");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const restartGameModal = document.querySelector(".restart-game");
const startButton = document.querySelector(".start-btn");
const restartButton = document.querySelector(".restart-btn");
const highScoreEle = document.querySelector("#high-score");
const scoreEle = document.querySelector("#score");
const timeEle = document.querySelector("#time");

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00:00`;
highScoreEle.innerText = highScore;

const blockHeight = 50;
const blockwidth = 50;

let intervalId = null;
let timerId = null;

const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockwidth);

const blocks = [];
let snake = [
  {
    x: 1,
    y: 3,
  },
];

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};
let direction = "right";

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    // block.innerText = `${row}-${col}`;
    blocks[`${row}-${col}`] = block;
  }
}

function render() {
  let head = null;
  blocks[`${food.x}-${food.y}`].classList.add("food");
  if (direction == "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction == "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction == "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction == "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    clearInterval(timerId);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    restartGameModal.style.display = "flex";
    return;
  }

  if (head.x == food.x && head.y == food.y) {
    score += 10;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
    }
    scoreEle.innerText = score;
    snake.unshift(head);
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
  }

  snake.forEach((segment) => {
    const block = blocks[`${segment.x}-${segment.y}`];
    block.classList.remove("fill");
    block.classList.remove("head"); // ✅ ADD
  });

  snake.unshift(head);
  snake.pop();
  snake.forEach((segment, index) => {
    const block = blocks[`${segment.x}-${segment.y}`];

    if (index === 0) {
      block.classList.add("head"); // 🟥 snake head
    } else {
      block.classList.add("fill"); // 🟩 snake body
    }
  });
}

function restartGame() {
  score = 0;
  time = `00:00`;
  scoreEle.innerText = score;
  timeEle.innerText = time;
  highScoreEle.innerText = highScore;

  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("head");
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  direction = "down";
  modal.style.display = "none";
  snake = [{ x: 1, y: 3 }];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  timerId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number);

    if (sec === 59) {
      min++;
      sec = 0;
    } else {
      sec++;
    }

    time = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    timeEle.innerText = time;
  }, 1000);

  intervalId = setInterval(() => {
    render();
  }, 400);
}

startButton.addEventListener("click", () => {
  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 200);
  timerId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number);
    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    time = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

    timeEle.innerHTML = time;
  }, 1000);
});
restartButton.addEventListener("click", restartGame);

addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    direction = "up";
  } else if (event.key == "ArrowDown") {
    direction = "down";
  } else if (event.key == "ArrowRight") {
    direction = "right";
  } else if (event.key == "ArrowLeft") {
    direction = "left";
  }
});
