/**
This component renders our game of life to the DOM using a canvas element and allows users to toggle cells by clicking on them
**/

import React from 'react';

const LifeView = React.createClass({
	getInitialState() {
		return {
			width: 30,
			height: 30,
			container: null
		};
	},

	componentDidMount() {
		this.setState({container: document.getElementById('life-canvas').getContext('2d')});
	},

	componentDidUpdate() {
		this.draw();
	},

	// draw() {
	// 	let ctx = this.state.container;

	// 	ctx.fillStyle = '#3a3a3a';
	// 	ctx.fillRect(0, 0, this.state.width * this.props.cells[0].length, this.state.height * this.props.cells.length);			//set background color

	// 	for (let j = 0; j < this.props.cells.length; j++) {
	// 		for (let i = 0; i < this.props.cells[0].length; i++) {
	// 			ctx.fillStyle = this.props.cells[j][i] ? 'rgb(67,211,0)' : 'black';																			//green if alive, black if dead
	// 			ctx.fillRect(i * this.state.width + 1, j * this.state.height + 1, this.state.width - 2, this.state.height - 2);
	// 		}
	// 	}
	// },

	draw() {
		let ctx = this.state.container;

		ctx.fillStyle = '#3a3a3a';
		ctx.fillRect(0, 0, this.state.width * this.props.cells[0].length, this.state.height * this.props.cells.length);			//set background color

		for (let j = 0; j < this.props.cells.length; j++) {
			for (let i = 0; i < this.props.cells[0].length; i++) {
				ctx.fillStyle = this.props.cells[j][i] ? 'rgb(67,211,0)' : 'black';																			//green if alive, black if dead
				ctx.fillRect(i * this.state.width + 1, j * this.state.height + 1, this.state.width - 2, this.state.height - 2);

				//adds a simple lighting effect
				let x = (i + .5) * this.state.width - 40, y = (j + .5) * this.state.height - 40;
				let gradient = ctx.createRadialGradient(80, 80, 80, 80, 80, 0);
				gradient.addColorStop(0, 'rgba(67,211,0,0)');
				gradient.addColorStop(1, 'rgba(67,211,0,.5)');
				ctx.fillStyle = gradient;
				ctx.fillRect(x, y, 80, 80);
			}
		}

		//adds a crude lighting
		for (let j = 0; j < this.props.cells.length; j++) {
			for (let i = 0; i < this.props.cells[0].length; i++) {
				if (this.props.cells[j][i]) {
					let x = (i + .5) * this.state.width, y = (j + .5) * this.state.height;
					let gradient = ctx.createRadialGradient(x, y, 75, x, y, 15);

				}
			}
		}
	},

	clickCell(e) {
		this.props.toggleCell(Math.floor(e.nativeEvent.offsetY / this.state.height), 	//row and column respectively
													Math.floor(e.nativeEvent.offsetX / this.state.width));
	},

	render() {
		return (
			<canvas id='life-canvas' height={this.state.height * this.props.cells.length}
			width={this.state.width * this.props.cells[0].length}
			onClick={this.clickCell}></canvas>
		);
	}
});

export default LifeView;