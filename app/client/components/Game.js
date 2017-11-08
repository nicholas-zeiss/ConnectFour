/**
This is the root component of the app. This component holds an instance of the ConnectFour class which is our model for the game. It also holds the server
controlled leaderboard. Aside from displaying the turn count and game status (in play, win loss, tie) the actual user interface is handled by subcomponents. 
All logic for the user interacting with the ConnectFour instance is contained here and passed down as props to subcomponents. This component handles the
running of the game based off of the user input and updates the view as necessary.
**/

import React from 'react';

import ConnectFour from '../utils/connectFour';

import { isEligible, sortLeaderboard } from '../utils/leaderboardUtils';
import { deleteScore, getScores, sendScore } from '../utils/serverCalls';

import ConnectBoard from './ConnectBoard';
import GameControl from './GameControl';				
import Input from './Input';						
import ScoreBoard from './ScoreBoard';	
import SubmitScoreModal from './SubmitScoreModal';


class Game extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			board: new ConnectFour(),
			

			status: 'in play',					//either 'in play', 'W', 'L', or "T"
			score: [0, 0],							//player and computer respectively
			inputLock: false,						//if true user cannot make a move, used to force player to wait for computer movement or start new game
			

			leaderboard: [],						//holds the top 10 high scores of all time
			eligible: false,						//true if game is over and player is eligible for the leaderboard		
			showModal: false,						//if true the modal used to submit a high score is rendered
			

			canvasDiv: null,						//reference to the div containing the canvas element we use to render the game board, and its dimensions
			canvasWidth: 400,
			canvasHeight: 300
		};


		//initialize async call to get leaderboard
		getScores(scores => {
			this.setState({
				leaderboard: sortLeaderboard(scores)
			});
		});


		//this is the event listener we use to handle the keyboard being used to make a player move
		this.columnKeyListener = e => {
			if (!isNaN(e.key) && 0 < Number(e.key) && Number(e.key) < 8) {
				document.getElementById('col-button--'+ e.key).click();
			}
		};
		
		window.addEventListener('keypress', this.columnKeyListener);
	}


	//Grab a reference to the div where canvas renders so we can size the canvas appropriately,
	//also add a listener for a window resize to update those dimensions
	componentDidMount() {
		window.onresize = () => { 
			this.setState({
				canvasHeight: .6 * (this.state.canvasDiv.offsetWidth - 60),
				canvasWidth: this.state.canvasDiv.offsetWidth - 60
			});
		};

		let canvasDiv = document.getElementById('canvasContainer');

		this.setState({
			canvasHeight: .6 * (canvasDiv.offsetWidth - 60), 
			canvasWidth: canvasDiv.offsetWidth - 60,
			canvasDiv: canvasDiv
		});
	}


	//if input is locked we remove keypress listener, otherwise add it
	componentDidUpdate() {
		if (this.state.inputLock) {
			window.removeEventListener('keypress', this.columnKeyListener);
		} else {
			window.addEventListener('keypress', this.columnKeyListener);
		}
	}


	//handles user moves
	selectColumn(col) {
		if (this.state.status == 'in play' && !this.state.inputLock && this.state.board.isMoveLegal(col)) {
			//1 is the player chip, computer uses 2
			this.state.board.makeMove(col, 1);
			this.state.board.updateStatus();

			//make the computer's move if user didn't just win/tie
			if (this.state.board.status == 'in play') {			
				
			  this.updateGame(true);		

			  //wait a short delay (for ux purposes) to make AI's move	
			  setTimeout(() => {
			  	this.state.board.makeComputerMove();
			  	this.state.board.updateStatus();
			  	this.updateGame(false);
			  }, 500);
				
			//game just ended, update score				
			} else {							
			  this.updateGame(true);
			}
		}
	}
	

	//updates game score, if game is in play or if not who won, locks/unlocks user input
	updateGame(inputLock) {
		let status = this.state.board.status;
		let score = this.state.score;
		let eligible = false;


		if (status != 'in play') {
			inputLock = true;

			if (status == 'W') {
				score[0]++;
			
			} else if (status == 'L') {
				score[1]++;
			}

			let gameScore = {
				outcome: status,
				turns: this.state.board.turnCount
			}

			//either less than 10 scores total so any game is eligible, if not compare this game to lowest score in leaderboard
			eligible = this.state.leaderboard.length < 10 || isEligible(gameScore, this.state.leaderboard);
		}


		this.setState({
			status,
			score,
			inputLock,
			eligible
		});
	}


	//Called when the modal used to submit scores is closed. Either a score was submitted and we must
	//reload the scores, or if not we must reset the game.
	updateLeaderboard(reload) {
		if (reload) {
			getScores(scores => {
				this.setState({
					leaderboard: sortLeaderboard(scores)
				}, this.clearBoard);
			});
		} else {
			this.clearBoard();
		}
	}


	//reset game
	clearBoard() {
		this.state.board.clear();
		
		this.setState({
			status: this.state.board.status,
			inputLock: false,
			eligible: false,
			showModal: false
		});
	}


	showModal() {
		this.setState({
			showModal: true
		});
	}


	render() {

		let rightStatus = {
			'in play': `Turn count: ${this.state.board.turnCount}`,
			W: 'You win!',
			L: 'Computer wins!',
			T: 'Tie!'
		};

		let deleteId = -1;

		if (this.state.leaderboard.length == 10) {
			deleteId = this.state.leaderboard[this.state.leaderboard.length - 1].id;
		}


		return (
			<div id='app'>
				
				{this.state.showModal ? 
					<SubmitScoreModal 
						outcome={this.state.status} 
						turns={this.state.board.turnCount} 
						deleteId={deleteId}
						close={this.updateLeaderboard.bind(this)}
					/>
					: null
				}

				
				<div id='header'>
					<h1>Connect Four</h1>
				</div>
				
				<div id='appContainer'>
					<div id='empty'>
						<ScoreBoard scores={this.state.leaderboard}/>
					</div>

				
					<div id='gameContainer'>
						
						<div id ='status'>	
							<h1 id='leftStatus'>Player: {this.state.score[0]}&nbsp;&nbsp;Computer: {this.state.score[1]}</h1>
							<h1 id='rightStatus'>{rightStatus[this.state.status]}</h1>
						</div>
						
						<div id='canvasContainer'>
							<ConnectBoard
								board={this.state.board.board}
								width={this.state.canvasWidth}
								height={this.state.canvasHeight}/>
						</div>
						
						<Input makeMove={this.selectColumn.bind(this)} inputLock={this.state.inputLock}/>
						
						<GameControl 
							status={this.state.status} 
							eligible={this.state.eligible} 
							clearBoard={this.clearBoard.bind(this)} 
							showModal={this.showModal.bind(this)}/>
					</div>
					
					<div></div>
				</div>
			</div>
		);
	}
}


export default Game;

