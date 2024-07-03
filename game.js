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
  let jumpTimeout;
  let crouchTimeout;

  let jumpHeight = 120;
  let jumpDuration = 600;
  let crouchDuration = 300;

  document.addEventListener('keydown', control);
  document.addEventListener('keyup', stopCrouching);

  function control(e) {
    if (e.keyCode === 32 && !isJumping && !isCrouching) { // Space key to jump
      startJump();
    } else if (e.keyCode === 40 && !isCrouching && !isJumping) { // Down arrow to crouch
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
    Oveja.style.transition = `bottom ${jumpDuration / 1000}s`;
    Oveja.style.bottom = `${jumpHeight}px`;

    jumpTimeout = setTimeout(() => {
      Oveja.style.bottom = '0';
    }, jumpDuration);

    setTimeout(() => {
      isJumping = false;
    }, jumpDuration * 2);
  }

  function crouch() {
    isCrouching = true;
    Oveja.classList.add('Oveja-crouch');
    Oveja.style.bottom = '-30px';
    crouchTimeout = setTimeout(() => {
      if (!isCrouching) return;
      isCrouching = false;
      Oveja.classList.remove('Oveja-crouch');
      Oveja.style.bottom = '0';
    }, crouchDuration);
  }

  function generateObstacle() {
    if (isGameOver) return;

    const obstacleType = Math.random() < 0.5 ? 'Valla' : 'Halcon';
    const obstacle = document.createElement('div');
    obstacle.classList.add(obstacleType);
    game.appendChild(obstacle);

    let obstaclePosition = 1200;
    obstacle.style.left = obstaclePosition + 'px';
    obstacle.style.bottom = obstacleType === 'Valla' ? '0px' : `${Math.random() * 60 + 30}px`; // Random height for Halcon

    let timerId = setInterval(() => {
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
    clearTimeout(jumpTimeout);
    clearTimeout(crouchTimeout);
    gameOverDisplay.style.display = 'block';
    restartBtn.style.display = 'block';
  }

  function startGame() {
    isGameOver = false;
    gameOverDisplay.style.display = 'none';
    restartBtn.style.display = 'none';
    score = 0;
    scoreDisplay.textContent = score;
    obstacleInterval = setInterval(generateObstacle, 2000); // Generate obstacle every 2 seconds
  }

  restartBtn.addEventListener('click', startGame);

  startGame(); // Start game automatically on page load
});
