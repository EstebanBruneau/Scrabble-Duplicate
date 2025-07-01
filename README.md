# Scrabble® Duplicate French

Welcome to this little Scrabble Duplicate project. This is a web version playable solo.

---

**How it works**

* At each turn, a draw of 7 letters is revealed.
* Each player has 3 minutes to find the best possible word.
* Enter your word and its position (e.g., WORDS at H8 or 8H).
* Once everyone has played, game reveals the "top" (the move that scores the most points), places it on the board, and updates the scores.
* Click "Next Turn" ("Tour Suivant") and you're off again!

The game ends when there are no more letters in the bag and no more moves are possible.

---

## ✨ Features

* **Classic Scrabble Board (15x15)** with all bonus squares (Double Word Score, Triple Letter Score, etc.).
* **"AI" Referee:** At each turn, an AI calculates the "top" (the optimal move) and places it on the board. Your goal is to do better or at least get close!
* **Word Validation:** The game uses the ods 9 to verify that proposed words are valid. (see https://www.monunivers.com/scrabble/ods.htm)
* **Automatic Point Calculation:** 


---

# Extraction des mots

Les listes de mots utilisées dans ce projet sont extraites du site [listesdemots.net](https://www.listesdemots.net/), qui propose des listes exhaustives de l'ODS 9. Un script Python extrait les mots automatiquement parce que j'avais la flemme de tout copier coller. Merci à l'équipe de [listesdemots.net](https://www.listesdemots.net/) pour leur travail et la mise à disposition de ces ressources.

---

## Ideas for the future

* [ ] Allow drag-and-drop of letters onto the board.
* [ ] Add sound effects for word placement.
* [ ] A  multiplayer mode
