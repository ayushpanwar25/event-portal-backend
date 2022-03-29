import mongoose from 'mongoose';

const Proposal = mongoose.model('Proposal', new mongoose.Schema({
	club: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
}));

export default Proposal;