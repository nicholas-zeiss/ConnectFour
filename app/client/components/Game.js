/**
 *
 * This is the root component of the app. This component holds an instance of the ConnectFour class which is our model for the game. Aside from displaying 
 * the turn count and game status (in play, win loss, tie) the actual user interface is handled by subcomponents. 
 * All logic/processing for user input to the ConnectFour instance is contained here and passed down as callbacks to subcomponents.
 *
**/

import React from 'react';

import ConnectBoard from './ConnectBoard';
import GameControl from './GameControl';				
import Input from './Input';						
import Leaderboard from './Leaderboard';	
import SubmitScoreModal from './SubmitScoreModal';

import ConnectFour from '../utils/connectFour';
import { isEligible } from '../utils/leaderboardUtils';
import { getScores } from '../utils/serverCalls';


class Game extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			board: new ConnectFour(),
			canvasDiv: null,
			canvasWidth: 400,
			canvasHeight: 300,
			eligible: false,						// if completed game is eligible to be on leaderboard
			inputLock: false,						// whether user can make a move or not
			leaderboard: [],						// top 10 high scores
			score: [ 0, 0 ],						// player and computer respectively
			showModal: false,						// whether to show score submission modal
			status: 'in play',					// either 'in play', 'W', 'L', or 'T'
		};

		getScores()
			.then(leaderboard => this.setState({ leaderboard }))
			.catch(err => console.log(err));
	}


	// Grab a reference to the div where canvas renders so we can size the canvas appropriately,
	// also add a listener for a window resize to update those dimensions
	componentDidMount() {
		window.onresize = () => { 
			this.setState({
				canvasHeight: .6 * (this.state.canvasDiv.offsetWidth - 60),
				canvasWidth: this.state.canvasDiv.offsetWidth - 60
			});
		};

		window.addEventListener('keypress', this.keypressMoveListener.bind(this));

		const canvasDiv = document.getElementById('canvas-container');

		this.setState({
			canvasHeight: .6 * (canvasDiv.offsetWidth - 60), 
			canvasWidth: canvasDiv.offsetWidth - 60,
			canvasDiv: canvasDiv
		});
	}


	componentDidUpdate() {
		if (this.state.inputLock) {
			window.removeEventListener('keypress', this.keypressMoveListener.bind(this));
		} else {
			window.addEventListener('keypress', this.keypressMoveListener.bind(this));
		}
	}


	// handles user making a move via keyboard, move is made by clicking corresponding button
	// so that css effects are activated
	keypressMoveListener(e) {
		if (!isNaN(e.key) && 0 < Number(e.key) && Number(e.key) < 8) {
			document.getElementById('col-button--'+ e.key).click();
		}

		if (e.key == 'p') this.setState({ eligible: true });
	}


	// handles user moves
	selectColumn(col) {
		if (this.state.status == 'in play' && !this.state.inputLock && this.state.board.isMoveLegal(col)) {
			
			// 1 is the player chip, computer uses 2
			this.state.board.makeMove(col, 1);
			this.state.board.updateStatus();

			// make the computer's move if user didn't just win/tie
			if (this.state.board.status == 'in play') {			
				
				this.updateGame(true);		

				// wait a short delay (for ux purposes) to make AI's move	
				setTimeout(() => {
					this.state.board.makeComputerMove();
					this.state.board.updateStatus();
					this.updateGame(false);
				}, 500);
				
			// game just ended, update score				
			} else {							
				this.updateGame(true);
			}
		}
	}
	

	// updates game score, if game is in play or if not who won, locks/unlocks user input
	updateGame(inputLock) {
		const status = this.state.board.status;
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
			};

			// compare this game to lowest score in leaderboard
			eligible = isEligible(gameScore, this.state.leaderboard);
		}


		this.setState({
			status,
			score,
			inputLock,
			eligible
		});
	}


	// Called when the modal used to submit scores is closed. Either a score was submitted and we must
	// reload the scores, or if not we must reset the game.
	updateLeaderboard = leaderboard => {
		if (leaderboard) {
			this.setState({ leaderboard }, this.clearBoard);
		} else {
			this.clearBoard();
		}
	}


	// reset game
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
		this.setState({ showModal: true });
	}


	render() {
		const rightStatus = {
			'in play': 'Turn count: ' + this.state.board.turnCount,
			W: 'You win!',
			L: 'Computer wins!',
			T: 'Tie!'
		};

		return (
			<div id='app'>		
				{
					this.state.showModal ? 
						<SubmitScoreModal 
							close={ this.updateLeaderboard.bind(this) }
							outcome={ this.state.status } 
							turns={ this.state.board.turnCount } 
						/>
						: null
				}
				
				<div id='header'>
					<h1>Connect Four</h1>
				</div>
				
				<div id='app-container'>
					<Leaderboard scores={ this.state.leaderboard }/>
				
					<div id='game-container'>
						<div id ='status'>	
							<h1 id='left-status'> Player: { this.state.score[0] }&nbsp;&nbsp;Computer: { this.state.score[1] } </h1>
							<h1 id='right-status'>{ rightStatus[this.state.status] }</h1>
						</div>
						
						<div id='canvas-container'>
							<ConnectBoard
								board={ this.state.board.board }
								height={ this.state.canvasHeight }
								width={ this.state.canvasWidth }
							/>
						</div>
						
						<Input inputLock={ this.state.inputLock } makeMove={ this.selectColumn.bind(this) }/>
						
						<GameControl 
							clearBoard={ this.clearBoard.bind(this) } 
							eligible={ this.state.eligible } 
							showModal={ this.showModal.bind(this) }
							status={ this.state.status } 
						/>
					</div>
				</div>
			</div>
		);
	}
}


export default Game;

