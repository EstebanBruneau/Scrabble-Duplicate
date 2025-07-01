import { isWordValid } from './dictionary.js';
import { gameState } from './gameState.js';

export async function validateAndScoreMove(word, positionStr) {
    const valid = await isWordValid(word);
    if (!valid) return { valid: false, score: 0, reason: "Mot non valide dans l'ODS9" };
    const parsedPos = parsePosition(positionStr);
    if (!parsedPos) return { valid: false, score: 0, reason: "Position invalide" };
    const { row, col, direction } = parsedPos;
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
    // TODO: Implement full scoring logic
    return { valid: true, score: 0, word, row, col, direction, lettersToPlace: [] };
}

export function placeWordOnGrid(word, row, col, direction) {
    // TODO: Implement word placement on grid
}
