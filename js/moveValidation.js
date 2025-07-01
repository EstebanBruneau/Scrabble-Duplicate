import { isWordValid } from './dictionary.js';
import { gameState } from './gameState.js';
import { LETTRES, BONUS_TYPES } from './constants.js';

function canFormWordFromRack(word, rack) {
    const rackCopy = [...rack];
    for (const letter of word.toUpperCase()) {
        const idx = rackCopy.indexOf(letter);
        if (idx !== -1) {
            rackCopy.splice(idx, 1);
        } else {
            // Try to use a blank tile '*'
            const blankIdx = rackCopy.indexOf('*');
            if (blankIdx !== -1) {
                rackCopy.splice(blankIdx, 1);
            } else {
                return false;
            }
        }
    }
    return true;
}

function wordTouchesExisting(word, row, col, direction, grid) {
    // Returns true if any letter of the word is adjacent to an existing letter (not part of this word)
    const len = word.length;
    for (let i = 0; i < len; i++) {
        let r = row + (direction === 'V' ? i : 0);
        let c = col + (direction === 'H' ? i : 0);
        // If the cell already has a letter, skip (it's an overlap, not an adjacency)
        if (grid[r][c].letter) continue;
        // Check 4 orthogonal neighbors
        const neighbors = [
            [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
        ];
        for (const [nr, nc] of neighbors) {
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
                if (grid[nr][nc].letter) return true;
            }
        }
    }
    return false;
}

export async function validateAndScoreMove(word, positionStr) {
    const valid = await isWordValid(word);
    if (!valid) return { valid: false, score: 0, reason: "Mot non valide dans l'ODS9" };
    if (!canFormWordFromRack(word, gameState.rack)) {
        return { valid: false, score: 0, reason: "Le mot utilise des lettres non présentes dans le tirage." };
    }
    const parsedPos = parsePosition(positionStr);
    if (!parsedPos) return { valid: false, score: 0, reason: "Position invalide" };
    const { row, col, direction } = parsedPos;
    // Check placement rules
    if (gameState.isFirstMove) {
        // Must cover center (7,7)
        let coversCenter = false;
        for (let i = 0; i < word.length; i++) {
            let r = row + (direction === 'V' ? i : 0);
            let c = col + (direction === 'H' ? i : 0);
            if (r === 7 && c === 7) coversCenter = true;
        }
        if (!coversCenter) {
            return { valid: false, score: 0, reason: "Le mot doit passer par la case centrale (H8) au premier tour." };
        }
    } else {
        // Must touch an existing word
        if (!wordTouchesExisting(word, row, col, direction, gameState.grid)) {
            return { valid: false, score: 0, reason: "Le mot doit être adjacent à un mot déjà placé." };
        }
    }
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
    word = word.toUpperCase();
    let total = 0;
    let wordMultiplier = 1;
    let usedTiles = [];
    let lettersToPlace = [];
    let rackCopy = [...rack];
    let placedCount = 0;
    for (let i = 0; i < word.length; i++) {
        let r = row + (direction === 'V' ? i : 0);
        let c = col + (direction === 'H' ? i : 0);
        const tile = grid[r][c];
        const letter = word[i];
        let letterScore = 0;
        let isBlank = false;
        // Determine if this letter is newly placed (not already on the board)
        if (!tile.letter) {
            // Use from rack (prefer real letter, fallback to blank)
            let rackIdx = rackCopy.indexOf(letter);
            if (rackIdx === -1) {
                rackIdx = rackCopy.indexOf('*');
                isBlank = true;
            }
            if (rackIdx !== -1) {
                rackCopy.splice(rackIdx, 1);
                placedCount++;
                lettersToPlace.push({ r, c, letter, isBlank });
            }
            // Letter value
            letterScore = isBlank ? 0 : (LETTRES[letter] ? LETTRES[letter].valeur : 0);
            // Apply letter bonus
            if (tile.bonus === BONUS_TYPES.LETTER_DOUBLE) {
                letterScore *= 2;
            } else if (tile.bonus === BONUS_TYPES.LETTER_TRIPLE) {
                letterScore *= 3;
            }
            // Apply word bonus
            if (tile.bonus === BONUS_TYPES.WORD_DOUBLE) {
                wordMultiplier *= 2;
            } else if (tile.bonus === BONUS_TYPES.WORD_TRIPLE) {
                wordMultiplier *= 3;
            }
        } else {
            // Already on board, just add value
            letterScore = (LETTRES[letter] ? LETTRES[letter].valeur : 0);
        }
        total += letterScore;
    }
    total *= wordMultiplier;
    // Bingo (all 7 tiles used)
    if (placedCount === 7) {
        total += 50;
    }
    return { valid: true, score: total, word, row, col, direction, lettersToPlace };
}

export function placeWordOnGrid(word, row, col, direction) {
    // Place the word on the grid, locking the tiles and updating the grid state
    word = word.toUpperCase();
    let r = row, c = col;
    for (let i = 0; i < word.length; i++) {
        if (r < 0 || r >= gameState.grid.length || c < 0 || c >= gameState.grid[0].length) break;
        const tile = gameState.grid[r][c];
        if (!tile.letter) {
            tile.letter = word[i];
            tile.locked = true;
        }
        if (direction === 'H') {
            c++;
        } else {
            r++;
        }
    }
}
