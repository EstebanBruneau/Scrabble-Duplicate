import { gameState } from './gameState.js';
import { validateAndScoreMove, placeWordOnGrid } from './moveValidation.js';
import { startTimer, stopTimer } from './ui.js';


// --- ODS9 Dictionary Loader ---
const dictionaryCache = {};
export async function isWordValid(word) {
    const length = word.length;
    if (length < 2 || length > 21) return false;
    const fileName = `ODS9/mots${length}lettres.txt`;
    if (!dictionaryCache[length]) {
        try {
            const response = await fetch(fileName);
            if (!response.ok) return false;
            const text = await response.text();
            dictionaryCache[length] = new Set(
                text.split('\n').map(w => w.trim().toUpperCase()).filter(Boolean)
            );
        } catch (e) {
            return false;
        }
    }
    return dictionaryCache[length].has(word.toUpperCase());
}

// --- Scrabble Constants ---
export const LETTRES = {
    'A': { valeur: 1, nombre: 9 }, 'B': { valeur: 3, nombre: 2 },
    'C': { valeur: 3, nombre: 2 }, 'D': { valeur: 2, nombre: 3 },
    'E': { valeur: 1, nombre: 15}, 'F': { valeur: 4, nombre: 2 },
    'G': { valeur: 2, nombre: 2 }, 'H': { valeur: 4, nombre: 2 },
    'I': { valeur: 1, nombre: 8 }, 'J': { valeur: 8, nombre: 1 },
    'K': { valeur: 10, nombre: 1}, 'L': { valeur: 1, nombre: 5 },
    'M': { valeur: 2, nombre: 3 }, 'N': { valeur: 1, nombre: 6 },
    'O': { valeur: 1, nombre: 6 }, 'P': { valeur: 3, nombre: 2 },
    'Q': { valeur: 8, nombre: 1 }, 'R': { valeur: 1, nombre: 6 },
    'S': { valeur: 1, nombre: 6 }, 'T': { valeur: 1, nombre: 6 },
    'U': { valeur: 1, nombre: 6 }, 'V': { valeur: 4, nombre: 2 },
    'W': { valeur: 10, nombre: 1}, 'X': { valeur: 10, nombre: 1},
    'Y': { valeur: 10, nombre: 1}, 'Z': { valeur: 10, nombre: 1},
    '*': { valeur: 0, nombre: 2 }
};
export const GRID_SIZE = 15;
export const BONUS_TYPES = {
    NONE: 'NONE',
    LETTER_DOUBLE: 'LD',
    LETTER_TRIPLE: 'LT',
    WORD_DOUBLE: 'MD',
    WORD_TRIPLE: 'MT'
};
export const BONUS_POSITIONS = {
    [BONUS_TYPES.WORD_TRIPLE]: ['0,0', '0,7', '0,14', '7,0', '7,14', '14,0', '14,7', '14,14'],
    [BONUS_TYPES.WORD_DOUBLE]: ['1,1', '2,2', '3,3', '4,4', '1,13', '2,12', '3,11', '4,10', '13,1', '12,2', '11,3', '10,4', '13,13', '12,12', '11,11', '10,10'],
    [BONUS_TYPES.LETTER_TRIPLE]: ['1,5', '1,9', '5,1', '5,5', '5,9', '5,13', '9,1', '9,5', '9,9', '9,13', '13,5', '13,9'],
    [BONUS_TYPES.LETTER_DOUBLE]: ['0,3', '0,11', '2,6', '2,8', '3,0', '3,7', '3,14', '6,2', '6,6', '6,8', '6,12', '7,3', '7,11', '8,2', '8,6', '8,8', '8,12', '11,0', '11,7', '11,14', '12,6', '12,8', '14,3', '14,11']
};

// --- Game State ---
export let timerInterval;

export function endTurn() {
    // Refill rack to 7 letters
    const needed = 7 - gameState.rack.length;
    const drawn = gameState.bag.splice(0, needed);
    gameState.rack.push(...drawn);
    // If bag and rack are empty, end game
    if (gameState.bag.length === 0 && gameState.rack.length === 0) {
        gameState.gameEnded = true;
        // Optionally trigger end game UI here
        return;
    }
    gameState.currentPlayerIndex = 0;
    gameState.turn++;
    gameState.movesThisTurn = 0;
    if (Array.isArray(gameState.players)) {
        gameState.players.forEach(p => { if (p) p.move = null; });
    }
}

export function createBag() {
    const bag = [];
    for (const letter in LETTRES) {
        for (let i = 0; i < LETTRES[letter].nombre; i++) {
            bag.push(letter);
        }
    }
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag;
}

export function createGrid() {
    const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null).map(() => ({
        locked: false,
        letter: null,
        bonus: BONUS_TYPES.NONE
    })));
    for (const type in BONUS_POSITIONS) {
        for (const pos of BONUS_POSITIONS[type]) {
            const [r, c] = pos.split(',').map(Number);
            grid[r][c].bonus = type;
        }
    }
    return grid;
}

export function initGame(playerCount, playerNames) {
    gameState.bag = createBag();
    gameState.grid = createGrid();
    gameState.rack = [];
    gameState.players = playerNames.map(name => ({ name, score: 0, move: null }));
    gameState.turn = 1;
    gameState.isFirstMove = true;
    gameState.currentPlayerIndex = 0;
    gameState.movesThisTurn = 0;
    gameState.gameEnded = false;
}

export function startTurn() {
    if (gameState.gameEnded) return;
    const needed = 7 - gameState.rack.length;
    const drawn = gameState.bag.splice(0, needed);
    gameState.rack.push(...drawn);
    if (gameState.rack.length === 0) {
        // End game logic (to be implemented)
        return;
    }
    gameState.currentPlayerIndex = 0;
    gameState.movesThisTurn = 0;
    if (Array.isArray(gameState.players)) {
        gameState.players.forEach(p => { if (p) p.move = null; });
    }
}

// export async function validateAndScoreMove(word, positionStr, directionOverride) {
//     const valid = await isWordValid(word);
//     if (!valid) return { valid: false, score: 0, reason: "Mot non valide dans l'ODS9" };
//     const parsedPos = parsePosition(positionStr, directionOverride);
//     if (!parsedPos) return { valid: false, score: 0, reason: "Position invalide" };
//     const { row, col, direction } = parsedPos;
//     return calculateScore(word, row, col, direction, gameState.grid, gameState.rack, gameState.isFirstMove);
// }

export function parsePosition(posStr, directionOverride) {
    const matchH = posStr.match(/^([A-O])(\d{1,2})$/i);
    const matchV = posStr.match(/^(\d{1,2})([A-O])$/i);
    if (matchH) {
        const row = matchH[1].toUpperCase().charCodeAt(0) - 65;
        const col = parseInt(matchH[2], 10) - 1;
        return { row, col, direction: directionOverride || 'H' };
    } else if (matchV) {
        const row = parseInt(matchV[1], 10) - 1;
        const col = matchV[2].toUpperCase().charCodeAt(0) - 65;
        return { row, col, direction: directionOverride || 'V' };
    }
    return null;
}

export function calculateScore(word, row, col, direction, grid, rack, isFirstMove) {
    // TODO: Implement full scoring logic
    return { valid: true, score: 0, word, row, col, direction, lettersToPlace: [] };
}

// export function placeWordOnGrid(word, row, col, direction) {
//     // TODO: Implement word placement on grid
// }

// --- UI Integration ---
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const playerCountSelect = document.getElementById('player-count');
    const playerNamesContainer = document.getElementById('player-names-container');
    const startGameBtn = document.getElementById('start-game-btn');
    const boardContainer = document.getElementById('board-container');
    const letterRack = document.getElementById('letter-rack');
    const wordInput = document.getElementById('word-input');
    const positionInput = document.getElementById('position-input');
    const submitMoveBtn = document.getElementById('submit-move-btn');
    const passTurnBtn = document.getElementById('pass-turn-btn');
    const scoresContainer = document.getElementById('scores-container');
    const turnNumberEl = document.getElementById('turn-number');
    const bagCountEl = document.getElementById('bag-count');
    const timerEl = document.getElementById('timer');
    const gameOverModal = document.getElementById('game-over-modal');
    const finalScoresEl = document.getElementById('final-scores');
    const playAgainBtn = document.getElementById('play-again-btn');
    const currentPlayerPrompt = document.getElementById('current-player-prompt');
    const nextTurnContainer = document.getElementById('next-turn-container');
    const nextTurnBtn = document.getElementById('next-turn-btn');
    const turnSummary = document.getElementById('turn-summary');
    const topMoveInfoEl = document.getElementById('top-move-info');
    const playerMovesSummaryEl = document.getElementById('player-moves-summary');
    const messageModal = document.getElementById('message-modal');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');
    const directionToggleBtn = document.getElementById('direction-toggle-btn');

    // Direction toggle state
    let currentDirection = 'H';
    directionToggleBtn.addEventListener('click', () => {
        currentDirection = currentDirection === 'H' ? 'V' : 'H';
        directionToggleBtn.textContent = currentDirection;
        directionToggleBtn.setAttribute('aria-label', currentDirection === 'H' ? 'Horizontal' : 'Vertical');
    });

    // Player name fields
    function updatePlayerNameFields() {
        const count = parseInt(playerCountSelect.value);
        playerNamesContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'w-full p-2 border border-gray-300 rounded-md';
            input.placeholder = `Nom du joueur ${i + 1}`;
            input.value = `Joueur ${i + 1}`;
            playerNamesContainer.appendChild(input);
        }
    }
    playerCountSelect.addEventListener('change', updatePlayerNameFields);
    updatePlayerNameFields();

    // Start game
    startGameBtn.addEventListener('click', () => {
        const playerNames = Array.from(playerNamesContainer.querySelectorAll('input')).map(input => input.value.trim() || 'Joueur');
        initGame(playerNames.length, playerNames);
        startTurn();
        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        renderBoardUI();
        renderRackUI();
        updateScoresUI();
        updateGameInfoUI();
        promptNextPlayerUI();
        startTimer(timerEl, () => {
            // Timer expired: auto-pass the turn
            showMessage('Temps écoulé ! Tour passé automatiquement.');
            const player = gameState.players[gameState.currentPlayerIndex];
            player.move = { word: '-', position: null, direction: null, score: 0, valid: true };
            gameState.currentPlayerIndex++;
            promptNextPlayerUI();
        });
    });

    // Render board
    function renderBoardUI() {
        boardContainer.innerHTML = '';
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const cell = document.createElement('div');
                cell.className = 'inline-block w-8 h-8 border border-gray-400 text-center align-middle bg-white text-lg font-bold';
                const tile = gameState.grid[r][c];
                if (tile.letter) {
                    cell.textContent = tile.letter;
                    cell.classList.add('bg-yellow-200');
                } else if (tile.bonus !== BONUS_TYPES.NONE) {
                    cell.textContent = tile.bonus;
                    cell.classList.add('text-xs', 'text-blue-600');
                }
                boardContainer.appendChild(cell);
            }
        }
    }

    // Render rack
    function renderRackUI() {
        letterRack.innerHTML = '';
        for (const letter of gameState.rack) {
            const span = document.createElement('span');
            span.className = 'inline-block w-10 h-10 bg-yellow-100 border border-gray-400 rounded text-center leading-10 font-bold text-xl mx-1 shadow';
            span.textContent = letter;
            letterRack.appendChild(span);
        }
    }

    // Update scores
    function updateScoresUI() {
        scoresContainer.innerHTML = gameState.players.map(p => `<div class="flex justify-between"><span>${p.name}</span><span>${p.score} pts</span></div>`).join('');
    }

    // Update game info
    function updateGameInfoUI() {
        turnNumberEl.textContent = gameState.turn;
        bagCountEl.textContent = gameState.bag.length;
    }

    // Prompt next player
    function promptNextPlayerUI() {
        if (gameState.currentPlayerIndex < gameState.players.length) {
            currentPlayerPrompt.textContent = `À ${gameState.players[gameState.currentPlayerIndex].name} de jouer !`;
            wordInput.value = '';
            positionInput.value = '';
            wordInput.focus();
            startTimer(timerEl, () => {
                showMessage('Temps écoulé ! Tour passé automatiquement.');
                const player = gameState.players[gameState.currentPlayerIndex];
                player.move = { word: '-', position: null, direction: null, score: 0, valid: true };
                gameState.currentPlayerIndex++;
                promptNextPlayerUI();
            });
        } else {
            // All players played, end turn
            stopTimer();
            endTurn();
            renderRackUI();
            updateScoresUI();
            updateGameInfoUI();
            promptNextPlayerUI();
        }
    }

    // Submit move
    submitMoveBtn.addEventListener('click', async () => {
        stopTimer();
        const word = wordInput.value.trim().toUpperCase();
        const pos = positionInput.value.trim().toUpperCase();
        const direction = currentDirection; // Use the direction toggle
        console.log('[DEBUG] Soumettre clicked. Word:', word, 'Position:', pos, 'Direction:', direction, 'Rack:', [...gameState.rack]);
        if (!word || !pos) {
            console.log('[DEBUG] Missing word or position');
            showMessage('Veuillez entrer un mot et une position.');
            return;
        }
        // Use moveValidation.js logic (call with direction override)
        const result = await validateAndScoreMove(word, pos, direction);
        console.log('[DEBUG] validateAndScoreMove result:', result);
        if (!result.valid) {
            console.log('[DEBUG] Invalid move, reason:', result.reason);
            showMessage(result.reason || 'Coup invalide.');
            return;
        }
        const player = gameState.players[gameState.currentPlayerIndex];
        player.move = { word, position: pos, direction: result.direction, score: result.score, valid: true };
        player.score += result.score;
        placeWordOnGrid(word, result.row, result.col, result.direction);
        // After first move, set isFirstMove to false
        if (gameState.isFirstMove) {
            gameState.isFirstMove = false;
        }
        // Remove used letters from rack (use same logic as canFormWordFromRack)
        let rackCopy = [...gameState.rack];
        for (const letter of word) {
            let idx = rackCopy.indexOf(letter);
            if (idx !== -1) {
                rackCopy.splice(idx, 1);
            } else {
                idx = rackCopy.indexOf('*');
                if (idx !== -1) {
                    rackCopy.splice(idx, 1);
                }
            }
        }
        gameState.rack = rackCopy;
        renderBoardUI();
        renderRackUI();
        updateScoresUI();
        gameState.currentPlayerIndex++;
        promptNextPlayerUI();
    });

    // Pass turn
    passTurnBtn.addEventListener('click', () => {
        stopTimer();
        const player = gameState.players[gameState.currentPlayerIndex];
        player.move = { word: '-', position: null, direction: null, score: 0, valid: true };
        gameState.currentPlayerIndex++;
        promptNextPlayerUI();
    });

    // Next turn
    nextTurnBtn.addEventListener('click', () => {
        stopTimer();
        startTurn();
        renderRackUI();
        updateScoresUI();
        updateGameInfoUI();
        promptNextPlayerUI();
    });

    // Play again
    playAgainBtn.addEventListener('click', () => {
        stopTimer();
        gameScreen.classList.add('hidden');
        setupScreen.classList.remove('hidden');
        gameOverModal.classList.add('hidden');
        playerCountSelect.dispatchEvent(new Event('change'));
    });

    // Message modal
    function showMessage(msg) {
        messageText.textContent = msg;
        messageModal.classList.remove('hidden');
        setTimeout(() => {
            messageModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
        }, 10);
    }
    function hideMessage() {
        messageModal.querySelector('div').classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            messageModal.classList.add('hidden');
        }, 200);
    }
    closeMessageBtn.addEventListener('click', hideMessage);
});

