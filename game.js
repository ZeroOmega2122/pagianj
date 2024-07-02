document.addEventListener('DOMContentLoaded', () => {
  const Oveja = document.getElementById('Oveja');
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
          Oveja.style.bottom = position + 'px';
        }, 20);
      }
      // Jumping
      position += 30;
      Oveja.style.bottom = position + 'px';
    }, 20);
  }

  function checkCollision(Valla) {
    const OvejaRect = Oveja.getBoundingClientRect();
    const VallaRect = Valla.getBoundingClientRect();
    return (
      OvejaRect.left < VallaRect.left + VallaRect.width &&
      OvejaRect.left + OvejaRect.width > VallaRect.left &&
      OvejaRect.top < VallaRect.top + VallaRect.height &&
      OvejaRect.top + OvejaRect.height > VallaRect.top
    );
  }

  function generateValla() {
    if (isGameOver) return;
    let randomTime = Math.random() * 4000 + 1000;
    let VallaPosition = 800;
    const Valla = document.createElement('div');
    Valla.classList.add('Valla');
    game.appendChild(Valla);
    Valla.style.left = VallaPosition + 'px';

    let timerId = setInterval(function() {
      if (VallaPosition > 0 && VallaPosition < 60 && checkCollision(Valla)) {
        clearInterval(timerId);
        isGameOver = true;
        // Remove all children
        while (game.firstChild) {
          game.removeChild(game.firstChild);
        }
        // Reset the score
        score = 0;
        scoreDisplay.textContent = score;
        alert('Game Over');
      }
      VallaPosition -= 10;
      Valla.style.left = VallaPosition + 'px';
    }, 20);

    if (!isGameOver) setTimeout(generateValla, randomTime);
  }

  function startGame() {
    score = 0;
    isGameOver = false;
    scoreDisplay.textContent = score;
    generateValla();
    setInterval(function() {
      if (!isGameOver) {
        score++;
        scoreDisplay.textContent = score;
      }
    }, 100);
  }

  setTimeout(startGame, 1000); // Start the game after a delay of 1 second
});
