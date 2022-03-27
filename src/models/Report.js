import mongoose from 'mongoose';

const reportSchema = mongoose.Schema({
    status: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    proposal: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;