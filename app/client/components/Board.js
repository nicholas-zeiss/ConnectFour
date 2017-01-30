/**
This component renders the game board using a canvas element
**/

import React from 'react';

const Board = React.createClass({
	getInitialState() {
		return {
			board : this.props.board,
			columns: this.props.board[0].length,
			rows: this.props.board.length,
			container : null,
			width: 600,
			height: 430
		}
	},


	componentDidMount() {
		this.setState({container: document.getElementById('canvas').getContext('2d')}, this.drawCanvas);
	},


	componentDidUpdate() {
		this.drawCanvas();
	},


	drawCanvas() {
		this.state.container.clearRect(0, 0, this.state.width, this.state.height)

		this.state.container.fillStyle = '#0061ff';
		this.state.container.fillRect(0, 0, this.state.width, this.state.height);


		const deltax = Math.floor(this.state.width / (this.state.columns + 1));
		const deltay = Math.floor(this.state.height / (this.state.rows + 1));
		const radius = 22;

		for (let r = 0; r < this.state.rows; r++) {
			for (let c = 0; c < this.state.columns; c++) {
        this.state.container.fillStyle = 'black';
        this.state.container.beginPath();
        this.state.container.arc((c + 1) * deltax, (r + 1) * deltay, radius, 0 , 2 * Math.PI, false);
        this.state.container.fill();
        this.state.container.stroke();
        this.state.container.closePath();

			  this.state.container.fillStyle = ['#baceff', '#f9d000', 'red'][this.state.board[r][c]];
        this.state.container.beginPath();
        this.state.container.arc((c + 1) * deltax, (r + 1) * deltay, radius - 2, 0 , 2 * Math.PI, false);
        this.state.container.fill();
        this.state.container.stroke();
        this.state.container.closePath();
			}
		}
	},


	render() {
		return <canvas id='canvas' height={this.state.height} width={this.state.width}></canvas>
	}
})

export default Board;