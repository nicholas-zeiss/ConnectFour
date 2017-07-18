/**
Render the game board using a canvas element, child of the Game component
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
		this.state.container.clearRect(0, 0, this.props.width, this.props.height);

		//draw background
		this.state.container.fillStyle = '#0061ff';
		this.state.container.fillRect(0, 0, this.props.width, this.props.height);


		const DELTA_X = Math.floor(this.props.width / (this.state.columns + 1));				//calculate step between chips
		const DELTA_Y = Math.floor(this.props.height / (this.state.rows + 1));
		const RADIUS = DELTA_Y * .4;//25;

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
			  this.state.container.fillStyle = ['#baceff', '#f9d000', 'red'][this.props.board[r][c]];		//0 - transparent, 1 - yellow (player), 2 - red (AI)			
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