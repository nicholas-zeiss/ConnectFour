/**
This class implements Conway's game of life
**/

class Life {
	//initializes a board of specified width and height with all 0s
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.board = new Array(height).fill(1).map(el => new Array(width).fill(0));
	}

	flipCellState(row, col) {
		this.board[row][col] = this.board[row][col] ? 0 : 1;
	}

	updateBoard() {
		console.log('updating cells');
		let oldBoard = this.board.map(row => row.slice());		//creates a shallow copy as to not fuck with react

		for (let r = 0; r < this.height; r++) {
			for (let c = 0; c < this.width; c++) {
				let count = this.countLiveNeighbors(r, c, oldBoard);
				
				if (count < 2) this.board[r][c] = 0;
				else if (count == 2) this.board[r][c] = this.board[r][c];
				else if (count == 3) this.board[r][c] = 1;
				else this.board[r][c] = 0;
			}
		}
	}

	countLiveNeighbors(row, col, board) {
		let count = 0;

		for (let r = -1; r < 2; r++) {
			for (let c = - 1; c < 2; c++) {
				if (r == 0 && c == 0) continue;
				if (board[row + r] !== undefined && board[row + r][col + c] == 1) count++;
			}
		}

		return count;
	}

	print() {
		this.board.forEach(row => console.log(row, '\n'));
	}

	clear() {
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				this.board[i][j] = 0;
			}
		}
	}
}

export default Life;