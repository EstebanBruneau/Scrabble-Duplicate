# Scrabble® Duplicate French

Welcome to this little Scrabble Duplicate project. This is a web version playable solo.(for now)


**How it works**

* At each turn, a draw of 7 letters is revealed.
* Each player has 3 minutes to find the best possible word.
* Enter your word and its position (e.g., WORDS at H8 or 8H).
* Once everyone has played, game reveals the "top" (the move that scores the most points), places it on the board, and updates the scores.
* Click "Next Turn" ("Tour Suivant") and you're off again!

The game ends when there are no more letters in the bag and no more moves are possible.

**Extraction des mots**

Les listes de mots utilisées dans ce projet sont extraites du site [listesdemots.net](https://www.listesdemots.net/), qui propose des listes exhaustives de l'ODS 9. Un script Python extrait les mots automatiquement parce que j'avais la flemme de tout copier coller. Merci à l'équipe de [listesdemots.net](https://www.listesdemots.net/) pour leur travail et la mise à disposition de ces ressources.




**Need to add :** 

#### Full scoring logic in calculateScore

Handle Scrabble scoring rules, bonuses, word/letter multipliers, crosswords, and Scrabble bonuses (e.g., 50 points for using all 7 tiles).

#### Word placement logic in placeWordOnGrid

Actually place the word on the grid, lock tiles, and update the grid state.

#### Rack update after word placement

Remove only the used tiles from the player's rack after a valid move.

#### Handle end of turn for all players

Implement handleEndOfTurnInputs to show the turn summary, compute the best move (top), and manage the transition to the next turn.

#### Game end detection and final scoring

Detect when the bag and racks are empty, show the final scores, and display the end-of-game modal.

#### Timer logic and display

Implement the per-turn timer and update the timer display in the UI.

#### Advanced validation

Ensure word placement is legal (touches existing words, fits on the board, etc.).

#### UI polish

Improve board and rack rendering, highlight bonuses, and add visual feedback.


## More ideas 
Allow drag-and-drop of letters onto the board.
Add sound effects for word placement.
A  multiplayer mode
