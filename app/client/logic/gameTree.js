/**
This file holds the logic for the game solving algorithm that generates moves for the computer. An auxiliary class of Node helps build the game tree
and is used by the actual GameTree class, which itself holds the logic and generates moves. The algorithm used is minimax with alpha beta pruning to a depth
of 5 moves.
**/
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
		this.root = new Node(null, game);		//root node of the game tree
	}


	getComputerMove() {
		//build up the game tree
		this.genDecisionTree(this.root, 5, -Infinity, Infinity, true);		
		console.log(this.root);
		//now find and return the move with the highest score
		let [max, column] = [-Infinity, 0];
		this.root.children.forEach((node, i) => {
			if (node.score > max) {
				[max, column] = [node.score, node.column];
			}
		});
		return column;
	}

	//uses minimax with alpha-beta pruning to generate a game tree with corresponding scores
	genDecisionTree(node, depth, alpha, beta, playerIsComputer) {
		
		if (depth == 0 || node.game.getStatus() != 'in play' || Math.min(...node.game.board[0]) != 0) {
			//base case
			return node.getScore();
		
		} else {
			//recursive case
			if (playerIsComputer) {
				//on a maximizing node
				let maxChild = -Infinity;

				for (let i = 0; i < 7; i++) {
					if (this.game.isMoveLegal(i)) {
						let child = new Node(i, node.game);
						node.addChild(child);		
						
						this.game.makeMove(i, 2);
						maxChild = Math.max(maxChild, this.genDecisionTree(child, depth - 1, alpha, beta, false));
						this.game.undoMove(i);

						alpha = Math.max(alpha, maxChild);						
						if (beta <= alpha) {
							break;
						}					
					}
				}
				node.score = maxChild;
				return maxChild;

			} else {
				//on a minimizing node
				let minChild = Infinity;

				for (let i = 0; i < 7; i++) {
					if (this.game.isMoveLegal(i)) {
						let child = new Node(i, node.game);
						node.addChild(child);		
						
						this.game.makeMove(i, 1);
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

export default GameTree;