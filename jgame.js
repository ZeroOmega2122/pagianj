var time, deltaTime, sueloY, velY, impulso, gravedad, ovejaPosX, ovejaPosY, sueloX;
var velEscenario = 1080 / 3;
var gameVel = 1;
var score;
var parada = true;
var saltado = false;
var tiempoHastaObstaculo, tiempoObstaculoMin = 0.7, tiempoObstaculoMax = 1.8;
var obstaculos = [];
var musicaIniciada = false;

var contenedor, oveja, textoScore, suelo, gameOver, reiniciarBtn;
var jumpSound = document.getElementById("jump-sound");
jumpSound.volume = 0.2;
var gameOverSound = document.getElementById("game-over-sound");
gameOverSound.volume = 0.5;
var backgroundMusic = document.getElementById("background-music");
backgroundMusic.volume = 0.2;
var newBackgroundMusic = document.getElementById("new-background-music");
newBackgroundMusic.volume = 0.4;
var hitSound = document.getElementById("hit-sound");
hitSound.volume = 0.5;
var scoreSound = document.getElementById("score-sound");
scoreSound.volume = 0.9;

var nuevaImagenFondo = "/Igame/night2.jpg"; // Cambia esta ruta
var nuevaImagenSuelo = "/Igame/night.png"; // Cambia esta ruta
var nuevaImagenContenedor = "/Igame/night22.jpg";

function Init() {
    time = new Date();
    deltaTime = 0;
    sueloY = 22;
    velY = 0;
    impulso = 900;
    gravedad = 2500;
    ovejaPosX = 42;
    ovejaPosY = sueloY;
    sueloX = 0;
    score = 0;
    obstaculos = [];
    tiempoHastaObstaculo = 2;

    document.querySelector(".score").innerText = score;
    document.querySelector(".game-over").style.display = "none";
    document.querySelector(".reiniciar-btn").style.display = "none";

    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    oveja = document.querySelector(".oveja");
    gameOver = document.querySelector(".game-over");
    reiniciarBtn = document.querySelector(".reiniciar-btn");

    document.addEventListener("keydown", HandleKeyDown);
    Loop();
}

function HandleKeyDown(ev) {
    if (ev.keyCode == 32 && !parada) {
        Saltar();
    }
}

function Saltar() {
if (ovejaPosY === sueloY && !saltado) {
saltado = true;
velY = impulso;

jumpSound.currentTime = 0; // Reinicia el sonido
jumpSound.play(); // Reproduce el sonido

oveja.classList.add("oveja-corriendo");

if (!musicaIniciada) {
    backgroundMusic.play();
    musicaIniciada = true;
}

parada = false;
}
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

function Update() {
    if (parada) return;

    MoverSuelo();
    MoverOveja();
    DecidirCrearObstaculos();
    MoverObstaculos();
    DetectarColision();
    velY -= gravedad * deltaTime;
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel; 
}

function MoverOveja() {
    ovejaPosY += velY * deltaTime;
    if (ovejaPosY < sueloY) {
        TocarSuelo();
    }
    oveja.style.bottom = ovejaPosY + "px";
}

function TocarSuelo() {
    ovejaPosY = sueloY;
    velY = 0;
    if (saltado) {
        oveja.classList.add("oveja-corriendo");
    }
    saltado = false;
}

function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if (tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    obstaculo.classList.add("valla");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth + "px";
    obstaculo.style.bottom = "23.5px";
    obstaculos.push(obstaculo);
    contenedor.appendChild(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) / gameVel;
}

function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        } else {
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX + "px";
        }
    }
}

function GanarPuntos() {
score += 100;
textoScore.innerText = score;

// Verificar el puntaje
console.log("Puntuación actual: " + score);

if (score === 700) {
document.body.style.backgroundImage = `url(${nuevaImagenFondo})`;
suelo.style.backgroundImage = `url(${nuevaImagenSuelo})`;
contenedor.style.backgroundImage = `url(${nuevaImagenContenedor})`;

backgroundMusic.pause();
newBackgroundMusic.play();
}

if (score % 100 === 0) {
ParpadeoPuntuacion();
console.log("Puntuación alcanzada: " + score); // Verificación
scoreSound.currentTime = 0; 
scoreSound.play(); 
}
}
function ParpadeoPuntuacion() {
    textoScore.style.opacity = 0;
    setTimeout(() => {
        textoScore.style.opacity = 1;
    }, 200);
}

function DetectarColision() {
for (var i = 0; i < obstaculos.length; i++) {
if (obstaculos[i].posX < ovejaPosX + oveja.clientWidth) {
    if (Iscollision(obstaculos[i], oveja)) {
        hitSound.currentTime = 0;
        hitSound.play();
        
        // Llamar a GameOver
        GameOver();
    }
}
}
}

function Iscollision(a, b) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();
    return !(
        ((aRect.top + aRect.height) < (bRect.top)) || 
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    );
}

function GameOver() {
oveja.classList.remove("oveja-corriendo");
parada = true;
gameOverSound.currentTime = 0;
gameOverSound.play();

// Detener la música de fondo
if (musicaIniciada) {
backgroundMusic.pause();
musicaIniciada = false; // Resetear el estado
}

// Detener la nueva música si se está reproduciendo
if (!newBackgroundMusic.paused) {
newBackgroundMusic.pause();
}

gameOver.style.display = "block";
reiniciarBtn.style.display = "block";
}
function ReiniciarJuego() {
    location.reload();
}

window.onload = Init; // Iniciar el juego al cargar