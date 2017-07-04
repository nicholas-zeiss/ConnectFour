/**
This component renders our game of life to the DOM using a canvas element and allows users to toggle cells by clicking on them
**/

import React from 'react';

const LifeView = React.createClass({
	getInitialState() {
		return {
			cells: this.props.cells,
			width: 30,
			height: 30,
			rows: this.props.cells.length,
			columns: this.props.cells[0].length,
			container: null
		};
	},

	componentDidMount() {
		this.setState({container: document.getElementById('canvas').getContext('2d')});
	},

	componentDidUpdate() {
		this.draw();
	},

	clickCell(e) {
		this.props.toggleCell(Math.floor(e.nativeEvent.offsetY / this.state.height), 	//row and column respectively
													Math.floor(e.nativeEvent.offsetX / this.state.width));
	},

	draw() {
		let ctx = this.state.container;

		ctx.clearRect(0, 0, this.state.width * this.state.columns, this.state.height * this.state.rows);			//clear board

		for (let j = 0; j < this.state.rows; j++) {
			for (let i = 0; i < this.state.columns; i++) {
				ctx.fillStyle = 'black';
				ctx.fillRect(i * this.state.width, j * this.state.height, this.state.width, this.state.height);

				ctx.fillStyle = this.state.cells[j][i] ? 'red' : 'white';																													//red if alive, white if dead
				ctx.fillRect(i * this.state.width + 1, j * this.state.height + 1, this.state.width - 2, this.state.height - 2);
			}
		}
	},

	render() {
		return (
			<canvas id='canvas' height={this.state.height * this.state.rows}
			width={this.state.width * this.state.columns}
			onClick={this.clickCell}></canvas>
		);
	}
});

export default LifeView;