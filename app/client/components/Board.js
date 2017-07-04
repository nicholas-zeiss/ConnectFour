/**
This component renders the game board using a canvas element
**/

import React from 'react';

const Board = React.createClass({
	getInitialState() {
		return {
			board : this.props.board,			//board to render
			columns: this.props.board[0].length,
			rows: this.props.board.length,
			container : null,					//upon initial render this will be updated to the canvas element's context
			width: 600,					//TODO: make width and height variable on container's dimensions
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
		this.state.container.clearRect(0, 0, this.state.width, this.state.height)			//clear board

		this.state.container.fillStyle = '#0061ff';
		this.state.container.fillRect(0, 0, this.state.width, this.state.height);			//draw background


		const DELTA_X = Math.floor(this.state.width / (this.state.columns + 1));				//calculate step between possible chips and the chip radius
		const DELTA_Y = Math.floor(this.state.height / (this.state.rows + 1));
		const RADIUS = 22;

		//draw each chip
		for (let r = 0; r < this.state.rows; r++) {
			for (let c = 0; c < this.state.columns; c++) {
        //draw outline
        this.state.container.fillStyle = 'black';
        this.state.container.beginPath();
        this.state.container.arc((c + 1) * DELTA_X, (r + 1) * DELTA_Y, RADIUS, 0 , 2 * Math.PI, false);
        this.state.container.fill();
        this.state.container.stroke();
        this.state.container.closePath();

        //draw chip
			  this.state.container.fillStyle = ['#baceff', '#f9d000', 'red'][this.state.board[r][c]];		//choose color of each chip, if board is empty here transparent, 1 player, 2 computer			
        this.state.container.beginPath();
        this.state.container.arc((c + 1) * DELTA_X, (r + 1) * DELTA_Y, RADIUS - 2, 0 , 2 * Math.PI, false);
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