const Restaurant = require('../models/restaurant');

module.exports = {

    // Add New Restaurant
    addRestaurant: async (req, res) => {
        const { title, time, imageUrl, owner, code, logoUrl, coords } = req.body;
        if (!title || !time || !imageUrl || !owner || !code || !logoUrl || !coords || !coords.latitude || !coords.longitude || !coords.address || !coords.title) {
            return res.status(400).json({ status: false, message: "You have a missing field!" });
        }

        try {
            const newRestaurant = new Restaurant(req.body)
            await newRestaurant.save();
            res.status(201).json({ status: true, message: "Restaurant added successfully." });


        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },


    // Get a Restaurant By Id
    getRestaurantById: async (req, res) => {
        const id = req.params.id;
        try {
            const restaurant = await Restaurant.findById(id);
            res.status(200).json(restaurant);

        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },


    // Get Random Restaurants
    getRandomRestaurants: async (req, res) => {
        const code = req.params.code;
        try {
            let randmRestaurants = [];
            if (code) {
                randmRestaurants = await Restaurant.aggregate([{ $match: { code: code, isAvailable: true } }, { $sample: { size: 5 } }, { $project: { __v: 0 } }]);
            }

            if (randmRestaurants.length === 0) {
                randmRestaurants = await Restaurant.aggregate([{ $match: { isAvailable: true } }, { $sample: { size: 5 } }, { $project: { __v: 0 } }]);

            }
            res.status(200).json(randmRestaurants);

        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },

    getAllNearByRestaurants: async (req, res) => {
        const code = req.params.code;
        try {
            let allNearbyRestaurants = [];
            if (code) {
                allNearbyRestaurants = await Restaurant.aggregate([{ $match: { code: code, isAvailable: true } }, { $project: { __v: 0 } }]);
            }

            if (allNearbyRestaurants.length === 0) {
                allNearbyRestaurants = await Restaurant.aggregate([{ $match: { isAvailable: true } }, { $project: { __v: 0 } }]);

            }
            res.status(200).json(allNearbyRestaurants);

        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },
}