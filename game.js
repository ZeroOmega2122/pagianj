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

  function gameOver() {
    isGameOver = true;
    gameOverDisplay.style.display = 'block';
    restartBtn.style.display = 'block';
  }

  function startGame() {
    isGameOver = false;
    gameOverDisplay.style.display = 'none';
    restartBtn.style.display = 'none';
    score = 0;
    scoreDisplay.textContent = score;

    // Lógica para el juego (por ejemplo, generar obstáculos, manejar colisiones, aumentar puntaje)
  }

  restartBtn.addEventListener('click', startGame);

  startGame(); // Inicia el juego automáticamente al cargar la página
});
