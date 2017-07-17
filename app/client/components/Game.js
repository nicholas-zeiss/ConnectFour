/**
This is the parent component of the app. This component holds an instance of the ConnectFour class which is our model for the game.
Aside from a few pieces of information the actual user interface (ie our view) is handled by subcomponents. All logic for the user interacting with
the ConnectFour instance is contained here and passed down as props to subcomponents where they are displayed in the user interface.
This component handles the logic of running the game based off of the user input and updates the view as necessary.
**/

import React from 'react';

import ConnectFour from '../logic/connectFour';							//actual game model

import ConnectBoard from './ConnectBoard';									//responsible for displaying the board to the user
import GameControl from './GameControl';				
import Input from './Input';							


class Game extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			status: 'in play',					//either 'in play', 'You win!', 'The computer wins!', or "It's a tie"
			board: new ConnectFour(),
			score: [0, 0],							//player and computer respectively
			lock: false									//if true user cannot make a move, used to force player to wait for computer movement or start new game
		};
	}

	//adds listeners to make moves for key presses from 1 - 7, toggles the button between active and inactive for css transition 
	componentDidMount() {
		window.addEventListener('keypress', (e) => {
			if (!isNaN(e.key) && 0 < Number(e.key) && Number(e.key) < 8) {
				let btn = document.getElementById('col-button--'+ e.key);

				btn.className = 'active';															//toggles button to begin animation
				
				setTimeout(() => btn.className = 'inactive', 125);		//untoggles it to stop animation
				
				this.selectColumn(Number(e.key) - 1);
			}
		});
	}

	//handles user movements
	selectColumn(col) {
		if (this.state.status == 'in play' && !this.state.lock && this.state.board.isMoveLegal(col)) {
			this.state.board.makeMove(col, 1);
			this.state.board.updateStatus(col);

			//make the computer's move if user didn't just win/tie
			if (this.state.board.status == 'in play') {			
				
			  this.updateState(true);		

			  //wait a short delay (for ux purposes) to make AI's move	
			  setTimeout(() => {
			  	this.state.board.updateStatus(this.state.board.makeComputerMove());
			  	this.updateState(false);
			  }, 500);
			
			} else {							
				//game just ended, update score				
			  this.updateState(false);
			}
		}
	}
	
	//updates game score, if game is in play or if not who win, locks/unlocks user input
	updateState(lock) {
		let state = this.state.board.status;
		let score = this.state.score;

		if (state == 'You win!') {
			score[0]++;
		
		} else if (state == 'The computer wins!') {
			score[1]++;
		}

		if (lock != this.state.lock) {
			this.setState({
				status: state,
				score: score,
				lock: lock
			});
		}
	}


	clearBoard() {
		this.state.board.clear();
		
		this.setState({
			status: this.state.board.status
		});
	}


	render() {
		return (
			<div id='gameContainer'>
				<div id ='status'>	
					<h1 id='leftStatus'>Player: {this.state.score[0]} Computer: {this.state.score[1]}</h1>
					<h1 id='rightStatus'>Turn count: {this.state.board.turnCount}</h1>
				</div>
				<ConnectBoard board={this.state.board.board}/>
				<Input update={this.selectColumn.bind(this)}/>
				<GameControl status={this.state.status} clearBoard={this.clearBoard.bind(this)}/>
			</div>
		);
	}
}

export default Game;