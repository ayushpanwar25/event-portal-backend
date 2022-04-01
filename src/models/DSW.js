import mongoose from 'mongoose';

const DSW = mongoose.model('DSW', new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}, {
	collection: 'dsw'
}));

export default DSW;
