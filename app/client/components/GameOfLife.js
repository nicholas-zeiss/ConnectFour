

import Life from '../logic/life';
import LifeView from './LifeView';
import LifeControl from './LifeControl';
import React from 'react';

const GameOfLife = React.createClass({
	getInitialState() {
		return {
			width : 20,
			height : 20,
			life : new Life(20,20),
			animating : false,
			intervalID : null
		};
	},

	componentDidUpdate() {
		console.log('gameoflife has updated');
	},

	toggleAnimation() {
    if (this.state.animating) {
      clearInterval(this.state.intervalID);
      this.setState({animating : false, intervalID : null});	
    } else {
    	let id = setInterval(() => {
    		this.state.life.updateBoard();
    		this.setState({});
    	}, 500);
    	
    	this.setState({animating : true, intervalID : id});
    }
	},

	toggleCell(r, c) {
		if (!this.state.animating) {
			this.state.life.flipCellState(r, c);
			this.setState({});
		}
	},

	clear() {
		this.state.life.clear();
		if (this.state.animating) {
			clearInterval(this.state.intervalID);
		}
		this.setState({animating : false, intervalID : null});
	},

	render() {
		return (
			<div id='view-controls-container'>
				<LifeView cells={this.state.life.board} toggleCell={this.toggleCell}/>
				<LifeControl toggleAnimation={this.toggleAnimation} clear={this.clear}/>
			</div>
		);	
	}
});

export default GameOfLife;