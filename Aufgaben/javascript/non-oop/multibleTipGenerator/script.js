"use strict"

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game elements
const player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  color: 'white',
  speed: 5,
  dx: 0
};

let bullets = [];
let asteroids = [];
let items = [];
let score = 0;
let totalBulletsFired = 0;
let isGameOver = false;
let lastBulletTime = 0;
let ammo = 100; // Ammo counter

// Difficulty control
let asteroidSpawnInterval = 800; // Faster spawn rate
let asteroidSpeedMultiplier = 1.5; // Faster asteroids from the start
let difficultyIncreaseRate = 0.2; // Faster scaling every 10 seconds

// Controls
let canShoot = true; // Flag to control shooting
let rapidFireActive = false;
let shotgunActive = false;
let rainbowActive = false;
let lastShotgunTime = 0;

// Controls for sphere effects
let blueSphereCooldown = 0;
let yellowSphereCooldown = 0;
let greenSphereCooldown = 0;
let rainbowSphereCooldown = 0;

// Sphere types
const sphereTypes = ['blue', 'yellow', 'green', 'rainbow'];

// Controls
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') player.dx = -player.speed;
  if (e.key === 'ArrowRight' || e.key === 'd') player.dx = player.speed;

  // Shoot only if it's not a hold, and we can shoot
  if (e.key === ' ' && canShoot && !isGameOver) {
    shootBullet();
    canShoot = false; // Prevent shooting until the key is released
  }

  if (e.key === 'r' && isGameOver) restartGame();
});

window.addEventListener('keyup', (e) => {
  // Stop moving when either the arrow keys or the 'a'/'d' keys are released
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd') {
    player.dx = 0;
  }

  // Allow shooting again when the space key is released
  if (e.key === ' ') {
    canShoot = true;
  }
});

// Bullet mechanics with cooldown
function shootBullet() {
  const now = Date.now();
  if (now - lastBulletTime < 100) return; // Enforce cooldown of 0.1 seconds
  if (ammo <= 0) return; // Prevent shooting if ammo is empty
  lastBulletTime = now;
  ammo--; // Decrease ammo

  totalBulletsFired++; // Increment total bullets fired

  if (rapidFireActive) {
    // If rapid fire is active, fire bullets continuously with a short delay
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        bullets.push({
          x: player.x + player.width / 2 - 2.5,
          y: player.y,
          width: 5,
          height: 10,
          color: 'yellow',
          speed: 7
        });
      }, i * 50); // Fire bullets with 50ms delay between shots
    }
  } else if (shotgunActive) {
    // Shotgun effect, firing 3 bullets with a spread
    for (let i = -1; i <= 1; i++) {
      bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10,
        color: 'yellow',
        speed: 7,
        angle: i * 10 // Spray the bullets at different angles
      });
    }
  } else {
    // Normal bullet
    bullets.push({
      x: player.x + player.width / 2 - 2.5,
      y: player.y,
      width: 5,
      height: 10,
      color: 'yellow',
      speed: 7
    });
  }
}

// Generate random color
function getRandomColor() {
  const colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Asteroid mechanics
function createAsteroid() {
  const size = Math.random() * 40 + 30; // Bigger asteroids (min: 30, max: 70)
  asteroids.push({
    x: Math.random() * canvas.width,
    y: -size,
    width: size,
    height: size,
    color: getRandomColor(),
    speed: (Math.random() * 3 + 2) * asteroidSpeedMultiplier // Faster initial speed
  });
}

// Item mechanics
function createItem() {
  const randomType = sphereTypes[Math.floor(Math.random() * sphereTypes.length)];
  const size = 30;
  const x = Math.random() * canvas.width;
  items.push({
    x: x,
    y: -size,
    width: size,
    height: size,
    type: randomType,
    color: randomType === 'blue' ? 'blue' : randomType === 'yellow' ? 'yellow' : randomType === 'green' ? 'green' : 'rainbow',
    speed: 3
  });
}

// Update game elements
function updatePlayer() {
  player.x += player.dx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    if (bullet.y + bullet.height < 0) bullets.splice(index, 1);
  });
}

function updateAsteroids() {
  asteroids.forEach((asteroid, index) => {
    asteroid.y += asteroid.speed;
    if (asteroid.y > canvas.height) asteroids.splice(index, 1);
  });
}

function updateItems() {
  items.forEach((item, index) => {
    item.y += item.speed;
    if (item.y > canvas.height) items.splice(index, 1);
    // Check if player collects the item
    if (
      player.x < item.x + item.width &&
      player.x + player.width > item.x &&
      player.y < item.y + item.height &&
      player.y + player.height > item.y
    ) {
      applyItemEffect(item.type);
      items.splice(index, 1); // Remove the item after it is collected
    }
  });
}

function applyItemEffect(type) {
  let points = Math.floor(Math.random() * 5) + 1; // Random points between 1 and 5
  if (type === 'blue') {
    rapidFireActive = true;
    setTimeout(() => rapidFireActive = false, 15000); // 15 seconds of rapid fire
  } else if (type === 'yellow') {
    shotgunActive = true;
    setTimeout(() => shotgunActive = false, 30000); // 30 seconds of shotgun
  } else if (type === 'green') {
    ammo = 100; // Refill ammo
  } else if (type === 'rainbow') {
    rapidFireActive = true;
    shotgunActive = true;
    setTimeout(() => {
      rapidFireActive = false;
      shotgunActive = false;
    }, 15000); // 15 seconds with all effects
  }
  score += points; // Add points when an item is collected
}

// Collision detection
function checkCollisions() {
  bullets.forEach((bullet, bIndex) => {
    asteroids.forEach((asteroid, aIndex) => {
      if (
        bullet.x < asteroid.x + asteroid.width &&
        bullet.x + bullet.width > asteroid.x &&
        bullet.y < asteroid.y + asteroid.height &&
        bullet.y + bullet.height > asteroid.y
      ) {
        bullets.splice(bIndex, 1);
        asteroids.splice(aIndex, 1);
        score += Math.floor(Math.random() * 5) + 1; // Add points when an asteroid is destroyed
        // Visual feedback for destroyed asteroid
        createExplosion(asteroid.x, asteroid.y);
      }
    });
  });

  asteroids.forEach((asteroid) => {
    if (
      player.x < asteroid.x + asteroid.width &&
      player.x + player.width > asteroid.x &&
      player.y < asteroid.y + asteroid.height &&
      player.y + player.height > asteroid.y
    ) {
      isGameOver = true;
    }
  });
}

// Explosion effect
function createExplosion(x, y) {
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
  setTimeout(() => ctx.clearRect(x - 20, y - 20, 40, 40), 200); // Clear explosion after 200ms
}

// Draw elements
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
  bullets.forEach((bullet) => {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function drawAsteroids() {
  asteroids.forEach((asteroid) => {
    ctx.fillStyle = asteroid.color;
    ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
  });
}

function drawItems() {
  items.forEach((item) => {
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 20, 40); // Score at top-left corner
}

function drawAmmo() {
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Ammo: ${ammo}`, 20, 70); // Ammo at top-left corner
}

function drawGameOver() {
  if (isGameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = '24px Arial';
    ctx.fillText(`Total Score: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Bullets Fired: ${totalBulletsFired}`, canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText('Press "R" to Restart', canvas.width / 2, canvas.height / 2 + 80);
  }
}

// Restart game
function restartGame() {
    window.location.reload();
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  updateBullets();
  updateAsteroids();
  updateItems();
  checkCollisions();

  if (!isGameOver) {
    drawPlayer();
    drawBullets();
    drawAsteroids();
    drawItems();
    drawScore();
    drawAmmo();
  } else {
    drawGameOver();
  }

  // Dynamically adjust difficulty
  if (Date.now() % 10000 < 1000) {
    asteroidSpawnInterval -= difficultyIncreaseRate;
    asteroidSpeedMultiplier += difficultyIncreaseRate;
  }

  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Start game loop
setInterval(createAsteroid, asteroidSpawnInterval);
setInterval(createItem, 10000); // Create items every 10 seconds
gameLoop();
