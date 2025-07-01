import { GRID_SIZE, BONUS_TYPES } from './constants.js';
import { gameState } from './gameState.js';

let timerInterval = null;
let timerSeconds = 180; // 3 minutes per turn

function updateTimerUI(timerEl) {
    const min = Math.floor(timerSeconds / 60);
    const sec = timerSeconds % 60;
    timerEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

function startTimer(timerEl, onExpire) {
    clearInterval(timerInterval);
    timerSeconds = 180;
    updateTimerUI(timerEl);
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerUI(timerEl);
        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            if (typeof onExpire === 'function') onExpire();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

export function renderBoardUI(boardContainer, highlightedCell) {
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
                // Highlight effect
                if (highlightedCell && highlightedCell.row === r && highlightedCell.col === c) {
                    cell.classList.add('ring-4', 'ring-blue-400', 'z-10');
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

// === TIMER INTEGRATION WITH MAIN ===
// The following should be called from main.js:
// - startTimer(timerEl, onExpire) at the start of each turn
// - stopTimer() when the turn ends or is submitted
export { startTimer, stopTimer, updateTimerUI };
