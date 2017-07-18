/**
Render the game board using a canvas element, subcomponent of the Game component
**/

import React from 'react';


class ConnectBoard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			columns: 7,
			rows: 6,
			container : null,					//upon initial render this will be updated to the canvas element's context
		};
	}


	componentDidMount() {
		this.setState({
			container: document.getElementById('canvas').getContext('2d')
		});
	}


	componentDidUpdate() {
		this.drawCanvas();
	}


	drawCanvas() {
		//draw background
		this.state.container.fillStyle = '#2b60ff';
		this.state.container.fillRect(0, 0, this.props.width, this.props.height);

		//calculate step between chips
		const DELTA_X = Math.floor(this.props.width / (this.state.columns + 1));
		const DELTA_Y = Math.floor(this.props.height / (this.state.rows + 1));
		
		//as DELTA_Y < DELTa_X, the distance between the centers of each chip is DELTA_Y
		const RADIUS = DELTA_Y * .4; 														

		
		//draw each chip
		for (let r = 0; r < this.state.rows; r++) {
			for (let c = 0; c < this.state.columns; c++) {
 				
 				//if no chip outline is same color as background, if chip slightly darker
        this.state.container.strokeStyle = ['#a3bdff','#2148bc','#2148bc' ][this.props.board[r][c]];

        //yellow for palyer, red for computer
			  this.state.container.fillStyle = ['#a3bdff', '#f9d000', 'red'][this.props.board[r][c]];			
        
        this.state.container.beginPath();
        this.state.container.arc((c + 1) * DELTA_X, (r + 1) * DELTA_Y, RADIUS - 1, 0 , 2 * Math.PI, false);
        this.state.container.fill();
        this.state.container.stroke();
        this.state.container.closePath();
			}
		}
	}


	render() {
		return <canvas id='canvas' height={this.props.height} width={this.props.width}></canvas>
	}
}

export default ConnectBoard;