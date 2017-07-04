import Game from './Game';
import GameOfLife from './GameOfLife';
import React from 'react';

const Choose = React.createClass({
	getInitialState() {
		return {choice:0};
	},

	chooseConnect() {
		this.setState({choice:1});
	},

	chooseLife() {
		this.setState({choice:2});
	},

	render() {
		if (!this.state.choice) {
			return (
				<div>
					<button type='button' onClick={this.chooseConnect}>connect</button>
					<button type='button' onClick={this.chooseLife}>life</button>
				</div>
			)
		} else if (this.state.choice == 1) {
			return (
				<div>
					<h1 id='header'>Connect Four</h1>
					<Game/>
				</div>
			)
		} else {
			return (
				<div>
					<h1 id='header'>Conway's Game of Life</h1>
					<GameOfLife/>
				</div>
			)
		}
	}
});

export default Choose;