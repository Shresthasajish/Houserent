const express = require('express');
const router = express.Router();

// All route of User
const userRoutes = require('./api/users');
router.use('/user', userRoutes);

// All route of property
const propertyRoutes = require('./api/property');
router.use('/property', propertyRoutes);

const favoriteRoutes = require('./api/favorite');
router.use('/favorite', favoriteRoutes);
module.exports = router;
