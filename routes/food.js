const router = require('express').Router();
const foodController = require('../controllers/foodController');
const { verifyVendor } = require('../middleware/verifyToken')



router.post('/', foodController.addFood);
router.get('/recommendation/:code', foodController.getRandomFoods);
router.get('/byCode/:code', foodController.getAllFoodsByCode);
router.get('/:id', foodController.getFoodById);
router.get('/restaurant-foods/:id', foodController.getFoodsByRestaurant);
router.get('/search/:search', foodController.searchFoods);
//router.get('/:category/:code', foodController.getRandomFoodsByCategoryAndCode);
router.get('/:category/:code', foodController.getFoodsByCategoryAndCode);


module.exports = router;
