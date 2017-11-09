/**
 *
 *	The class representing the model for the connect four game. The board is a 2d array where 0 denotes an open space,
 *	1 a player's chip and 2 an AI's chip. The status describing the state of the game can be 'in play', 'W', 'L', or 'T' (win for player/loss/tie).
 *	The algorithm responsible for the AI's play uses a min-max algorithm with alpha-beta pruning and is contained in the gameTree.js.
 *
**/

import GameTree from './gameTree';


class ConnectFour {
	constructor() {
		this.rows = 6;
		this.columns = 7;
		this.turnCount = 0;
		this.status = 'in play';
		this.board = new Array(this.rows)
			.fill(1)
			.map(() => new Array(this.columns).fill(0));
	}


	// Returns a boolean representing if a move can be made in the column.
	isMoveLegal(col) {
		return this.board[0][col] == 0;
	}


	// Drops the chip into the column specified.
	// Doesn't verify if move is legal nor does it throw an error if illegal.
	makeMove(col, player) {
		for (let i = this.rows - 1; i >= 0; i--) {
			if (this.board[i][col] == 0) {
				this.board[i][col] = player;
				break;
			}
		}

		this.turnCount++;
	}


	// Only used in gameTree, lets the AI make and unmake moves for testing. 
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
		this.makeMove(new GameTree(this).getComputerMove(), 2);
	}


	// This method evaluates, but does not update, the status of the current game. The AI makes and unmakes many moves each time it
	// chooses a move. It uses this to evaluate those moves without altering the status.
	getStatus() {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.columns; col++) {
				if (this.board[row][col] == 1 && this.winningStreak(row, col, 1)) {
					return 'W';

				} else if (this.board[row][col] == 2 && this.winningStreak(row, col, 2)) {
					return 'L';
				}
			}
		}

		if (Math.min(...this.board[0]) != 0) {
			return 'T';
		}
		
		return 'in play';
	}


	// When a permanent move is made (ie not a move made in gameTree by the AI) this function will call getStatus and update the status.
	updateStatus() {
		this.status = this.getStatus();
	}


	// This returns the longest open streak (up to and including 4) the specified player can make starting at [row][col] on
	// their next turn. An open streak is defined as a streak that could potentially become a streak of 4, ie that potential 
	// streak of 4 is not blocked by the edges of the board or an opposing chip. If the chip at [row][col] has no open
	// streaks it returns 1.
	// 
	// Note that the returned streak is counted starting at [row][col]; the returned length can be less than the length
	// of a streak the chip is in but does not start or end. For example, a chip in the middle of a winning streak of 4 
	// can sometimes return 1.
	//
	// This is used by the AI to evaluate how favorable the board is.
	getMaxStreak(row, col, player) {
		let streakLength = 1;
		const otherPlayer = player == 1 ? 2 : 1;

		// test all 8 possible directions
		for (let r = -1; r < 2; r++) {
			for (let c = -1; c < 2; c++) {	
				if (r == 0 && c == 0) {
					continue;
				}
				
				let currStreakLength = 1;
				let isOpen = true;
				let hitZero = false;

				for (let i = 1; i <= 3; i++) {
					const currCol = col + c * i;
					const currRow = row + r * i;

					const chip = this.board[currRow] ? this.board[currRow][currCol] : null;

					if (chip != null) {
						if (chip == player) {
							currStreakLength++;
						
						// undefined means we are out of bounds
						} else if (chip == otherPlayer || chip == undefined) {
							isOpen = false;
							break;

						} else if (chip == 0) {
							// increment streak if this is the first zero we hit and the player could place a chip here next move
							// ie, if this location is the bottom row or has a chip directly below it already
							if (!hitZero && (row + r * i == 5 || this.board[row + r * i + 1][col + c * i] != 0)) {
								currStreakLength++;
							}
							
							hitZero = true;			
						}
					} else {
						isOpen = false;
						break;
					}
				}

				if (isOpen && currStreakLength > streakLength) {
					streakLength = currStreakLength;
				}
			}
		}

		return streakLength;
	}


	// returns whether the specified player has a streak of 4 starting at [row][col]
	winningStreak(row, col, player) {
		
		// test all 8 possible directions
		for (let r = -1; r < 2; r++) {
			for (let c = -1; c < 2; c++) {
				if (r == 0 && c == 0) {
					continue;
				}
				
				let four = true;
				
				for (let i = 1; i <= 3; i++) {
					if (!this.board[row + r * i] || this.board[row + r * i][col + c * i] != player) {
						four = false;
					}
				}
				
				if (four) {
					return true;
				}
			}
		}
		
		return false;
	}
	

	// Calculates the score of the board for the AI's minimax alpha beta algorithm. Higher is better for the AI.
	getScore() {
		let score = 0;
		
		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.columns; c++) {		
				if (this.board[r][c] != 0) {	
					const streak = this.getMaxStreak(r, c, this.board[r][c]);
					
					if (this.board[r][c] == 2) {
						score += [0, 10, 100, 1000, 1000000][streak];
					} else {
						score -= [0, 10, 100, 1000, 1000000][streak];
					}
				}
			}	
		}

		return score;
	}


	// for debugging
	print() {
		this.board.forEach(row => console.log(row.join(' ')));
		console.log(this.status, '\n\n');
	}


	// resets game
	clear() {
		this.turnCount = 0;
		this.status = 'in play';
		
		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.columns; c++) {
				this.board[r][c] = 0;
			}	
		}
	}
}


export default ConnectFour;

