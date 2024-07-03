document.addEventListener('DOMContentLoaded', () => {
  const Oveja = document.getElementById('Oveja');
  const game = document.getElementById('game');
  const scoreDisplay = document.getElementById('score');
  const gameOverDisplay = document.createElement('div');
  gameOverDisplay.id = 'game-over';
  gameOverDisplay.innerText = 'Game Over';
  game.appendChild(gameOverDisplay);

  let isJumping = false;
  let isCrouching = false;
  let isGameOver = false;
  let score = 0;
  let lastObstacleType = '';

  let jumpHeight = 200; // Altura máxima del salto

  function control(e) {
    if (e.keyCode === 32 && !isJumping) { // Tecla espacio para saltar
      startJump();
    } else if (e.keyCode === 40 && !isCrouching) { // Flecha hacia abajo para agacharse
      crouch();
    }
  }

  function stopCrouching(e) {
    if (e.keyCode === 40) {
      isCrouching = false;
      Oveja.classList.remove('Oveja-crouch');
      Oveja.style.bottom = '0';
    }
  }

  document.addEventListener('keydown', control);
  document.addEventListener('keyup', stopCrouching);

  function startJump() {
    if (isCrouching) return; // No puede saltar mientras está agachada
    isJumping = true;
    let jumpStart = Date.now();

    function jumpAnimation() {
      let timePassed = Date.now() - jumpStart;
      let progress = timePassed / 1000; // Tiempo de duración del salto en segundos
      let jumpPosition = jumpHeight * Math.sin(progress * Math.PI);

      if (progress < 0.5) {
        Oveja.style.bottom = jumpPosition + 'px';
      } else {
        Oveja.style.bottom = (jumpHeight - jumpPosition) + 'px';
      }

      if (progress < 1) {
        requestAnimationFrame(jumpAnimation);
      } else {
        endJump();
      }
    }

    requestAnimationFrame(jumpAnimation);
  }

  function endJump() {
    isJumping = false;
    Oveja.style.bottom = '0';
  }

  function crouch() {
    isCrouching = true;
    Oveja.classList.add('Oveja-crouch');
    Oveja.style.bottom = '-30px'; // Ajusta la posición de agachado
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
    let obstacleType = Math.random() > 0.4 ? 'Valla' : 'Halcon'; // Ajusta las probabilidades de aparición

    // Asegúrate de que no haya dos obstáculos en la misma línea vertical
    if (lastObstacleType === 'Valla' && obstacleType === 'Halcon') {
      obstacleType = 'Valla';
    } else if (lastObstacleType === 'Halcon' && obstacleType === 'Halcon') {
      obstacleType = 'Valla';
    }

    let obstaclePosition = 1200;
    const obstacle = document.createElement('div');
    obstacle.classList.add(obstacleType);
    game.appendChild(obstacle);

    if (obstacleType === 'Halcon') {
      const positions = [50, 100, 150, 200]; // Ajusta las posiciones Y permitidas para los halcones
      obstacle.style.top = positions[Math.floor(Math.random() * positions.length)] + 'px';
    } else {
      obstacle.style.bottom = '0';
    }

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

    lastObstacleType = obstacleType;

    if (!isGameOver) setTimeout(generateObstacle, randomTime);
  }

  function gameOver() {
    isGameOver = true;
    gameOverDisplay.style.display = 'block';
    while (game.firstChild) {
      game.removeChild(game.firstChild);
    }
    game.appendChild(gameOverDisplay);
    score = 0;
    scoreDisplay.textContent = score;
    setTimeout(startGame, 1000); // Reinicia el juego después de 1 segundo
  }

  function startGame() {
    score = 0;
    isGameOver = false;
    gameOverDisplay.style.display = 'none';
    scoreDisplay.textContent = score;
    game.appendChild(Oveja);
    generateObstacle();
    setInterval(function() {
      if (!isGameOver) {
        score++;
        scoreDisplay.textContent = score;
        if (score > 2000) {
          document.body.style.backgroundImage = 'url("Vnoche.png")';
          game.style.backgroundImage = 'url("Vnoche.png")';
        }
      }
    }, 100);
  }

  setTimeout(startGame, 1000); // Inicia el juego después de un retraso de 1 segundo
});
