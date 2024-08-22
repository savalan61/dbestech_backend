const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    fcm: { type: String, required: false, default: "none" }, /// new added for token saving
    otp: { type: String, required: false, default: "none" },
    password: { type: String, required: true },
    verification: { type: Boolean, default: false },
    phone: { type: String, default: "099875144" },
    phoneVerification: { type: Boolean, default: false },
    address: { type: mongoose.Schema.Types.ObjectId, required: false, ref: "Address" },
    userType: { type: String, required: true, default: "Client", enum: ["Client", "Admin", "Vendor", "Driver"] },
    profile: { type: String, default: "https://i.ibb.co/GJqQmfC/profile.jpg" },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);


//same as 