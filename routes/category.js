const router = require('express').Router();
const categoryController = require('../controllers/categoryController');

router.post('/', categoryController.createCategory);

router.get('/', categoryController.getAllCategpries);

router.get('/random', categoryController.getRandomCategories);

module.exports = router;
