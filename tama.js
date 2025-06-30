// Archivo principal de JavaScript para el Tamagotchi de perro Jorchire

// Estados del Tamagotchi
let happiness = 100;
let hunger = 0;
let health = 100;
let energy = 100;
let hygiene = 100;
let discipline = 50;
let waste = false; // ¿Hay desecho?
let sick = false;
let recovering = false;
let sickTimeout = null;
let gameOver = false;
let experience = 0; // experiencia actual
let experienceToNextStage = 100; // experiencia necesaria para evolucionar
let recoveryEndTime = null;
let recoveryInterval = null;
let stage = "huevo"; // <-- ¡Agrega esto!
let age = 0;         // Si no lo tienes ya

// Actualiza la interfaz
function updateStatus() {
    document.getElementById('happiness').textContent = happiness;
    document.getElementById('hunger').textContent = hunger;
    document.getElementById('health').textContent = health;
    document.getElementById('energy').textContent = energy;
    document.getElementById('hygiene').textContent = hygiene;
    document.getElementById('discipline').textContent = discipline;
    // Estado textual
    if (sick) {
        document.getElementById('sick').textContent = "🤒 Enfermo";
    } else if (recovering) {
        document.getElementById('sick').textContent = "⏳ Recuperación";
    } else {
        document.getElementById('sick').textContent = "Sano";
    }
    updateExperienceBar();
}

// Comprueba si el juego terminó
function checkGameOver() {
    // El bebé no puede morir
    if (stage === "bebe") return;

    if (hunger >= 100 || health <= 0 || happiness <= 0 || energy <= 0) {
        gameOver = true;
        showMessage("💀 ¡Tu Jorchire ha muerto! 💀");
        let deadStage = stage;
        if (deadStage === "niño") deadStage = "niño";
        else if (deadStage === "adolescente") deadStage = "adolescente";
        else if (deadStage === "adulto") deadStage = "adulto";
        else deadStage = "huevo";
        document.getElementById('jorchire-image').src = `assets/jorchire_${deadStage}_dead.jpg`;
        updateButtons();
    }
}

// Alimentar
document.getElementById('feed-button').addEventListener('click', function() {
    if (gameOver) return;
    if (hunger > 0) {
        hunger = Math.max(0, hunger - 20);
        happiness = Math.min(100, happiness + 5);
        waste = true; // Hace popó después de comer
        showMessage("¡Alimentaste a tu Jorchire!");
    } else {
        showMessage("¡No tiene hambre!");
    }
    updateStatus();
    updateButtons();
});

// Jugar
document.getElementById('play-button').addEventListener('click', function() {
    if (gameOver) return;
    if (energy > 20 && hunger < 80) {
        happiness = Math.min(100, happiness + 10);
        hunger = Math.min(100, hunger + 10);
        energy = Math.max(0, energy - 15);
        experience = Math.min(experienceToNextStage, experience + 10); // Suma experiencia al jugar
        showMessage("¡Jugaste con tu Jorchire!");
    } else {
        showMessage("¡Está cansado o hambriento!");
    }
    updateStatus();
    updateExperienceBar();
    updateButtons();
});

// Limpiar
document.getElementById('clean-button').addEventListener('click', function() {
    if (gameOver) return;
    if (waste) {
        waste = false;
        hygiene = Math.min(100, hygiene + 20);
        showMessage("¡Bañaste a tu Jorchire!");
    } else {
        showMessage("¡No hay nada que limpiar!");
    }
    updateStatus();
    updateButtons();
});

// Dormir
document.getElementById('sleep-button').addEventListener('click', function() {
    if (gameOver) return;
    energy = Math.min(100, energy + 40);
    happiness = Math.max(0, happiness - 5);
    updateStatus();
});

// Medicina
document.getElementById('medicine-button').addEventListener('click', function() {
    if (gameOver) return;
    if (sick) {
        health = Math.min(100, health + 30);
        sick = false;
        recovering = true;
        showMessage("¡Le diste medicina! Está en recuperación...");
        updateStatus();
        updateButtons();
        // Tiempo aleatorio de recuperación (5 a 10 min)
        let recoveryTime = (Math.floor(Math.random() * 6) + 5) * 60000;
        recoveryEndTime = Date.now() + recoveryTime;
        updateRecoveryTimer();
        if (recoveryInterval) clearInterval(recoveryInterval);
        recoveryInterval = setInterval(updateRecoveryTimer, 1000);
        sickTimeout = setTimeout(() => {
            recovering = false;
            recoveryEndTime = null;
            if (recoveryInterval) clearInterval(recoveryInterval);
            document.getElementById('recovery-timer').textContent = "";
            showMessage("¡Tu Jorchire se ha recuperado!");
            updateStatus();
            updateButtons();
        }, recoveryTime);
    } else {
        showMessage("¡No está enfermo!");
        updateStatus();
        updateButtons();
    }
});

// Regañar
document.getElementById('scold-button').addEventListener('click', function() {
    if (gameOver) return;
    discipline = Math.min(100, discipline + 10);
    happiness = Math.max(0, happiness - 5);
    showMessage("¡Has regañado a tu Jorchire!");
    updateStatus();
    updateButtons();
});

// Timer: Cambios automáticos
setInterval(function() {
    if (gameOver) return;
    let factor = (sick || recovering) ? 1.25 : 1;
    hunger = Math.min(100, hunger + 2 * factor);
    happiness = Math.max(0, happiness - 1 * factor);
    energy = Math.max(0, energy - 1 * factor);
    hygiene = waste ? Math.max(0, hygiene - 5 * factor) : Math.max(0, hygiene - 1 * factor);

    // Enfermedad por suciedad o hambre
    if ((hygiene < 30 || hunger > 80) && Math.random() < 0.1 && !sick && !recovering) sick = true;
    if (sick) health = Math.max(0, health - 5 * factor);

    updateStatus();
    checkGameOver();
}, 2000);

// Inicializa la interfaz al cargar
window.onload = function() {
    updateStatus();
    updateButtons();

    // --- MODAL DE MINIJUEGOS ---
    const gamesBtn = document.getElementById('games-button');
    const modal = document.getElementById('mini-games-modal');
    const closeBtn = document.getElementById('close-mini-games');
    const guessBtn = document.getElementById('mini-game-guess');
    const clickerBtn = document.getElementById('mini-game-clicker');
    const memoryBtn = document.getElementById('mini-game-memory');

    if (gamesBtn && modal && closeBtn && guessBtn && clickerBtn && memoryBtn) {
        gamesBtn.onclick = () => { modal.style.display = 'flex'; };
        closeBtn.onclick = () => { modal.style.display = 'none'; };

        guessBtn.onclick = function() {
            modal.style.display = 'none';
            let guess = prompt("Adivina un número del 1 al 3");
            let correct = Math.floor(Math.random() * 3) + 1;
            if (parseInt(guess) === correct) {
                happiness = Math.min(100, happiness + 20);
                showMessage("¡Adivinaste! Muy feliz.");
            } else {
                happiness = Math.min(100, happiness + 10);
                showMessage("¡Jugaste, pero no adivinaste!");
            }
            hunger = Math.min(100, hunger + 10);
            energy = Math.max(0, energy - 15);
            updateStatus();
            updateButtons();
        };
        clickerBtn.onclick = function() {
            modal.style.display = 'none';
            let clicks = 0;
            let tiempo = 2; // segundos
            showMessage("¡Haz click en OK lo más rápido posible!");
            let start = Date.now();
            function clicker() {
                if ((Date.now() - start) / 1000 < tiempo) {
                    clicks++;
                    setTimeout(clicker, 0);
                } else {
                    let expGanada = Math.min(50, clicks * 2);
                    experience = Math.min(experienceToNextStage, experience + expGanada);
                    happiness = Math.min(100, happiness + Math.floor(expGanada / 10));
                    showMessage(`¡Lograste ${clicks} clicks! +${expGanada} EXP`);
                    updateStatus();
                    updateExperienceBar();
                }
            }
            clicker();
        };
        memoryBtn.onclick = function() {
            modal.style.display = 'none';
            let secuencia = [];
            let nivel = 1;
            for (let i = 0; i < nivel; i++) secuencia.push(Math.floor(Math.random() * 4) + 1);
            let respuesta = prompt(`Secuencia: ${secuencia.join('-')}\nRepítela separada por guiones (ej: 1-2-3)`);
            if (respuesta === secuencia.join('-')) {
                let expGanada = 30;
                experience = Math.min(experienceToNextStage, experience + expGanada);
                happiness = Math.min(100, happiness + 10);
                showMessage(`¡Memoria perfecta! +${expGanada} EXP`);
            } else {
                showMessage("¡Fallaste la secuencia!");
            }
            updateStatus();
            updateExperienceBar();
        };
    }
};

// Mensajes de estado
function showMessage(msg) {
    document.getElementById('status-message').textContent = msg;
    // No borres el mensaje automáticamente
}

function updateButtons() {
    document.getElementById('feed-button').disabled = gameOver;
    document.getElementById('clean-button').disabled = gameOver;
    document.getElementById('medicine-button').disabled = gameOver;
    document.getElementById('sleep-button').disabled = gameOver;
    document.getElementById('play-button').disabled = gameOver;
    document.getElementById('scold-button').disabled = gameOver;
}

// Timer de edad: suma 1 minuto cada minuto real
setInterval(() => {
    if (!gameOver) {
        age += 1;
        experience = Math.min(experienceToNextStage, experience + 1);
        updateExperienceBar();
        if (experience >= experienceToNextStage && stage !== "adulto") {
            avanzarEtapa();
        }
    }
}, 10 * 60); // 1 minuto real
    
function avanzarEtapa() {
    if (stage === "huevo") {
        stage = "bebe";
        experience = 0;        setInterval(() => {
            if (gameOver) return;
            if ((hygiene < 30 || hunger > 80) && Math.random() < 0.5 && !sick && !recovering) {
                sick = true;
                showMessage("¡Tu Jorchire se ha enfermado!");
                updateStatus();
                updateButtons();
            }
        }, 21600000);
        experienceToNextStage = 100 * 2; // 24 min (ajusta según tu escala)
    } else if (stage === "bebe") {
        stage = "niño";
        experience = 0;
        experienceToNextStage = 200 * 2; // 48 min
    } else if (stage === "niño") {
        stage = "adolescente";
        experience = 0;
        experienceToNextStage = 300 * 2; // 72 min
    } else if (stage === "adolescente") {
        stage = "adulto";
        experience = 0;
        experienceToNextStage = 0;
    }
    document.getElementById('jorchire-image').src = `assets/jorchire_${stage}.jpg`;
    showMessage(`¡Tu Jorchire ha evolucionado a ${stage}!`);
    updateExperienceBar();
}

setInterval(() => {
    if (!gameOver && Math.random() < 0.05) {
        sick = true;
        showMessage("¡Tu Jorchire se ha enfermado!");
        updateStatus();
        updateButtons();
    }
}, 15000); // cada 15 segundos hay una pequeña probabilidad


// Abrir el modal de minijuegos
document.getElementById('games-button').addEventListener('click', function() {
    document.getElementById('mini-games-modal').style.display = 'flex';
});
document.getElementById('close-mini-games').addEventListener('click', function() {
    document.getElementById('mini-games-modal').style.display = 'none';
});

// Lanzar cada minijuego desde el modal
document.getElementById('mini-game-guess').addEventListener('click', function() {
    document.getElementById('mini-games-modal').style.display = 'none';
    // Aquí tu lógica de minijuego "Adivina el número"
    // Por ejemplo:
    let guess = prompt("Adivina un número del 1 al 3");
    let correct = Math.floor(Math.random() * 3) + 1;
    if (parseInt(guess) === correct) {
        happiness = Math.min(100, happiness + 20);
        showMessage("¡Adivinaste! Muy feliz.");
    } else {
        happiness = Math.min(100, happiness + 10);
        showMessage("¡Jugaste, pero no adivinaste!");
    }
    hunger = Math.min(100, hunger + 10);
    energy = Math.max(0, energy - 15);
    updateStatus();
    updateButtons();
});
document.getElementById('mini-game-clicker').addEventListener('click', function() {
    document.getElementById('mini-games-modal').style.display = 'none';
    // Tu lógica de clicker rápido aquí
    let clicks = 0;
    let tiempo = 5; // segundos
    showMessage("¡Haz click en OK lo más rápido posible!");
    let start = Date.now();
    function clicker() {
        if ((Date.now() - start) / 1000 < tiempo) {
            clicks++;
            setTimeout(clicker, 0);
        } else {
            let expGanada = Math.min(50, clicks * 2);
            experience = Math.min(experienceToNextStage, experience + expGanada);
            happiness = Math.min(100, happiness + Math.floor(expGanada / 10));
            showMessage(`¡Lograste ${clicks} clicks! +${expGanada} EXP`);
            updateStatus();
            updateExperienceBar();
        }
    }
    clicker();
});
document.getElementById('mini-game-memory').addEventListener('click', function() {
    document.getElementById('mini-games-modal').style.display = 'none';
    // Tu lógica de memoria aquí
    let secuencia = [];
    let nivel = 1;
    for (let i = 0; i < nivel; i++) secuencia.push(Math.floor(Math.random() * 4) + 1);
    let respuesta = prompt(`Secuencia: ${secuencia.join('-')}\nRepítela separada por guiones (ej: 1-2-3)`);
    if (respuesta === secuencia.join('-')) {
        let expGanada = 30;
        experience = Math.min(experienceToNextStage, experience + expGanada);
        happiness = Math.min(100, happiness + 10);
        showMessage(`¡Memoria perfecta! +${expGanada} EXP`);
    } else {
        showMessage("¡Fallaste la secuencia!");
    }
    updateStatus();
    updateExperienceBar();
});
let audio = new Audio('assets/sonido.mp3');
audio.play();

// Timer de hambre y felicidad: cada 1 hora (3600000 ms)
setInterval(function() {
    if (gameOver) return;
    hunger = Math.min(100, hunger + 25); // Sube 25 cada hora (ajusta según tu escala)
    happiness = Math.max(0, happiness - 25); // Baja 25 cada hora
    updateStatus();
    checkGameOver();
}, 3600000);

// Timer de popó: cada 4 horas (14400000 ms)
setInterval(function() {
    if (gameOver) return;
    waste = true;
    showMessage("¡Tu Jorchire hizo popó!");
    updateStatus();
    updateButtons();
}, 14400000);

// Timer de energía: cada 2 horas (7200000 ms)
setInterval(function() {
    if (gameOver) return;
    energy = Math.max(0, energy - 25);
    updateStatus();
    checkGameOver();
}, 7200000);

// Enfermedad: cada 6 horas (21600000 ms), si está sucio o con hambre alta
setInterval(function() {
    if (gameOver) return;
    if ((hygiene < 30 || hunger > 80) && Math.random() < 0.5 && !sick && !recovering) {
        sick = true;
        showMessage("¡Tu Jorchire se ha enfermado!");
        updateStatus();
        updateButtons();
    }
}, 21600000);

function updateExperienceBar() {
    let percent = Math.min(100, (experience / experienceToNextStage) * 100);
    document.getElementById('exp-bar').style.width = percent + "%";
    document.getElementById('exp-text').textContent = `${experience} / ${experienceToNextStage}`;
    let minutosRestantes = Math.max(0, experienceToNextStage - experience);
    document.getElementById('evo-timer').textContent = `Evolución en: ${minutosRestantes} min`;
}


function updateRecoveryTimer() {
    if (recoveryEndTime && recovering) {
        let ms = recoveryEndTime - Date.now();
        if (ms < 0) ms = 0;
        let min = Math.floor(ms / 60000);
        let sec = Math.floor((ms % 60000) / 1000);
        document.getElementById('recovery-timer').textContent =
            `Recuperación: ${min}m ${sec < 10 ? '0' : ''}${sec}s restantes`;
    } else {
        document.getElementById('recovery-timer').textContent = "";
    }
}
