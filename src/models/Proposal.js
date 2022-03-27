import mongoose from 'mongoose';

const proposalSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    proposal: {
        type: String,
        required: true
    },
    club: {
        type: String,
        enum: ['Club 1', 'Club 2', 'Club 3', 'Club 4', 'more'],
        default: 'Club 1',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;