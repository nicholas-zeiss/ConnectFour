
class Life {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.board = new Array(height).fill(1).map(el => new Array(width).fill(0));
	}

	flipCellState(row, col) {
		this.board[row][col] = this.board[row][col] ? 0 : 1;
	}

	getNewBoard() {
		let updatedBoard = new Array(this.height).fill(1).map(el => new Array(this.width).fill(0));

		for (let r = 0; r < this.height; r++) {
			for (let c = 0; c < this.width; c++) {
				let count = this.countLiveNeighbors(r, c);
				
				if (count < 2) updatedBoard[r][c] = 0;
				else if (count == 2) updatedBoard[r][c] = this.board[r][c];
				else if (count == 3) updatedBoard[r][c] = 1;
				else updatedBoard[r][c] = 0;
			}
		}

		this.board = updatedBoard;
	}

	countLiveNeighbors(row, col) {
		let count = 0;

		for (let r = -1; r < 2; r++) {
			for (let c = - 1; c < 2; c++) {
				if (r == 0 && c == 0) continue;
				if (this.board[row + r] !== undefined && this.board[row + r][col + c] === 1) count++;
			}
		}

		return count;
	}

	print() {
		this.board.forEach(row => console.log(row, '\n'));
	}
}

export default Life;