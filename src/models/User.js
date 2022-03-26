import mongoose from 'mongoose';

export const User = mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    club: { type: String, required: true }
}, {
    collection: 'users'
}));