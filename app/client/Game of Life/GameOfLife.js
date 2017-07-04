/**
This is the main container for conway's game of life which is rendered by my Choose component
**/

import Life from '../logic/life';							//holds the actual logic for the game of life
import LifeView from './LifeView';						//renders the game to a canvas and allows you to toggle cells on that canvas
import LifeControl from './LifeControl';			//gives the user basic controls over the board
import React from 'react';

const GameOfLife = React.createClass({
	getInitialState() {
		return {
			width : 40,
			height : 20,
			life : new Life(40,20),
			animating : false,
			intervalID : null							//animation is done through use of a setInterval call, this stores the id of that call so we may clear it to stop animating
		};
	},

	toggleAnimation() {
    if (this.state.animating) {
      clearInterval(this.state.intervalID);
      this.setState({animating : false, intervalID : null});	
    } else {
    	let id = setInterval(() => {
    		this.state.life.updateBoard();
    		this.setState({});								//we must call setState everytime our instance of the game of life updates to force react to update
    	}, 150);
    	
    	this.setState({animating : true, intervalID : id});
    }
	},

	//when one clicks on the canvas showing the cells, this is used as a callback to toggle that cell
	toggleCell(r, c) {
		if (!this.state.animating) {						//can't toggle while animation is in progress
			this.state.life.flipCellState(r, c);
			this.setState({});										//force react to update
		}
	},

	clear() {
		this.state.life.clear();								//clears all cells and stops any animation in progress

		if (this.state.animating) {
			clearInterval(this.state.intervalID);
		}

		this.setState({animating : false, intervalID : null});
	},

	render() {
		return (
			<div id='view-controls-container'>
				<LifeView cells={this.state.life.board} toggleCell={this.toggleCell}/>
				<LifeControl toggleAnimation={this.toggleAnimation} clear={this.clear} animated={this.state.animating}/>
			</div>
		);	
	}
});

export default GameOfLife;