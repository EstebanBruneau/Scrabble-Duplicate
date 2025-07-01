import { GRID_SIZE, BONUS_TYPES } from './constants.js';
import { gameState } from './gameState.js';

export function renderBoardUI(boardContainer) {
    boardContainer.innerHTML = '';
    // Create a wrapper div for the board with labels
    const boardTable = document.createElement('div');
    boardTable.className = 'inline-block';
    // Letters for columns (A-O)
    const letters = Array.from({ length: GRID_SIZE }, (_, i) => String.fromCharCode(65 + i));
    // Build the grid with labels
    for (let r = -1; r < GRID_SIZE; r++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'flex';
        for (let c = -1; c < GRID_SIZE; c++) {
            const cell = document.createElement('div');
            // Top-left corner: empty
            if (r === -1 && c === -1) {
                cell.className = 'w-8 h-8';
            } else if (r === -1) {
                // Top row: letters
                cell.className = 'w-8 h-8 flex items-center justify-center font-bold text-gray-600 bg-gray-200 border border-gray-400';
                cell.textContent = letters[c];
            } else if (c === -1) {
                // First column: numbers
                cell.className = 'w-8 h-8 flex items-center justify-center font-bold text-gray-600 bg-gray-200 border border-gray-400';
                cell.textContent = (r + 1);
            } else {
                // Board cell
                cell.className = 'w-8 h-8 border border-gray-400 text-center align-middle bg-white text-lg font-bold flex items-center justify-center';
                const tile = gameState.grid[r][c];
                if (tile.letter) {
                    cell.textContent = tile.letter;
                    cell.classList.add('bg-yellow-200');
                } else if (tile.bonus !== BONUS_TYPES.NONE) {
                    cell.textContent = tile.bonus;
                    cell.classList.add('text-xs', 'text-blue-600');
                }
            }
            rowDiv.appendChild(cell);
        }
        boardTable.appendChild(rowDiv);
    }
    boardContainer.appendChild(boardTable);
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
