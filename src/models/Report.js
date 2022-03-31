import mongoose from 'mongoose';

const Report = mongoose.model('Report', new mongoose.Schema({
	status: {
		type: Boolean,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
}));

export default Report;