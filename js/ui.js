import { GRID_SIZE, BONUS_TYPES } from './constants.js';
import { gameState } from './gameState.js';

export function renderBoardUI(boardContainer) {
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

export function renderRackUI(letterRack) {
    letterRack.innerHTML = '';
    for (const letter of gameState.rack) {
        const span = document.createElement('span');
        span.className = 'inline-block w-10 h-10 bg-yellow-100 border border-gray-400 rounded text-center leading-10 font-bold text-xl mx-1';
        span.textContent = letter;
        letterRack.appendChild(span);
    }
}

export function updateScoresUI(scoresContainer) {
    scoresContainer.innerHTML = gameState.players.map(p => `<div class="flex justify-between"><span>${p.name}</span><span>${p.score} pts</span></div>`).join('');
}

export function updateGameInfoUI(turnNumberEl, bagCountEl) {
    turnNumberEl.textContent = gameState.turn;
    bagCountEl.textContent = gameState.bag.length;
}
