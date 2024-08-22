const { json } = require('body-parser');
const Cart = require('../models/cart');

module.exports = {

    // Add Product To Cart
    addProductToCart: async (req, res) => {
        console.log('add activated.');
        console.log('User ID:', req.user.id);

        const userId = req.user.id;
        const { productId, totalPrice, quantity, additives } = req.body;
        let count;
        try {
            const existingCart = await Cart.findOne({ userId: userId, productId: productId });
            count = await Cart.countDocuments({ userId: userId });
            if (existingCart) {
                existingCart.totalPrice += totalPrice * quantity;
                existingCart.quantity += quantity;
                await existingCart.save();
                return res.status(200).json({ status: true, count: count });

            } else {
                const newCart = new Cart({
                    userId: userId,
                    productId: productId,
                    totalPrice: totalPrice,
                    quantity: quantity,
                    additives: additives
                });

                await newCart.save();
                count = await Cart.countDocuments({ userId: userId });
                return res.status(200).json({ status: true, count: count });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }

    },

    // Remove Cart Item
    removeCartItem: async (req, res) => {
        const cartItemId = req.params.id;
        const userId = req.user.id;
        try {
            await Cart.findByIdAndDelete({ _id: cartItemId });
            const count = await Cart.countDocuments({ userId: userId });
            res.status(200).json({ status: true, count: count });

        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },

    //Get Cart
    getCart: async (req, res) => {
        const userId = req.user.id;
        try {
            const cart = await Cart.find({ userId: userId })
                .populate({
                    path: 'productId',
                    select: 'imageUrl title restaurant rating ratingCount',
                    populate: { path: 'restaurant', select: 'time coords' }
                });

            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },


    //Get Cart Count
    getCartCount: async (req, res) => {
        const userId = req.user.id;
        try {
            const count = await Cart.countDocuments({ userId: userId });
            res.status(200).json({ status: true, count: count });

        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },


    decrementProductQty: async (req, res) => {
        const userId = req.user.id;
        const id = req.params.id;
        try {
            const cartItem = await Cart.findById(id);
            if (cartItem) {
                const productPrice = cartItem.totalPrice / cartItem.quantity;
                if (cartItem.quantity > 1) {
                    cartItem.quantity -= 1;
                    cartItem.totalPrice -= productPrice;
                    await cartItem.save();
                    return res.status(200).json({ status: true, message: "Product Quantity successfully decrement." });
                } else {
                    await Cart.findOneAndDelete({ _id: id });
                    return res.status(200).json({ status: true, message: "Product removed successfully from cart." });
                }
            } else {
                return res.status(400).json({ status: false, message: "Product not found." });

            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }

    }


};