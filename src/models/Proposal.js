import mongoose from 'mongoose';

const Proposal = mongoose.model('Proposal', new mongoose.Schema({
	club: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	approval: {
		type: Number,
		default: 0,
		min: 0,
		max: 2
	}
}, {
	collection: 'proposals'
}));

export default Proposal;
