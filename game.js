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
      Oveja.style.width = '60px';
      Oveja.style.height = '60px';
      Oveja.style.bottom = '0';
      Oveja.style.backgroundImage = 'url(Oveja2-.png)';
      Oveja.style.animation = 'run 0.5s steps(6) infinite';
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
    Oveja.style.width = '60px';
    Oveja.style.height = '30px';
    Oveja.style.bottom = '20px'; // Ajuste de la posición de la oveja agachada
    Oveja.style.backgroundImage = 'url(AgachoOV2.png)';
    Oveja.style.animation = 'none';
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
    obstacle.style.left = obstaclePosition + 'px';

    if (obstacleType === 'Halcon') {
      const positions = [100, 150, 200]; // Posiciones Y permitidas para los halcones
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
        if (score > 700) {
          document.body.style.backgroundImage = 'url("Vnoche.png")';
          game.style.backgroundImage = 'url("Vnoche.png")';
        }
      }
    }, 100);
  }

  setTimeout(startGame, 1000); // Inicia el juego después de un retraso de 1 segundo
});
