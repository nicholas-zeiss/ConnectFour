/**
The class representing the model for the connect four game. The board is a multidimensional array where 0 denotes an open space,
1 a player's chip, and 2 a computer's chip. The status describing the state of the game can be 'in play', 'player won', or 'computer won'.
The algorithm responsible for the computer's play uses alpha-beta pruning to make decisions.
**/

class ConnectFour {
	constructor() {
		this.rows = 6;
		this.columns = 7;
		this.board = new Array(this.rows).fill(1).map(el => new Array(this.columns).fill(0));
		this.turnCount = 0;
		this.status = 'in play';
	}


	isMoveLegal(col) {
		return this.board[0][col] == 0;
	}


	makeMove(col, player) {
		for (let i = this.rows - 1; i >= 0; i--) {
			if (this.board[i][col] == 0) {
				this.board[i][col] = player;
				break;
			}
		}
		this.turnCount++;
	}


	undoMove(col) {
		for (let row = 0; row < this.rows; row++) {
			if (this.board[row][col] != 0) {
				this.board[row][col] = 0;
				break;
			}
		}
		this.turnCount--;
	}


	getStatus() {
		if (Math.min(...this.board[0]) != 0) {
			return "It's a tie";
		}

		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.columns; col++) {
				if (this.board[row][col] == 1 && this.getMaxStreak(row, col, 1) == 4) {
					return 'You win!';
				} else if (this.board[row][col] == 2 && this.getMaxStreak(row, col, 2) == 4) {
					return 'The computer wins';
				}
			}
		}

		return 'in play';
	}

  //when the computer traverses the game tree to calculate a move it often wants to check the status of the game
  //without changing the games status property; for this we use getStatus(). When we want to change the actual status
  //we use updateStatus()
	updateStatus() {
		this.status = this.getStatus();
	}


	getMaxStreak(row, col, player) {
    let streak = 1;

    for (let r = -1; r < 2; r++) {
    	for (let c = -1; c < 2; c++) {
    		if (r == 0 && c == 0) continue;				//skips the case where no direction is pursued
  			let currStreak = 1;		
    		for (let i = 1; i <= 3; i++) {
    			if (this.board[row + r*i] && this.board[row + r*i][col + c*i] === player) {
    				currStreak++;
    			} else {
    				break;
    			}
    			streak = Math.max(streak, currStreak);
    		}
    	}
    }

    return streak;
	}

	//calculates the score of the board for the computer's algorithm. Higher is
	//better for the computer.
	getScore() {
		let score = 0;
		
		for (let r = 0; r < this.rows; r++) {
			for (let c =0; c < this.columns; c++) {
				if (this.board[r][c] == 2) {
					score += [0, 10, 100, 1000, 500000][this.getMaxStreak(r, c, 2)]
				} else if (this.board[r][c] == 1) {
					score -= [0, 10, 100, 1000, 500000][this.getMaxStreak(r, c, 1)]
				}
			}	
		}

		return score;
	}


	print() {
		this.board.forEach(row => console.log(row.join(' ')))
		console.log(this.status, '\n\n')
	}


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


