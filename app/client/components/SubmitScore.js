
import React from 'react';

import { formatDate } from '../utils/leaderboardUtils';
import { deleteScore, sendScore } from '../utils/serverCalls'; 

class SubmitScore extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			showError: false
		}
	
		this.escape = e => e.key == 'Escape' ? this.props.update(false) : null;
	
		window.addEventListener('keydown', this.escape);
	}


	componentWillUnmount() {
		window.removeEventListener('keydown', this.escape);
	}


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

	submit(e) {
		if (this.state.name.length == 3) {
			if (this.props.deleteId > 0) {
				deleteScore(this.props.deleteId, () => {})
			}

			sendScore({
				name: this.state.name,
				outcome: this.props.outcome,
				turns: this.props.turns,
				date: formatDate()
			}, this.props.update(true));

		} else {
			this.setState({
				showError: true
			});
		}
	}

	clickedOutside(e) {
		if (e.target == document.getElementById('modal')) {
			this.props.update(false);
		}
	}


	render() {
		return (
			<div id='modal' onClick={this.clickedOutside.bind(this)}>
				<div id='modalContent'>
					<div id='modalBody'>
						<h1>Congratulations! You're eligible for a place on the leaderboard!</h1>
						<h2>Enter your initials</h2>
						<div id='submitName'>
							<div>
								<input type='text' size='4' maxLength='3' onChange={this.changeName.bind(this)} value={this.state.name}/>
								<span style={{visibility:this.state.showError ? 'visible' : 'hidden'}}>&nbsp;&nbsp;3 letters required</span>
							</div>
							<button type='button' onClick={this.submit.bind(this)}>Submit</button>
						</div>
					</div>
					<button type='button' id='closeModal' onClick={this.props.update.bind(null, false)}>&times;</button>
				</div>
			</div>
		)
	}
}

export default SubmitScore;