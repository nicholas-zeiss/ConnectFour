/**
 *
 * Render the game board using a canvas element, child of the Game component
 *
**/

import React from 'react';

const columns = 7;
const rows = 6;

class ConnectBoard extends React.Component {
	shouldComponentUpdate(nextProps) {
		if (this.props.width != nextProps.width || this.props.height != nextProps.height) {
			return true;
		}

		if (this.props.board.toString() != nextProps.board.toString()) {
			this.drawCanvas(nextProps.board);
		}

		return false;
	}


	componentDidUpdate() {
		this.drawCanvas();
	}


	drawCanvas(board = this.props.board) {
		// draw background
		this.container.fillStyle = '#2148bc';
		this.container.fillRect(0, 0, this.props.width, this.props.height);

		// calculate step between chips
		const DELTA_X = Math.floor(this.props.width / (columns + 1));
		const DELTA_Y = Math.floor(this.props.height / (rows + 1));
		
		// As DELTA_Y < DELTA_X, our chip radius depends on the former
		const RADIUS = DELTA_Y * .4; 														

		// draw each chip
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
				this.container.strokeStyle = 'black';
        
				// background color for an empty chip, yellow for player, red for computer
				this.container.fillStyle = [ '#d6e1ff', '#f9d000', 'red' ][board[r][c]];			
        
				this.container.beginPath();
				this.container.arc((c + 1) * DELTA_X, (r + 1) * DELTA_Y, RADIUS - 1, 0 , 2 * Math.PI, false);
				this.container.fill();
				this.container.stroke();
				this.container.closePath();
			}
		}
	}


	render() {
		return (
			<canvas
				height={ this.props.height }
				ref={ canvas => this.container = canvas ? canvas.getContext('2d') : null }
				width={ this.props.width }
			>
			</canvas>
		);
	}
}


export default ConnectBoard;

