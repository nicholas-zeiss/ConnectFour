/**
This is our modal for submitting a high score to the leaderboard. One can close the modal without a submission by clicking outside
the modal, hitting the close button in the top right, or hitting escape. Hitting enter when inside the text input or pressing the submit button
will cause this component to try and send the score. If your initials are invalid it displays an error message instead of submitting.
Valid initials are three capital letters. Child of the Game component.
**/

import React from 'react';

import { formatDate } from '../utils/leaderboardUtils';
import { deleteScore, sendScore } from '../utils/serverCalls'; 


class SubmitScoreModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			inputElement: null,
			name: '',
			showError: false
		};

		this.keydownListener = e => {
			if (e.key == 'Escape') {
				this.close(false);
			} else if (e.key == 'Enter' && document.activeElement == this.state.inputElement) {
				this.submit();
			}
		}
	}

	//transition the modal content into the page
	//grab a reference to the text input which is needed so that pressing enter only has an effect when it is in focus
	//create a listener for the enter and escape keys
	componentDidMount() {
		//without the timeout the style will still change but no css transition occurs
		setTimeout(() =>{
			let modal = document.getElementById('modalContent')
			console.log(modal.style.bottom);
			modal.style.bottom = '0px';
		}, 10);

		let inputElement = document.getElementById('nameInput');
		
		window.addEventListener('keydown', this.keydownListener);
		
		this.setState({inputElement});
	}


	componentWillUnmount() {
		window.removeEventListener('keydown', this.keydownListener);
	}


	//Activated on any change to the text input for the player's name. Only processes the change if the
	//input's value only contains letters. If the error message was already being displayed and the input value
	//is now valid we hide the error message.
	changeName(e) {
		if (!/[^a-zA-Z]/g.test(e.target.value)) {
			let error = this.state.showError;

			if (error && e.target.value.length == 3) {
				error = false;
			}

			this.setState({
				name: e.target.value.toUpperCase(),
				showError: error
			});
		}
	}


	//If the submit button is clicked without a valid name we show the error message. If the name is valid
	//we delete the score we are replacing, if applicable, submit our score and close the modal.
	submit() {
		if (this.state.name.length == 3) {
			if (this.props.deleteId > 0) {
				deleteScore(this.props.deleteId);
			}

			sendScore({
				name: this.state.name,
				outcome: this.props.outcome,
				turns: this.props.turns,
				date: formatDate()
			}, this.close.bind(this, true));

		} else {
			this.setState({
				showError: true
			});
		}
	}


	//if player clicks outside the modal, close it
	clickedOutside(e) {
		if (e.target == document.getElementById('modal')) {
			this.close(false);
		}
	}

	//allows the css transition of the modal rising to the top of the page to occur before this component unmounts
	close(reload) {
		let modal = document.getElementById('modalContent')

		modal.style.bottom = '1000px';

		setTimeout(this.props.close.bind(null, reload), 700);
	}


	render() {
		return (
			<div id='modal' onClick={this.clickedOutside.bind(this)}>
				<div id='modalContent' style={{bottom:'500px'}}>
					<button 
						type='button' 
						id='closeModal' 
						onClick={this.close.bind(this, false)}>
						&times;
					</button>
					<h1>Congratulations!<br/><small>You've earned a place on the leaderboard!</small></h1>
					<div id='submitName'>
						<div id='submitNameInput'>
							<label>Initials:</label>
							<input 
								type='text' 
								size='4' 
								maxLength='3' 
								onChange={this.changeName.bind(this)} 
								value={this.state.name}
								id='nameInput'/>
							<span 
								style={{visibility: this.state.showError ? 'visible' : 'hidden'}}>
								&nbsp;&nbsp;3 letters required
							</span>
						</div>
						<button 
							type='button' 
							onClick={this.submit.bind(this)}>
							Submit
						</button>
					</div>
				</div>
			</div>
		)
	}
}
					// </div>
					// <div id='modalBody'>

export default SubmitScoreModal;

