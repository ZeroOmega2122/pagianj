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
  let gameInterval;
  let obstacleInterval;
  let obstacleSpeed = 15; // Velocidad base de los obstáculos
  let obstacleFrequency = 3000; // Frecuencia base de generación de obstáculos

  function control(e) {
    if (e.keyCode === 32 && !isJumping) {
      jump();
    } else if (e.keyCode === 40 && !isCrouching) {
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
      Oveja.style.animation = 'trot 0.5s steps(2) infinite';
    }
  }

  document.addEventListener('keydown', control);
  document.addEventListener('keyup', stopCrouching);

  function jump() {
    if (isCrouching) return;
    isJumping = true;
    Oveja.style.animation = 'jump 1s ease-in-out';

    setTimeout(() => {
      Oveja.style.animation = 'trot 0.5s steps(2) infinite';
      isJumping = false;
    }, 1000);
  }

  function crouch() {
    isCrouching = true;
    Oveja.classList.add('Oveja-crouch');
    Oveja.style.width = '60px';
    Oveja.style.height = '60px';
    Oveja.style.bottom = '10px'; // Ajuste menor para evitar invisibilidad al agacharse
    Oveja.style.backgroundImage = 'url(Oveja22-.png)';
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

    let obstacleType = Math.random() > 0.3 ? 'Valla' : 'Halcon'; // Ajuste en la probabilidad de tipos de obstáculos

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
      const positions = [90, 150, 200];
      obstacle.style.top = positions[Math.floor(Math.random() * positions.length)] + 'px';
    } else {
      obstacle.style.bottom = '0';
    }

    let timerId = setInterval(function() {
      if (checkCollision(obstacle)) {
        clearInterval(timerId);
        if (obstacle.classList.contains('Halcon') && isCrouching) {
        } else {
          gameOver();
        }
      }
      obstaclePosition -= obstacleSpeed; // Ajuste de la velocidad según el puntaje
      obstacle.style.left = obstaclePosition + 'px';

      if (obstaclePosition < -40) {
        clearInterval(timerId);
        game.removeChild(obstacle);
      }
    }, 20);

    lastObstacleType = obstacleType;

    if (!isGameOver) {
      let randomTime = Math.random() * obstacleFrequency + 1000;
      setTimeout(generateObstacle, randomTime);
    }
  }

  function gameOver() {
    isGameOver = true;
    gameOverDisplay.style.display = 'block';
    clearInterval(gameInterval);
    clearTimeout(obstacleInterval);
    while (game.firstChild) {
      game.removeChild(game.firstChild);
    }
    game.appendChild(gameOverDisplay);

    // Mostrar botón de reinicio
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Reiniciar';
    restartButton.addEventListener('click', () => {
      location.reload(); // Recargar la página para reiniciar el juego
    });
    document.body.appendChild(restartButton);

    // Ajustar el mensaje de Game Over y la transición día/noche según el puntaje
    if (score > 700) {
      document.body.style.backgroundImage = 'url("Vnoche.png")';
      game.style.backgroundImage = 'url("Vnoche.png")';
      gameOverDisplay.style.color = '#ffffff'; // Color de texto blanco para la noche
    } else {
      document.body.style.backgroundImage = 'url("VDia.png")';
      game.style.backgroundImage = 'url("VDiav.png")';
      gameOverDisplay.style.color = '#ff0000'; // Color de texto rojo para el día
    }
  }

  function startGame() {
    score = 0;
    isGameOver = false;
    gameOverDisplay.style.display = 'none';
    scoreDisplay.textContent = score;
    game.appendChild(Oveja);
    generateObstacle();
    gameInterval = setInterval(function() {
      if (!isGameOver) {
        score++;
        scoreDisplay.textContent = score;

        // Ajuste en la frecuencia de los obstáculos y velocidad según el puntaje
        
        if (score > 500) {
          obstacleFrequency = 3000;
          obstacleSpeed = 10;
        }
        if (score > 900) {
          obstacleFrequency = 1000;
          obstacleSpeed = 5;
        }
        if (score > 1500) {
          obstacleFrequency = 500;
          obstacleSpeed = 1;
        }

        // Mostrar transición suave día/noche al pasar de los 700 puntos
        if (score === 700) {
          document.body.style.transition = 'background-image 2s ease';
          game.style.transition = 'background-image 2s ease';
        }

        // Ajustar más gradualmente la generación de obstáculos
        let obstacleTime = Math.random() * obstacleFrequency + 1000;
        setTimeout(generateObstacle, obstacleTime);
      }
    }, 100);
  }

  setTimeout(startGame, 1000);
});
