const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Food' },
    additives: { type: Array, required: false, default: [] },
    totalPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },

}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);