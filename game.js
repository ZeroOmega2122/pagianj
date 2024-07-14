document.addEventListener('DOMContentLoaded', () => {
  const Oveja = document.getElementById('Oveja');
  const game = document.getElementById('game');
  const scoreDisplay = document.getElementById('score-value');
  const gameOverDisplay = document.getElementById('game-over');
  const music1 = document.getElementById('background-music');
  const music2 = document.getElementById('background-music-2');
  const jumpSound = document.getElementById('jump-sound');
  const crouchSound = document.getElementById('crouch-sound');
  const hitSound = document.getElementById('hit-sound');
  const gameOverSound = document.getElementById('game-over-sound');

  let isJumping = false;
  let isCrouching = false;
  let isGameOver = false;
  let score = 0;
  let lastObstacleType = '';
  let musicPlaying = null;

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

  // Detección de dispositivo móvil
  function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  if (isMobileDevice()) {
    document.body.classList.add('mobile');
    document.addEventListener('touchstart', jump);
  } else {
    document.addEventListener('click', jump);
  }

  function jump() {
    if (isCrouching) return;
    isJumping = true;
    Oveja.style.animation = 'jump 1s ease-in-out';
    jumpSound.play();

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
    Oveja.style.bottom = '-15px';
    Oveja.style.backgroundImage = 'url(AgachoOV2.png)';
    Oveja.style.animation = 'none';
    crouchSound.play();
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
    let obstacleType = Math.random() > 0.5 ? 'Valla' : 'Halcon'; // Ajustado para que el halcón aparezca más

    if (lastObstacleType === 'Valla' && obstacleType === 'Halcon') {
      obstacleType = 'Halcon';
    } else if (lastObstacleType === 'Halcon' && obstacleType === 'Halcon') {
      obstacleType = 'Valla';
    }

    let obstaclePosition = 1200;
    const obstacle = document.createElement('div');
    obstacle.classList.add(obstacleType);
    game.appendChild(obstacle);
    obstacle.style.left = obstaclePosition + 'px';

    if (obstacleType === 'Halcon') {
      const positions = [70, 100, 150];
      obstacle.style.top = positions[Math.floor(Math.random() * positions.length)] + 'px';
    } else {
      obstacle.style.bottom = '0';
    }

    let timerId = setInterval(function() {
      if (checkCollision(obstacle)) {
        clearInterval(timerId);
        hitSound.play();
        if (obstacle.classList.contains('Halcon') && isCrouching) {
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

  function playMusic() {
    if (score < 700) {
      if (musicPlaying !== music1) {
        if (musicPlaying) musicPlaying.pause();
        music1.currentTime = 0;
        music1.play();
        musicPlaying = music1;
      }
    } else {
      if (musicPlaying !== music2) {
        if (musicPlaying) musicPlaying.pause();
        music2.currentTime = 0;
        music2.play();
        musicPlaying = music2;
      }
    }
  }

  function gameOver() {
    isGameOver = true;
    gameOverDisplay.style.display = 'block';
    while (game.firstChild) {
      game.removeChild(game.firstChild);
    }
    game.appendChild(gameOverDisplay);
    if (musicPlaying) musicPlaying.pause();
    gameOverSound.play();
    setTimeout(() => {
      window.location.reload();
    }, 5000);
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
        playMusic();
        if (score > 700) {
          document.body.style.backgroundImage = 'url("Vnoche.png")';
          game.style.backgroundImage = 'url("Vnoche2.png")';
        }
      }
    }, 100);
  }

  // Para permitir la reproducción automática de audio después de una interacción del usuario
  document.addEventListener('click', () => {
    if (!musicPlaying) {
      music1.play();
      musicPlaying = music1;
    }
  }, { once: true });

  setTimeout(startGame, 1000);
});
