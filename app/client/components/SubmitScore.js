
import React from 'react';

import { formatDate } from '../utils/leaderboardUtils';
import { deleteScore, sendScore } from '../utils/serverCalls'; 

class SubmitScore extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: ''
		}
	}

	changeName(e) {
		if (/[a-zA-Z]/.test(e.target.value)) {
			this.setState({
				name: e.target.value.toUpperCase()
			});
		}
	}

	submit(e) {
		e.preventDefault();
		if (this.state.name.length == 3) {
			if (this.props.deleteId) {
				console.log('deleting: ', this.props.deleteId);
				deleteScore(this.props.deleteId, this.updateScore.bind(this));
			} else {
				this.updateScore();
			}
		}
	}

	updateScore() {
		sendScore({
			name: this.state.name,
			outcome: this.props.outcome,
			turns: this.props.turns,
			date: formatDate()
		}, this.props.update);
	}

	render() {
		return (
			<div>
				<input type='text' onChange={this.changeName.bind(this)} maxLength='3' value={this.state.name}/>
				<button type='button' onClick={this.submit.bind(this)}>Submit Score</button>
			</div>
		)
	}
}

export default SubmitScore;