// Configuration technique
const CONFIG = {
    gameDuration: 60, // secondes
    tickSpeed: 500 // ms (changement de nombre)
};

// État de la mémoire système
let gameState = {
    score: 0,
    timeLeft: CONFIG.gameDuration,
    currentTarget: 0,
    isRunning: false
};

// Liens avec le matériel (DOM)
const ui = {
    timer: document.getElementById('timer'),
    score: document.getElementById('score'),
    target: document.getElementById('target-number'),
    numpad: document.getElementById('numpad'),
    timeBar: document.getElementById('inner-bar'),
    displayArea: document.querySelector('.display-mainframe'),
    // Écrans
    startScreen: document.getElementById('start-screen'),
    endScreen: document.getElementById('end-screen'),
    finalScore: document.getElementById('final-score'),
    // Boutons
    startBtn: document.getElementById('start-btn')
};

// Intervalles (Processeurs)
let gameProcessor, countdownProcessor;

// --- INITIALISATION ---
function init() {
    // Génération technologique du pavé numérique
    ui.numpad.innerHTML = ''; // Nettoyage
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn-cyber';
        if (i === 10) btn.classList.add('span-all');
        btn.textContent = i;
        btn.addEventListener('click', () => processInput(i, btn));
        ui.numpad.appendChild(btn);
    }

    ui.startBtn.addEventListener('click', bootSystem);
}

// --- CORE GAME LOGIC ---

function bootSystem() {
    ui.startScreen.classList.remove('active');
    gameState.score = 0;
    gameState.timeLeft = CONFIG.gameDuration;
    gameState.isRunning = true;
    
    updateInterface();
    
    // Démarrage des processus
    gameProcessor = setInterval(cycleTarget, CONFIG.tickSpeed);
    countdownProcessor = setInterval(clockTick, 1000);
    
    cycleTarget(); // Premier lancement immédiat
}

function cycleTarget() {
    if(!gameState.isRunning) return;

    // Génération nouveau nombre cible (1-10)
    let nextTarget;
    do {
        nextTarget = Math.floor(Math.random() * 10) + 1;
    } while (nextTarget === gameState.currentTarget); // Évite d'avoir deux fois le même de suite
    
    gameState.currentTarget = nextTarget;
    
    // Mise à jour visuelle avec micro-animation
    ui.target.textContent = gameState.currentTarget;
    ui.target.style.transform = 'scale(1.1)';
    setTimeout(() => ui.target.style.transform = 'scale(1)', 50);

    // Reset et lancement de l'animation de la barre de temps (500ms)
    animateTimeBar();
}

function animateTimeBar() {
    // Reset immédiat sans transition
    ui.timeBar.style.transition = 'none';
    ui.timeBar.style.width = '100%';
    ui.timeBar.style.background = 'var(--neon-blue)';
    ui.timeBar.style.boxShadow = '0 0 10px var(--neon-blue)';

    // Force le redraw pour que le navigateur comprenne le reset
    void ui.timeBar.offsetWidth;

    // Lance la transition vers 0
    ui.timeBar.style.transition = `width ${CONFIG.tickSpeed}ms linear, background ${CONFIG.tickSpeed}ms linear`;
    ui.timeBar.style.width = '0%';
    
    // Devient rouge sur la fin du cycle
    setTimeout(() => {
        if(gameState.isRunning) {
            ui.timeBar.style.background = 'var(--neon-pink)';
            ui.timeBar.style.boxShadow = '0 0 10px var(--neon-pink)';
        }
    }, CONFIG.tickSpeed * 0.7);
}

function processInput(playerChosenNumber, clickedBtn) {
    if (!gameState.isRunning) return;

    if (playerChosenNumber === gameState.currentTarget) {
        // ENREGISTREMENT SUCCÈS
        gameState.score++;
        ui.score.textContent = gameState.score;
        
        // Feedback visuel High-Tech
        ui.displayArea.classList.add('flash-success');
        setTimeout(() => ui.displayArea.classList.remove('flash-success'), 300);

        // Forcer cycle immédiat pour récompenser la rapidité
        clearInterval(gameProcessor);
        cycleTarget();
        gameProcessor = setInterval(cycleTarget, CONFIG.tickSpeed);
    } else {
        // ÉCHEC : Pas de pénalité de score selon le sujet, juste feedback visuel
        clickedBtn.style.borderColor = 'var(--neon-pink)';
        clickedBtn.style.boxShadow = '0 0 10px var(--neon-pink-glow)';
        setTimeout(() => {
            clickedBtn.style.borderColor = '#333';
            clickedBtn.style.boxShadow = 'none';
        }, 200);
    }
}

function clockTick() {
    gameState.timeLeft--;
    ui.timer.textContent = gameState.timeLeft;
    
    // Alerte critique temps faible
    if(gameState.timeLeft <= 10) {
        ui.timer.style.animation = 'pulse 0.5s infinite alternate';
    }

    if (gameState.timeLeft <= 0) {
        shutdownSystem();
    }
}

function updateInterface() {
    ui.score.textContent = gameState.score;
    ui.timer.textContent = gameState.timeLeft;
    ui.timer.style.animation = 'none';
}

function shutdownSystem() {
    gameState.isRunning = false;
    clearInterval(gameProcessor);
    clearInterval(countdownProcessor);
    
    // Affichage écran de fin
    ui.finalScore.textContent = gameState.score;
    ui.endScreen.classList.add('active');
}

// Lancement au chargement
window.onload = init;