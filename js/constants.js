// Scrabble Constants
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
