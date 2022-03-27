import mongoose from 'mongoose';

const clubSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    about: {
        type: String
    },
    president: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;