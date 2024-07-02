document.addEventListener('DOMContentLoaded', () => {
  const dino = document.getElementById('dino');
  const cactus = document.getElementById('cactus');
  let isJumping = false;
  let gravity = 0.9;
  let isGameOver = false;

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

  function generateCactus() {
    let randomTime = Math.random() * 4000;
    let cactusPosition = 800;
    const cactus = document.createElement('div');
    if (!isGameOver) cactus.classList.add('cactus');
    document.getElementById('game').appendChild(cactus);
    cactus.style.left = cactusPosition + 'px';

    let timerId = setInterval(function() {
      if (cactusPosition > 0 && cactusPosition < 60 && !isJumping) {
        clearInterval(timerId);
        alert('Game Over');
        isGameOver = true;
        // Remove all children
        while (game.firstChild) {
          game.removeChild(game.firstChild);
        }
      }
      cactusPosition -= 10;
      cactus.style.left = cactusPosition + 'px';
    }, 20);

    if (!isGameOver) setTimeout(generateCactus, randomTime);
  }

  generateCactus();
});
