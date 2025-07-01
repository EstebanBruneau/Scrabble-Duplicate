import { LETTRES, GRID_SIZE, BONUS_TYPES, BONUS_POSITIONS } from './constants.js';

export let gameState = {};
export let timerInterval;

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
}
