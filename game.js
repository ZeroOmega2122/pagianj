document.addEventListener('DOMContentLoaded', () => {
  const Oveja = document.getElementById('Oveja');
  const game = document.getElementById('game');
  const scoreDisplay = document.getElementById('score');
  let isJumping = false;
  let isCrouching = false;
  let gravity = 0.9;
  let isGameOver = false;
  let score = 0;

  function control(e) {
    if (e.keyCode === 32 && !isJumping) { // Tecla espacio para saltar
      jump();
    } else if (e.keyCode === 40 && !isCrouching) { // Flecha hacia abajo para agacharse
      crouch();
    }
  }

  function stopCrouching(e) {
    if (e.keyCode === 40) {
      isCrouching = false;
      Oveja.classList.remove('Oveja-crouch');
    }
  }

  document.addEventListener('keydown', control);
  document.addEventListener('keyup', stopCrouching);

  function jump() {
    if (isCrouching) return; // No puede saltar mientras está agachada
    isJumping = true;
    Oveja.style.animation = 'jump 1s ease-in-out';

    setTimeout(() => {
      Oveja.style.animation = 'run 0.5s steps(6) infinite';
      isJumping = false;
    }, 1000);
  }

  function crouch() {
    isCrouching = true;
    Oveja.classList.add('Oveja-crouch');
  }

  function checkCollision(obstacle) {
    const OvejaRect = Oveja.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    return (
      OvejaRect.left < obstacleRect.left + obstacleRect.width &&
      OvejaRect.left + OvejaRect.width > obstacleRect.left &&
      OvejaRect.top < obstacleRect.top + obstacleRect.height &&
      OvejaRect.top + OvejaRect.height > obstacleRect.top
    );
  }

  function generateObstacle() {
    if (isGameOver) return;

    let randomTime = Math.random() * 4000 + 1000;
    let obstacleType = Math.random() > 0.5 ? 'Valla' : 'Halcon';
    let obstaclePosition = 1200;
    const obstacle = document.createElement('div');
    obstacle.classList.add(obstacleType);
    game.appendChild(obstacle);
    obstacle.style.left = obstaclePosition + 'px';

    let timerId = setInterval(function() {
      if (checkCollision(obstacle)) {
        clearInterval(timerId);
        if (obstacle.classList.contains('Halcon') && isCrouching) {
          // No hay colisión si está agachada y es un Halcón
        } else {
          gameOver();
        }
      }
      obstaclePosition -= 10;
      obstacle.style.left = obstaclePosition + 'px';

      if (obstaclePosition < -40) {
        clearInterval(timerId);
        game.removeChild(obstacle);
      }
    }, 20);

    if (!isGameOver) setTimeout(generateObstacle, randomTime);
  }

  function gameOver() {
    isGameOver = true;
    while (game.firstChild) {
      game.removeChild(game.firstChild);
    }
    score = 0;
    scoreDisplay.textContent = score;
    alert('Game Over');
    setTimeout(startGame, 1000); // Reinicia el juego después de 1 segundo
  }

  function startGame() {
    score = 0;
    isGameOver = false;
    scoreDisplay.textContent = score;
    game.appendChild(Oveja);
    generateObstacle();
    setInterval(function() {
      if (!isGameOver) {
        score++;
        scoreDisplay.textContent = score;
      }
    }, 100);
  }

  setTimeout(startGame, 1000); // Inicia el juego después de un retraso de 1 segundo
});
