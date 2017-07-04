/**
As I decided to include two completely unrelated projects, connect four and the game of life, on one webapp
I use this as the overall parent to the two, allowing you to choose which you'd like to use
**/

import Game from './Connect Four/Game';			//connect 4
import GameOfLife from './Game of Life/GameOfLife';		//game of life
import React from 'react';

const Choose = React.createClass({
	getInitialState() {
		return {choice:1};
	},

	chooseConnect() {
		this.setState({choice:1});
	},

	chooseLife() {
		this.setState({choice:2});
	},

	render() {
		return (
			<div>
				<div id='selector'>
					<button type='button' onClick={this.chooseConnect}>Connect Four</button>
					<button type='button' onClick={this.chooseLife}>Conway's Game of Life</button>
				</div>
				<div>
					<h1 id='header'>{this.state.choice == 1 ? 'Connect Four' : 'Conway\'s Game of Life'}</h1>
					{this.state.choice == 1 ? <Game/> : <GameOfLife/>}
				</div>
			</div>
		);
	}
});

export default Choose;