import mongoose from 'mongoose';

const Proposal = mongoose.model('Proposal', new mongoose.Schema({
	// Club Details
	clubName: {
		type: String,
		required: true,
		immutable: true 
	},	
	clubId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Club',
		immutable: true 
	},
	facultyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'FC',
		immutable: true 
	},

	// Event Details
	eventName: {
		type: String,
		requried: true
	},
	schedule: {
		type: Date,        //TODO: Add diff Start and End field or convert to String 
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
	brochure: {
		type: String,
		requried: true
	},

	// Event Details END

	undertaking: {
		type: Boolean,
		required: true,
		default: false
	},
	detail: {
		// TODO: Add comments and Approvals for others
	},

	// Attribute for physical or online event
	modeType: {
		type: String,
		enum: ['physical', 'online'],
		required: true
	},
	// TODO: Add Financial or Non-Financial Field?

	// Online Mode fields

	onlinePlatform: {
		type: String
	},
	eventLink: {
		type: String
	},

	// Offline Mode fields
	venue: {
		type: String
	},

	// fees 

	registrationFee: {
		type: Number,
		default: 0
	},
	sponsorship: {
		type: String,
	},
	prize: {
		type: String,
	},
	budget: {
		type: String,
		// Includes budget, purchase requirement and cost 
		// Stores PDF Link
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
}, {
	collection: 'proposals'
}));

export default Proposal;
