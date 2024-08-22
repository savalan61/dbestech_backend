const Rating = require('../models/rating');
const Restaurant = require('../models/restaurant');
const Food = require('../models/food');

module.exports = {

    // Add Rating
    addRating: async (req, res) => {
        const newRating = new Rating({
            userId: req.user.id,
            ratingType: req.body.ratingType,
            product: req.body.product,
            rating: req.body.rating
        });

        try {
            await newRating.save();

            if (req.body.ratingType === "Restaurant") {
                const productAverageRating = await Rating.aggregate([
                    { $match: { ratingType: req.body.ratingType, product: req.body.product } },
                    { $group: { _id: '$product', averageRating: { $avg: '$rating' } } }
                ]);

                /// output is like this: [{"_id": "product_id","averageRating": 4.5}]

                if (productAverageRating.length > 0) {
                    await Restaurant.findByIdAndUpdate(req.body.product, { rating: productAverageRating[0].averageRating }, { new: true });
                }
            } else if (req.body.ratingType === "Food") {
                const productAverageRating = await Rating.aggregate([
                    { $match: { ratingType: req.body.ratingType, product: req.body.product } },
                    { $group: { _id: '$product', averageRating: { $avg: '$rating' } } }
                ]);


                if (productAverageRating.length > 0) {
                    await Food.findByIdAndUpdate(req.body.product, { rating: productAverageRating[0].averageRating }, { new: true });
                }
            }

            return res.status(200).json({ status: true, message: 'Rating added successfully' });

        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    },

    checkUserRated: async (req, res) => {
        const ratingType = req.query.ratingType;
        const product = req.query.product;

        try {
            const existingRating = await Rating.findOne({
                userId: req.user.id,
                product: product,
                ratingType: ratingType

            });
            if (existingRating) {
                res.status(200).json({ status: true, message: "You have already rated this." })
            } else {
                res.status(200).json({ status: false, message: "You have not rated this yet." })
            }
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });

        }
    }



}
