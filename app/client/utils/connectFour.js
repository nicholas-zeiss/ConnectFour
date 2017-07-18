/**
The class representing the model for the connect four game. The board is a 2d array where 0 denotes an open space,
1 a player's chip, and 2 an AI's chip. The status describing the state of the game can be 'in play', 'W', 'L', or 'T' (win for player/loss/tie).
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


	//Only used in gameTree, lets the AI make and unmake moves for testing. 
	undoMove(col) {
		for (let row = 0; row < this.rows; row++) {
			if (this.board[row][col] != 0) {
				this.board[row][col] = 0;
				break;
			}
		}
		this.turnCount--;
	}

	makeComputerMove() {
		let col = new GameTree(this).getComputerMove();
		
		// to test what happens if the player wins or ties we need to overwrite the AI as I have never beaten it
		// let col;
		// for (let c = 0; c < this.columns; c++) {
		// 	if (this.isMoveLegal(c)) {
		// 		col = c;
		// 		break;
		// 	}
		// }

		this.makeMove(col, 2);
		return col;
	}


	//When a permanent move is made (ie not a move made in gameTree by the AI) this function will call getStatus and update the status
	updateStatus() {
		this.status = this.getStatus();
	}

	//This method evaluates, but does not update, the state of the current game. The AI makes an unmakes many moves each time it chooses a move and uses this
	//to avoid altering the status.
	getStatus() {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.columns; col++) {
				if (this.board[row][col] == 1 && this.getMaxStreak(row, col, 1)[0] == 4) {
					return 'W';
				} else if (this.board[row][col] == 2 && this.getMaxStreak(row, col, 2)[0] == 4) {
					return 'L';
				}
			}
		}

		if (Math.min(...this.board[0]) != 0) {
			return 'T';
		}
		
		return 'in play';
	}

	//This returns the longest streak for the specified player (1 = human, 2 = AI) starting at the specified entry as well as if the streak is open or closed.
	//Open (ie not blocked by opposing player or board boundary) streaks of any length are returned over closed streaks. A streak of 4 is considered open.
	getMaxStreak(row, col, player) {
    let streakLength = 1, open = false;

    for (let r = -1; r < 2; r++) {
    	for (let c = -1; c < 2; c++) {
    		if (r == 0 && c == 0) {
    			continue;
    		}
  			
  			let currStreakLength = 1, isOpen = true;

    		for (let i = 1; i <= 3; i++) {
    			if (this.board[row + r * i] && this.board[row + r * i][col + c * i] == player) {
    				currStreakLength++;

    			} else if (this.board[row + r * i] && this.board[row + r * i][col + c * i] != 0) {
    				isOpen = false;
    				break;
    			}
    		}

    		if (isOpen && currStreakLength > streakLength) {
					[streakLength, open] = [currStreakLength, isOpen];
				}
    	}
    }

    return [streakLength, open];
	}

	//Calculates the score of the board for the AI's minimax alpha beta algorithm. Higher is better for the AI.
	getScore() {
		let score = 0;
		
		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.columns; c++) {
				if (this.board[r][c] != 0) {
					if (this.board[r][c] == 2) {
						let streak = this.getMaxStreak(r, c, 2);
						score += streak[1] ? [0, 10, 100, 100000, 5000000][streak[0]] : 0;
					
					} else {
						let streak = this.getMaxStreak(r, c, 1);
						score -= streak[1] ? [0, 10, 100, 100000, 5000000][streak[0]] : 0;
					}
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