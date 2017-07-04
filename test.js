
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
		// this.updateStatus();
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

	updateStatus() {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.columns; col++) {
				if (this.board[row][col] == 1 && this.getMaxStreak(row, col, 1) == 4) {
					this.status = 'You win!';
					return;
				} else if (this.board[row][col] == 2 && this.getMaxStreak(row, col, 2) == 4) {
					this.status = 'The computer wins';
					return;
				}
			}
		}

		if (Math.min(...this.board[0]) != 0) {
			this.status = "It's a tie";
		}
	}

	// player is either 1 or 2, human or computer respectively. Returns the length of the player's longest streak originating at this cell.
	// Only call on a cell if its value is the same as the supplied player variable as it assumes the board at [row][col] is the same as player
	getMaxStreak(row, col, player) {
    let streak = 1;

    //r and c values determine what increments in rows/columns increment as the streak is calculated.
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
					score += [0, 10, 100, 1000, 500000][this.getMaxStreak(r, c, 1)]
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


class Node {
	constructor(column, game) {
		this.column = column; //keeps track of the column the previous move was played in
		this.game = game;
		this.score = 0;
		this.children = [];
	}

	addChild(node) {
		this.children.push(node);
	}

	getScore() {
		this.score = this.game.getScore();
		return this.score;
	}
}


class GameTree {
	constructor(game) {
		this.game = game;
		this.root = new Node(null, game);
	}

	getComputerMove() {

	}

	//uses minimax with alpha-beta pruning to generate a game tree with corresponding scores
	genDecisionTree(node, depth, alpha, beta, playerIsComputer) {
		console.log('Start of alpha beta ', depth, alpha, beta, playerIsComputer);
		node.game.print();

		if (depth == 0 || Math.min(...node.game.board[0]) != 0) {
			console.log('at root / depth = 0, score: ', node.getScore())
			return node.getScore();
		} else {
			if (playerIsComputer) {
				let maxChild = 0 - Infinity;

				for (let i = 0; i < 7; i++) {
					if (this.game.isMoveLegal(i)) {
						let child = new Node(i, node.game);
						node.addChild(child);		
						
						this.game.makeMove(i, 2);
						console.log('making recursive call for max player with move at ', i)
						maxChild = Math.max(maxChild, this.genDecisionTree(child, depth - 1, alpha, beta, false));
						this.game.undoMove(i);
						console.log('printing game after undoing move');
						this.game.print();
						alpha = Math.max(alpha, maxChild);
						
						if (beta <= alpha) {
							console.log('breaking', alpha, beta);
							break;
						}					
					}
				}

				node.score = maxChild;
				return maxChild;
			} else {
				let minChild = Infinity;

				for (let i = 0; i < 7; i++) {
					if (this.game.isMoveLegal(i)) {
						let child = new Node(i, node.game);
						node.addChild(child);		
						
						this.game.makeMove(i, 1);
						console.log('making recursive call for min player with move at ', i)

						minChild = Math.min(minChild, this.genDecisionTree(child, depth - 1, alpha, beta, true));
						this.game.undoMove(i);
						
						beta = Math.min(beta, minChild);
						
						if (beta <= alpha) {
							break;
						}					
					}
				}

				node.score = minChild;
				return minChild;
			}
		}
	}
}


let game = new ConnectFour();
game.makeMove(0, 1);
game.makeMove(0, 2);
game.makeMove(0, 1);

let ai = new GameTree(game);
ai.genDecisionTree(ai.root, 2, 0 - Infinity, Infinity, true);
console.log(JSON.stringify(ai.root))