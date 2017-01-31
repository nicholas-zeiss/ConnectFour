/**
This file holds the logic for the game solving algorithm that generates moves for the computer. An auxiliary class of Node helps build the game tree
and is used by the actual GameTree class, which itself holds a ConnectFour game and generates moves. The algorithm used is minimax with alpha beta pruning to a depth
of 6 moves.
**/


//basic Tree structure implementation
class Node {
	constructor(column, game) {
		this.column = column; //keeps track of the column the previous move was played in
		this.game = game; //keeps track of the ConnectFour game this node evaluates
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

//this class is built after every player move that does not end the game. It implements the Node class above for its tree.
//It is supplied the current ConnectFour game, and then when getComputerMove() is called it builds a gameTree and finds
//the optimal move for the computer using a minimax algorithm with alpha beta pruning.
class GameTree {
	constructor(game) {
		this.game = game;
		this.root = new Node(null, game);		//root node of the game tree
	}


	getComputerMove() {
		//build up the game tree w/ minimax and alpha beta pruningß
		this.genDecisionTree(this.root, 6, -Infinity, Infinity, true);		

		//now find and return the move with the highest score
		console.log('in game tree, assigning default col 0');
		let [max, column] = [-Infinity, 0];
		this.root.children.forEach((node, i) => {
			if (node.score > max) {
				[max, column] = [node.score, node.column];
				console.log('udating column to ', i);
			}
		});
		return column;
	}

	//uses minimax with alpha-beta pruning to generate a game tree with corresponding scores
	genDecisionTree(node, depth, alpha, beta, playerIsComputer) {
		if (depth == 0 || node.game.getStatus() != 'in play' || Math.min(...node.game.board[0]) != 0) {  //base case
			return node.getScore();
		} else {														//recursive case
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