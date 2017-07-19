/**
This file holds the logic for the game solving algorithm that generates moves for the computer. It takes an instance of ConnectFour and, using
a min-max algorithm with alpha-beta pruning, returns the optimal move evaluated to a depth of 6 moves. An auxiliary class Node is used to build 
the tree of possible moves and counter-moves. Each instance of Node holds a copy of the original ConnectFour instance.


Explanation of 'win-avoidance' behavior:

(While a minor quirk to expand upon with this level of detail, it is interesting and illuminating in that it helps explain the workings 
of the minimax algorithm in general)

As mentioned at the top of connectFour.js, when the AI can make a winning move it does not always do so immediately. While this behavior seems
risky it never actually prevents the AI from winning. This behavior is due to how this algorithm relies solely on the scores of the game states
it considers and how we score the Connect Four game states. In short, the algorithm's only way to choose possible moves is by scoring the resultant 
game states and making the move that guarantees it the highest possible score.

As such, the root cause of this behavior is how the game is scored. The score increase due to the presence of a winning move dwarfs all other factors,
so a board where the AI makes a winning move has a significantly lower score than a board where it instead sets up additional winning moves. 
This is true so long as it can still guarantee the player cannot win as a winning move for the player decreases the score astronomically. 

Thus the resultant behavior always follows a simple pattern. Instead of taking a winning move it will instead create more winning moves, so long
as you can't block all of them and you don't have a winning move of your own. In the end, while you can block one of these moves, the AI will 
still win.

If one really wished to prevent this sort of behavior they would need to vastly expand the procedure that scores game states. Currently the score
depends only on what chips are in the board and where, not the order in which they got there. Getting rid of this behavior would require one to
track the history of the game board with the board itself so that both could be supplied to the procedure scoring the game board. One would then need to
alter the scoring procedure to heavily prioritize winning states with the least amount of moves made over winning states with additional moves. 
This amount of effort is not merited by Connect Four, especially when no one has yet beat it as it is now.
**/


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
		}

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

export default GameTree;

