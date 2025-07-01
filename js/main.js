// main.js - Scrabble Duplicate Français

// Cache for loaded word lists by length
const dictionaryCache = {};

/**
 * Check if a word is valid using the ODS9 dictionary files.
 * @param {string} word - The word to check (case-insensitive).
 * @returns {Promise<boolean>} - Resolves to true if valid, false otherwise.
 */
export async function isWordValid(word) {
    const length = word.length;
    if (length < 2 || length > 21) return false; // ODS9 covers 2-21 letters
    const fileName = `ODS9/mots${length}lettres.txt`;
    // Use cache if available
    if (!dictionaryCache[length]) {
        try {
            const response = await fetch(fileName);
            if (!response.ok) return false;
            const text = await response.text();
            // Each word is on a new line, dictionary is uppercase
            dictionaryCache[length] = new Set(
                text.split('\n').map(w => w.trim().toUpperCase()).filter(Boolean)
            );
        } catch (e) {
            return false;
        }
    }
    return dictionaryCache[length].has(word.toUpperCase());
}

// Example usage: test in the console
document.addEventListener('DOMContentLoaded', () => {
    // Test the function with a sample word
    isWordValid('bonjour').then(valid => {
        console.log('"bonjour" is valid:', valid); // Should be true if in ODS9
    });
    isWordValid('xyzabc').then(valid => {
        console.log('"xyzabc" is valid:', valid); // Should be false
    });
});

// --- Add your game logic below ---
// Example: export or define other functions for game setup, board, etc.

// --- Scrabble Duplicate Constants ---
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
    '*': { valeur: 0, nombre: 2 } // Joker
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

// --- Scrabble Duplicate Core Functions ---
export function createBag() {
    const bag = [];
    for (const letter in LETTRES) {
        for (let i = 0; i < LETTRES[letter].nombre; i++) {
            bag.push(letter);
        }
    }
    // Shuffle bag (Fisher-Yates)
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

// --- Game State and Turn Management (add more as needed) ---
export let gameState = {};
export let timerInterval;

export function initGame(playerCount, playerNames) {
    gameState = {
        bag: createBag(),
        grid: createGrid(),
        rack: [],
        players: playerNames.map(name => ({ name, score: 0, move: null })),
        turn: 1,
        isFirstMove: true,
        currentPlayerIndex: 0,
        movesThisTurn: 0,
        gameEnded: false
    };
    // Draw initial rack, update UI, etc. (to be implemented)
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
    gameState.players.forEach(p => p.move = null);
    // Update UI, start timer, etc. (to be implemented)
}

export function startTimer(onTick, onEnd) {
    let timeLeft = 180;
    clearInterval(timerInterval);
    function updateDisplay() {
        if (onTick) onTick(timeLeft);
    }
    updateDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (onEnd) onEnd();
        }
    }, 1000);
}

export function promptNextPlayer() {
    if (gameState.currentPlayerIndex < gameState.players.length) {
        // Focus input, update UI, etc. (to be implemented)
    } else {
        // All players played, end turn (to be implemented)
    }
}

export function handlePlayerMove(passed = false) {
    const player = gameState.players[gameState.currentPlayerIndex];
    if (passed) {
        player.move = { word: '-', position: null, direction: null, score: 0, valid: true };
    } else {
        // Validate and score move (to be implemented)
    }
    gameState.currentPlayerIndex++;
    promptNextPlayer();
}

export function handleEndOfTurnInputs() {
    clearInterval(timerInterval);
    // Hide input, show summary, etc. (to be implemented)
    setTimeout(() => {
        // Compute best move, update UI, etc. (to be implemented)
    }, 100);
}

export function displayTurnSummary(topMove) {
    // Show top move, update summary, update board, etc. (to be implemented)
    gameState.turn++;
}

// --- Move Validation and Scoring ---
export async function validateAndScoreMove(word, positionStr) {
    // 1. Validate word in dictionary
    const valid = await isWordValid(word);
    if (!valid) return { valid: false, score: 0, reason: "Mot non valide dans l'ODS9" };
    // 2. Parse position
    const parsedPos = parsePosition(positionStr);
    if (!parsedPos) return { valid: false, score: 0, reason: "Position invalide" };
    const { row, col, direction } = parsedPos;
    // 3. Validate placement and calculate score (to be implemented)
    return calculateScore(word, row, col, direction, gameState.grid, gameState.rack, gameState.isFirstMove);
}

export function parsePosition(posStr) {
    const matchH = posStr.match(/^([A-O])(\d{1,2})$/i);
    const matchV = posStr.match(/^(\d{1,2})([A-O])$/i);
    if (matchH) {
        const row = matchH[1].toUpperCase().charCodeAt(0) - 65;
        const col = parseInt(matchH[2], 10) - 1;
        return { row, col, direction: 'H' };
    } else if (matchV) {
        const row = parseInt(matchV[1], 10) - 1;
        const col = matchV[2].toUpperCase().charCodeAt(0) - 65;
        return { row, col, direction: 'V' };
    }
    return null;
}

export function calculateScore(word, row, col, direction, grid, rack, isFirstMove) {
    // Placeholder: implement full scoring logic
    // Return { valid: true/false, score, ... }
    return { valid: true, score: 0, word, row, col, direction, lettersToPlace: [] };
}

export function placeWordOnGrid(word, row, col, direction) {
    // Place word on grid (to be implemented)
}

// --- Rendering Functions (stubs) ---
export function renderBoard() {}
export function renderRack() {}
export function updateScores() {}
export function updateGameInfo() {}
export function showMessage(msg) { alert(msg); }
export function hideMessage() {}

// === UI Integration ===

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
        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        renderBoardUI();
        renderRackUI();
        updateScoresUI();
        updateGameInfoUI();
        promptNextPlayerUI();
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
            span.className = 'inline-block w-10 h-10 bg-yellow-100 border border-gray-400 rounded text-center leading-10 font-bold text-xl mx-1';
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
        } else {
            // All players played, end turn
            handleEndOfTurnInputs();
        }
    }

    // Submit move
    submitMoveBtn.addEventListener('click', async () => {
        const word = wordInput.value.trim().toUpperCase();
        const pos = positionInput.value.trim().toUpperCase();
        if (!word || !pos) {
            showMessage('Veuillez entrer un mot et une position.');
            return;
        }
        const result = await validateAndScoreMove(word, pos);
        if (!result.valid) {
            showMessage(result.reason || 'Coup invalide.');
            return;
        }
        const player = gameState.players[gameState.currentPlayerIndex];
        player.move = { word, position: pos, direction: result.direction, score: result.score, valid: true };
        player.score += result.score;
        placeWordOnGrid(word, result.row, result.col, result.direction);
        gameState.rack = gameState.rack.filter((l, i) => !result.lettersToPlace.map(x => x.letter).includes(l) || result.lettersToPlace.map(x => x.letter).indexOf(l) !== i);
        renderBoardUI();
        renderRackUI();
        updateScoresUI();
        gameState.currentPlayerIndex++;
        promptNextPlayerUI();
    });

    // Pass turn
    passTurnBtn.addEventListener('click', () => {
        const player = gameState.players[gameState.currentPlayerIndex];
        player.move = { word: '-', position: null, direction: null, score: 0, valid: true };
        gameState.currentPlayerIndex++;
        promptNextPlayerUI();
    });

    // Next turn
    nextTurnBtn.addEventListener('click', () => {
        startTurn();
        renderRackUI();
        updateScoresUI();
        updateGameInfoUI();
        promptNextPlayerUI();
    });

    // Play again
    playAgainBtn.addEventListener('click', () => {
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
