import mongoose from 'mongoose';

const FC = mongoose.model('FC', new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	proposals: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Proposal'
	}]
}, {
	collection: 'fc'
}));

export default FC;
