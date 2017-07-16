/**
This file holds the logic for the game solving algorithm that generates moves for the computer. It takes an instance of ConnectFour and, using
a min-max algorithm with alpha-beta pruning, returns the optimal move evaluated to a depth of 6 moves. An auxiliary class Node (a tree node 
not the js Node harharhar) is used to build the tree used by each instance of GameTree, which itself holds a ConnectFour instance on which the tree is built.
**/


//basic Tree structure implementation
class Node {
	constructor(column, game) {
		this.column = column; 				//column the previous move was played in
		this.game = game; 						//ConnectFour instance being evaluated
		this.score = 0;
		this.children = [];
	}

	addChild(node) {
		this.children.push(node);
	}

	getScore() {
		return this.score = this.game.getScore();
	}
}

//An instance of this class is built after every player move that does not end the game. getComputerMove() is called 
//on this instance to find the move the AI makes.
class GameTree {
	constructor(game) {
		this.game = game;
		this.root = new Node(null, game);
	}

	getComputerMove() {
		//build up the game tree w/ minimax and alpha beta pruning
		this.genDecisionTree(this.root, 6, -Infinity, Infinity, true);		

		//find and return the move with the highest score
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
		if (depth == 0 || node.game.getStatus() != 'in play') {
			return node.getScore();
		
		} else {
			//on a maximizing node
			if (playerIsComputer) {
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

				return node.score = maxChild;

			//on a minimizing node
			} else {
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

				return node.score = minChild;
			}
		}
	}
}

export default GameTree;