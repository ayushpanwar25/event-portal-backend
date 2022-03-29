import mongoose from 'mongoose';

const Event = mongoose.model('Event', new mongoose.Schema({
	club: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
}));

export default Event;
