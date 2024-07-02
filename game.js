document.addEventListener('DOMContentLoaded', () => {
  const oveja = document.getElementById('oveja');
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
          oveja.style.bottom = position + 'px';
        }, 20);
      }
      // Jumping
      position += 30;
      oveja.style.bottom = position + 'px';
    }, 20);
  }

  function checkCollision(valla) {
    const ovejaRect = oveja.getBoundingClientRect();
    const vallaRect = valla.getBoundingClientRect();
    return (
      ovejaRect.left < vallaRect.left + vallaRect.width &&
      ovejaRect.left + ovejaRect.width > vallaRect.left &&
      ovejaRect.top < vallaRect.top + vallaRect.height &&
      ovejaRect.top + ovejaRect.height > vallaRect.top
    );
  }

  function generateValla() {
    if (isGameOver) return;
    let randomTime = Math.random() * 4000 + 1000;
    let vallaPosition = 800;
    const valla = document.createElement('div');
    valla.classList.add('valla');
    game.appendChild(valla);
    valla.style.left = vallaPosition + 'px';

    let timerId = setInterval(function() {
      if (vallaPosition > 0 && vallaPosition < 60 && checkCollision(valla)) {
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
      vallaPosition -= 10;
      valla.style.left = vallaPosition + 'px';
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
