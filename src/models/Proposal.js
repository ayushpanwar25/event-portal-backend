import mongoose from 'mongoose';

const Proposal = mongoose.model('Proposal', new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	clubName: {
		type: String,
		required: true
	},
	clubId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Club',
	},
	date: {
		type: Date,
		default: Date.now
	},
	approval: {
		type: Number,
		default: 0,
		min: -1,
		max: 3
	},
	facultyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'FC'
	},
}, {
	collection: 'proposals'
}));

export default Proposal;
