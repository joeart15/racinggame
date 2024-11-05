const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
    x: canvas.width / 2 - 35,
    y: canvas.height - 100,
    width: 70,
    height: 140,
    speed: 5
};

let trees = [];
let obstacles = [];
let speed = -5;
let score = 0;
let gameOver = false;

// Load images (replace with URLs or local paths if needed)
const carImg = new Image();
carImg.src = "car2.png";

const treeImg = new Image();
treeImg.src = "pinetree.png";

const obstacleImg = new Image();
obstacleImg.src = "car1.png";

// Handle Key Presses
let keys = {};
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function update() {
    if (gameOver) return;

    // Player movement
    if (keys["ArrowUp"] && speed > -15) speed -= 0.1;
    if (keys["ArrowDown"] && speed < -3) speed += 0.1;
    if (keys["ArrowLeft"] && player.x > 20) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x < canvas.width - player.width - 20) player.x += player.speed;

    // Move trees
    trees.forEach(tree => {
        tree.y += -speed;
        if (tree.y > canvas.height) {
            tree.y = -50;
        }
    });

    // Move obstacles
    obstacles.forEach(obstacle => {
        obstacle.y += -speed;
        if (obstacle.y > canvas.height) {
            obstacles.splice(obstacles.indexOf(obstacle), 1); // Remove off-screen obstacle
            score += 1;
        }
    });

    // Check collision
    obstacles.forEach(obstacle => {
        if (isColliding(player, obstacle)) {
            gameOver = true;
        }
    });

    // Spawn new obstacles periodically
    if (Math.random() < 0.01) createObstacle();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player
    ctx.drawImage(carImg, player.x, player.y, player.width, player.height);

    // Draw Trees
    trees.forEach(tree => {
        ctx.drawImage(treeImg, tree.x, tree.y, 50, 100);
    });

    // Draw Obstacles
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, 70, 140);
    });

    // Draw Score
    ctx.fillStyle = "gold";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width - 150, 30);

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "48px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    if (!gameOver) requestAnimationFrame(gameLoop);
}

// Utility Functions
function createObstacle() {
    let obstacleX = Math.random() * (canvas.width - 100);
    obstacles.push({ x: obstacleX, y: -140, width: 70, height: 140 });
}

function isColliding(rect1, rect2) {
    return !(
        rect1.x > rect2.x + rect2.width ||
        rect1.x + rect1.width < rect2.x ||
        rect1.y > rect2.y + rect2.height ||
        rect1.y + rect1.height < rect2.y
    );
}

// Initial Setup
function createScenery() {
    for (let i = 0; i < 10; i++) {
        trees.push({ x: Math.random() < 0.5 ? 50 : canvas.width - 100, y: i * 60 });
    }
}

// Start the game
createScenery();
gameLoop();
