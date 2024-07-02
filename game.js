document.addEventListener('DOMContentLoaded', () => {
  const dino = document.getElementById('dino');
  const game = document.getElementById('game');
  const scoreDisplay = document.getElementById('score');
  let isJumping = false;
  let gravity = 0.9;
  let isGameOver = false;
  let score = 0;

  function control(e) {
    if (e.keyCode === 32) {
      if (!isJumping) {
        isJumping = true;
        jump();
      }
    }
  }

  document.addEventListener('keydown', control);

  function jump() {
    let position = 0;
    let timerId = setInterval(function() {
      // Going up
      if (position >= 150) {
        clearInterval(timerId);
        // Fall down
        let downTimerId = setInterval(function() {
          if (position <= 0) {
            clearInterval(downTimerId);
            isJumping = false;
          }
          position -= 5;
          position = position * gravity;
          dino.style.bottom = position + 'px';
        }, 20);
      }
      // Jumping
      position += 30;
      dino.style.bottom = position + 'px';
    }, 20);
  }

  function checkCollision(cactus) {
    const dinoRect = dino.getBoundingClientRect();
    const cactusRect = cactus.getBoundingClientRect();
    return (
      dinoRect.left < cactusRect.left + cactusRect.width &&
      dinoRect.left + dinoRect.width > cactusRect.left &&
      dinoRect.top < cactusRect.top + cactusRect.height &&
      dinoRect.top + dinoRect.height > cactusRect.top
    );
  }

  function generateCactus() {
    if (isGameOver) return;
    let randomTime = Math.random() * 4000 + 1000;
    let cactusPosition = 800;
    const cactus = document.createElement('div');
    cactus.classList.add('cactus');
    game.appendChild(cactus);
    cactus.style.left = cactusPosition + 'px';

    let timerId = setInterval(function() {
      if (cactusPosition > 0 && cactusPosition < 60 && checkCollision(cactus)) {
        clearInterval(timerId);
        alert('Game Over');
        isGameOver = true;
        // Remove all children
        while (game.firstChild) {
          game.removeChild(game.firstChild);
        }
        // Reset the score
        score = 0;
        scoreDisplay.textContent = score;
      }
      cactusPosition -= 10;
      cactus.style.left = cactusPosition + 'px';
    }, 20);

    if (!isGameOver) setTimeout(generateCactus, randomTime);
  }

  function startGame() {
    score = 0;
    isGameOver = false;
    scoreDisplay.textContent = score;
    generateCactus();
    setInterval(function() {
      if (!isGameOver) {
        score++;
        scoreDisplay.textContent = score;
      }
    }, 100);
  }

  setTimeout(startGame, 1000); // Start the game after a delay of 1 second
});
