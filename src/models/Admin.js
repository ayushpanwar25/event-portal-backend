import mongoose from "mongoose";

const Admin = mongoose.model('Admin', new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}, {
	collection: 'admin'
}));

export default Admin;
