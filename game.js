document.addEventListener('DOMContentLoaded', () => {
  const Oveja = document.getElementById('Oveja');
  const game = document.getElementById('game');
  const scoreDisplay = document.getElementById('score-value');
  const gameOverDisplay = document.getElementById('game-over');
  const restartBtn = document.getElementById('restart-btn');

  let isJumping = false;
  let isCrouching = false;
  let isGameOver = false;
  let score = 0;
  let obstacleInterval;

  let jumpHeight = 120;
  let jumpDuration = 600;
  let crouchDuration = 300;

  document.addEventListener('keydown', control);
  document.addEventListener('keyup', stopCrouching);

  function control(e) {
    if (e.keyCode === 32 && !isJumping && !isCrouching) { // Tecla espacio para saltar
      startJump();
    } else if (e.keyCode === 40 && !isCrouching && !isJumping) { // Flecha hacia abajo para agacharse
      crouch();
    }
  }

  function stopCrouching(e) {
    if (e.keyCode === 40 && isCrouching) {
      isCrouching = false;
      Oveja.classList.remove('Oveja-crouch');
      Oveja.style.bottom = '0';
    }
  }

  function startJump() {
    isJumping = true;
    Oveja.style.transition = `transform ${jumpDuration / 1000}s`;
    Oveja.style.transform = `translateY(-${jumpHeight}px)`;

    setTimeout(() => {
      Oveja.style.transition = `transform ${jumpDuration / 1000}s`;
      Oveja.style.transform = `translateY(0)`;
    }, jumpDuration);

    setTimeout(() => {
      isJumping = false;
    }, jumpDuration * 2);
  }

  function crouch() {
    isCrouching = true;
    Oveja.classList.add('Oveja-crouch');
    setTimeout(() => {
      Oveja.style.transition = `transform ${crouchDuration / 1000}s`;
      Oveja.style.bottom = '-30px';
    }, 0);
  }

  function generateObstacle() {
    if (isGameOver) return;

    const obstacle = document.createElement('div');
    obstacle.classList.add('Valla');
    game.appendChild(obstacle);

    let obstaclePosition = 600;
    obstacle.style.left = obstaclePosition + 'px';

    let timerId = setInterval(function() {
      if (checkCollision(obstacle)) {
        clearInterval(timerId);
        gameOver();
      }

      obstaclePosition -= 10;
      obstacle.style.left = obstaclePosition + 'px';

      if (obstaclePosition < -40) {
        clearInterval(timerId);
        game.removeChild(obstacle);
        score++;
        scoreDisplay.textContent = score;
      }
    }, 20);
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

  function gameOver() {
    isGameOver = true;
    clearInterval(obstacleInterval);
    gameOverDisplay.style.display = 'block';
    restartBtn.style.display = 'block';
  }

  function startGame() {
    isGameOver = false;
    gameOverDisplay.style.display = 'none';
    restartBtn.style.display = 'none';
    score = 0;
    scoreDisplay.textContent = score;
    obstacleInterval = setInterval(generateObstacle, 2000); // Genera un obstáculo cada 2 segundos
  }

  restartBtn.addEventListener('click', startGame);

  startGame(); // Inicia el juego automáticamente al cargar la página
});
