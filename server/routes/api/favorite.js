const express = require('express');
const router = express.Router();
const { authentication } = require('../../middleware/auth.middleware');
const favoriteController = require('../../modules/favorite/favoriteController');

router.post('/add', authentication, favoriteController.addFavorite)
// router.get('/all', authentication, favoriteController.getAllFavoriteUsers)
router.get('/single', authentication, favoriteController.getSingleFavoriteByUser)

module.exports = router;
