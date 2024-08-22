//import Food from '../models/food';
const Food = require('../models/food');
const mongoose = require('mongoose');


module.exports = {

    /// Add New Food
    addFood: async (req, res) => {
        const { title, foodTags, category, code, restaurant, description, time, price, additives, imageUrl } = req.body;

        if (!title || !foodTags || !category || !code || !restaurant || !description || !time || !price || !additives || !imageUrl) {
            return res.status(400).json({ status: false, message: "You have a missing field." });
        }
        try {
            const newFood = new Food(req.body);
            await newFood.save();
            res.status(201).json({ status: true, message: "New Food Added Successfully." });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // Get a Food By Id
    getFoodById: async (req, res) => {
        const id = req.params.id;
        try {
            const food = await Food.findById(id);
            res.status(200).json(food);

        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },


    // Get Random Foods
    getRandomFoods: async (req, res) => {
        try {
            let randomFoods = [];
            if (req.params.code) {
                randomFoods = await Food.aggregate([{ $match: { code: req.params.code } }, { $sample: { size: 5 } }, { $project: { __v: 0 } }]);
            }

            if (!randomFoods.length) {
                randomFoods = await Food.aggregate([{ $sample: { size: 5 } }, { $project: { __v: 0 } }]);
            }
            if (randomFoods.length) {
                res.status(200).json(randomFoods);
            } else {
                res.status(200).json({ status: false, message: "No Food Found." })
            }

        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },

    //Get All Foods By Code
    getAllFoodsByCode: async (req, res) => {
        const code = req.params.code;
        try {
            let foods = [];
            foods = await Food.find({ code: code });
            res.status(200).json(foods)
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },


    //Get Foods by Restaurant (Restaurant menue)
    getFoodsByRestaurant: async (req, res) => {
        const restId = req.params.id

        try {
            let foods = [];
            foods = await Food.find({ restaurant: restId });
            res.status(200).json(foods);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },

    //Get Foods by Category and Code 
    getFoodsByCategoryAndCode: async (req, res) => {
        const { category, code } = req.params;
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ status: false, message: "Invalid category ID" });
        }
        try {
            let foods;
            foods = await Food.aggregate([
                { $match: { isAvailable: true, category: new mongoose.Types.ObjectId(category) } }, /// removed Code be careeeee
                { $project: { __v: 0 } }
            ]);



            if (foods.length === 0) {
                return res.status(200).json([]);
            }
            return res.status(200).json(foods);

        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },

    //Search Food( this code is just for mogo atlas)
    searchFoods: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await Food.aggregate([
                {
                    $search: {
                        index: "food",
                        text: {
                            query: search,
                            path: { wildcard: "*" }
                        }
                    }
                }
            ]);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
    ,

    //Get Random Foods by Category and Code 
    getRandomFoodsByCategoryAndCode: async (req, res) => {
        const { category, code } = req.params;
        try {
            let foods;
            foods = await Food.aggregate([{ $match: { code: code, category: category, isAvailable: true } }, { $sample: { size: 10 } }, { $project: { __v: 0 } }]);

            if (foods.length === 0 || !foods) {
                foods = await Food.aggregate([{ $match: { code: code, isAvailable: true } }, { $sample: { size: 10 } }, { $project: { __v: 0 } }]);
            }

            if (foods.length === 0 || !foods) {
                foods = await Food.aggregate([{ $match: { isAvailable: true } }, { $sample: { size: 10 } }, { $project: { __v: 0 } }]);

            }
            res.status(200).json(foods);

        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },

};