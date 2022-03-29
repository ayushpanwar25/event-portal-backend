import mongoose from 'mongoose';

const Club = mongoose.model('Club', new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	about: {
		type: String
	},
	logo: {
		type: String
	},
	president: {
		type: String
	},
	proposals: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Proposal'
	}],
	events: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event'
	}]
}, {
	collection: 'clubs'
}));

export default Club;
