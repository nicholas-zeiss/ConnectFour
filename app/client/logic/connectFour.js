/**
The class representing the model for the connect four game. The board is a 2d array where 0 denotes an open space,
1 a player's chip, and 2 an AI's chip. The status describing the state of the game can be 'in play', 'You win!', 'The computer wins!', or "It's a tie".
The algorithm responsible for the computer's play uses a min-max algorithm with alpha-beta pruning and is contained in the gameTree.js.
**/

import GameTree from './gameTree';


class ConnectFour {
	constructor() {
		this.rows = 6;
		this.columns = 7;
		this.board = new Array(this.rows).fill(1).map(el => new Array(this.columns).fill(0));
		this.turnCount = 0;
		this.status = 'in play';
	}

	//Returns a boolean representing if a move can be made in the column (columns are 0-indexed).
	isMoveLegal(col) {
		return this.board[0][col] == 0;
	}

	//Drops the chip for the player (1 for human, 2 for AI) into the column specified.
	//Doesn't verify move is legal nor does it throw an error if illegal.
	makeMove(col, player) {
		for (let i = this.rows - 1; i >= 0; i--) {
			if (this.board[i][col] == 0) {
				this.board[i][col] = player;
				break;
			}
		}
		this.turnCount++;
	}


	//Only used in by gameTree. To test the value of a specific move the AI will make the move with makeMove 
	//which alters the actual game board. When gameTree is done evaluating that move and subsequent moves
	//it restores the game board using this method.
	undoMove(col) {
		for (let row = 0; row < this.rows; row++) {
			if (this.board[row][col] != 0) {
				this.board[row][col] = 0;
				break;
			}
		}
		this.turnCount--;
	}

	//To find the AI's move we create an instance of GameTree using the current board and call on it to return its move.
	makeComputerMove() {
		this.makeMove(new GameTree(this).getComputerMove(), 2);
	}


	//When a permanent move is made (ie not a move made in gameTree by the AI) this function will call getStatus and update
	//this instance's status.
	updateStatus() {
		this.status = this.getStatus();
	}

	//This method evaluates, but does not update, the state of the current game. It is used by updateStatus to update the state of the game
	//when a permanent move has been made by the player or AI. However, the AI in gameTree needs to check the status of potentially 117,649 
	//different game boards, and uses this method to do so without changing this instance of connectFour.
	getStatus() {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.columns; col++) {
				if (this.board[row][col] == 1 && this.getMaxStreak(row, col, 1)[0] == 4) {
					return 'You win!';
				} else if (this.board[row][col] == 2 && this.getMaxStreak(row, col, 2)[0] == 4) {
					return 'The computer wins!';
				}
			}
		}

		if (Math.min(...this.board[0]) != 0) {
			return "It's a tie";
		}
		
		return 'in play';
	}

	//This returns the longest streak for the specified player (1 = human, 2 = AI) starting at the specified entry.
	//Open (ie not blocked by opposing player) streaks of any length are returned over closed streaks. A streak of 4 is considered open.
	//Returns [int streakLength, bool open, str streakStr] where streakStr is the row and colum of each chip joined by a space, eg '00 11 22'
	getMaxStreak(row, col, player) {
    let streakLength = 1, open = false, streakStr = '';

    for (let r = -1; r < 2; r++) {
    	for (let c = -1; c < 2; c++) {
    		if (r == 0 && c == 0) {
    			continue;
    		}
  			
  			let currStreakLength = 1, currStreak = [], isOpen = true;

    		for (let i = 1; i <= 3; i++) {
    			if (this.board[row + r * i] && this.board[row + r * i][col + c * i] == player) {
    				currStreakLength++;
    				currStreak.push(String(row + r * i) + String(col + c * i));
    			
    			} else if (this.board[row + r * i] && this.board[row + r * i][col + c * i] != 0) {
    				isOpen = false;
    				break;		
    			}
    		}

  			if (isOpen && currStreakLength > streakLength) {
  				[streakLength, open, streakStr] = [currStreakLength, isOpen, currStreak.join(' ')];
  			}
    	}
    }

    return [streakLength, open, streakStr];
	}


	//calculates the score of the board for the AI's minimax alpha beta algorithm. Higher is
	//better for the AI. We use the alreadyCounted set to avoid double counting streaks.
	getScore() {
		let score = 0, alreadyCounted = new Set();
		
		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.columns; c++) {
				if (this.board[r][c] != 0 && !alreadyCounted.has(String(r) + String(c))) {
					let streak;

					if (this.board[r][c] == 2) {
						streak = this.getMaxStreak(r, c, 2);
						score += streak[1] ? [0, 10, 100, 1000, 500000][streak[0]] : 0;
					
					} else if (this.board[r][c] == 1) {
						streak = this.getMaxStreak(r, c, 1);
						score -= streak[1] ? [0, 10, 100, 1000, 500000][streak[0]] : 0;
					}

					streak[2].split(' ').forEach(rc => alreadyCounted.add(rc));
				}
			}	
		}

		return score;
	}

	//for debugging
	print() {
		this.board.forEach(row => console.log(row.join(' ')))
		console.log(this.status, '\n\n')
	}

	//resets game
	clear() {
		this.turnCount = 0;
		this.status = 'in play';
		for (let r = 0; r < this.rows; r++) {
			for (let c =0; c < this.columns; c++) {
				this.board[r][c] = 0;
			}	
		}
	}
}

export default ConnectFour;