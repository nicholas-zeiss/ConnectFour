/**
The class representing the model for the connect four game. The board is a multidimensional array where 0 denotes an open space,
1 a player's chip, and 2 a computer's chip. The status describing the state of the game can be 'in play', 'You win!', 'The computer wins!', or 'It\'s a tie'.
The algorithm responsible for the computer's play uses alpha-beta pruning to make decisions and is contained in the gameTree.js.
**/

class ConnectFour {
	constructor() {
		this.rows = 6;
		this.columns = 7;
		this.board = new Array(this.rows).fill(1).map(el => new Array(this.columns).fill(0));
		this.turnCount = 0;
		this.status = 'in play';
	}

	//returns a boolean representing if it is possible to make a movement in a specific, legal (ie 0 < column < 6) column
	isMoveLegal(col) {
		return this.board[0][col] == 0;
	}

	//drops the chip specified by the player integer (1 for player, 2 for computer) into the column specified. Does not check whether that column is already full
	//or legal; if the column is full or the move is illegal it throws no errors and doesn't change the board
	makeMove(col, player) {
		for (let i = this.rows - 1; i >= 0; i--) {
			if (this.board[i][col] === 0) {
				this.board[i][col] = player;
				break;
			}
		}
		this.turnCount++;
	}


	//only used in building the minimax alpha beta tree for the computer's ai. When the game tree recurses on a move it makes that move, evaluates the
	//minimax alpha beta pruning algorithm on that game state, and then immediately uses undoMove() so it can pass down a ConnectFour game
	//to the next possible move that does not reflect the previous iteration's movements
	undoMove(col) {
		for (let row = 0; row < this.rows; row++) {
			if (this.board[row][col] != 0) {
				this.board[row][col] = 0;
				break;
			}
		}
		this.turnCount--;
	}

	//see updateStatus()
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

	// whenever we make a move and will not reverse that move (ie it is a player's movement, or we make the move the computer ai chose for us)
	// we must update the game's status (in play, someone won, or tie) using updateStatus(). However, when the computer ai traverses the game tree to determine
	// the best move it often wants to check the status of the game (to see if the game has ended) without changing the game's status property as no move has yet been made.
	// For this we use getStatus(), which returns the status of the game's board without changing the status of the game object.
	// When we want to change the actual status we use updateStatus().
	updateStatus() {
		this.status = this.getStatus();
	}


	//this returns the longest open streak for the specified player (1 = human, 2 = computer) at the specified entry.
	//the maximum length of the streak is 4, which indicates a win. If the streak value is 4 the open value is always true and the player supplied has won.
	//whether a streak is open indicates whether it is blocked (false) or unblocked (true) by the boundaries of the game board or opposing chips.
	//if no winning streak is found it returns the longest streak for the specified player at this chip which is open and thus can be filled to win the game.
	getMaxStreak(row, col, player) {
    let [streak, open] = [1, false];

    for (let r = -1; r < 2; r++) {
    	for (let c = -1; c < 2; c++) {
    		if (r == 0 && c == 0) continue;				//skips the case where no direction is pursued
  			let currStreak = 1;		
    		let isOpen = true;
    		for (let i = 1; i <= 3; i++) {
    			if (this.board[row + r*i] && this.board[row + r*i][col + c*i] === player) {
    				currStreak++;
    			} else if (this.board[row + r*i] && this.board[row + r*i][col + c*i] !== 0) {
    				isOpen = false;
    				break;
    			}
    			// streak = Math.max(streak, currStreak);
    		}
  			if (isOpen && currStreak > streak) {
  				[streak, open] = [currStreak, isOpen];
  			}
    	}
    }

    return [streak, open];
	}


	//calculates the score of the board for the computer's minimax alpha beta algorithm. Higher is
	//better for the computer.
	getScore() {
		let score = 0;
		
		for (let r = 0; r < this.rows; r++) {
			for (let c =0; c < this.columns; c++) {
				if (this.board[r][c] == 2) {
					let streak = this.getMaxStreak(r, c, 2);
					score += streak[1] ? [0, 10, 100, 1000, 500000][streak[0]] : 0;		//only adds to the computer's score if the streak for the computer is open
				} else if (this.board[r][c] == 1) {
					let streak = this.getMaxStreak(r, c, 1);
					score -= streak[1] ? [0, 10, 100, 1000, 500000][streak[0]] : 0;   //only adds against the computer's score if the streak against the computer is open
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

	//resets game state and statistics
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


