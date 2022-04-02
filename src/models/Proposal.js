import mongoose from 'mongoose';

const Proposal = mongoose.model('Proposal', new mongoose.Schema({
	club: {
		type: String,
		required: true
	},
	eventName: {
		type: String,
		requried: true
	},
	schedule: {
		type: Date,
		requried: true
	},
	intro: {
		type: String,
		required: true
	},
	objectives: {
		type: String,
		required: true
	},
	beneficiaries: {
		type: String,
		required: true
	},
	description: {
		type: String,
		requried: true
	},
	broschure: {
		type: String,
		requried: true
	},
	undertaking: {
		type: Boolean,
		required: true,
		default: false
	},
	scsigin: {

	},
	cpsign: {

	},
	fcsign: {

	},
	detail: {

	},
	onlinePlatform: {
		type: String
	},
	eventLink: {
		type: URL
	},
	venue: {
		type: String
	},
	registrationFee: {
		type: Number,
		default: 0
	},
	sponsorship: {
		type: String,
		default: none
	},
	prize: {
		type: String,
		default: none
	},
	budget: {
		//tabuler form
	},
	approval: {
		type: Number,
		default: 0,
		min: -1,
		max: 3
	},
	comments: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now
	},
	clubId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Club',
	},
	facultyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'FC'
	},
}, {
	collection: 'proposals'
}));

export default Proposal;
