import mongoose from 'mongoose';

const Event = mongoose.model('Event', new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	club: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	proposal: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Proposal'
	},
	report: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Report'
	}
}, {
		collection: 'events'
}));

export default Event;
