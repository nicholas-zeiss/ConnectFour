
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
		console.log('lifeview has mounted');
		this.setState({container: document.getElementById('canvas').getContext('2d')});
	},

	componentDidUpdate() {
		console.log('lifeview has updated');
		this.draw();
	},

	click(e) {
		this.props.toggleCell(Math.floor(e.nativeEvent.offsetY / this.state.height), Math.floor(e.nativeEvent.offsetX / this.state.width));
	},

	draw() {
		let ctx = this.state.container;
		// let ctx = document.getElementById('canvas').getContext('2d');

		ctx.clearRect(0, 0, this.state.width * this.state.columns, this.state.height * this.state.rows);
		console.log('drawing, first row is', this.state.cells[0]);

		for (let j = 0; j < this.state.rows; j++) {
			for (let i = 0; i < this.state.columns; i++) {
				ctx.fillStyle = 'black';
				ctx.fillRect(i * this.state.width, j * this.state.height, this.state.width, this.state.height);

				ctx.fillStyle = this.state.cells[j][i] ? 'red' : 'white';
				ctx.fillRect(i * this.state.width + 1, j * this.state.height + 1, this.state.width - 2, this.state.height - 2);
			}
		}
	},

	render() {
		return (
			<canvas id='canvas' height={this.state.height * this.state.rows}
			width={this.state.width * this.state.columns}
			onClick={this.click}></canvas>
		);
	}
});

export default LifeView;