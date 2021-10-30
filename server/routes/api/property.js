
const express = require('express');
const router = express.Router();
const validation = require('./../../modules/Property/propertyValidation')
const { authentication } = require('../../middleware/auth.middleware');
const propertyController = require('../../modules/Property/propertyController');
const uploaderHelper = require('../../helper/upload.helper');



router.post('/save', authentication, uploaderHelper.arrayOfImage('images', 4), validation.sanitize, validation.validate, propertyController.saveProperty)
router.post('/edit/:id', authentication, uploaderHelper.arrayOfImage('images', 4), validation.sanitize, validation.validate, propertyController.editProperty)
router.get('/all', propertyController.getAllProperty)
router.get('/single/:property_id', propertyController.getSingleProperty)
router.get('/user', authentication, propertyController.getAllPropertyOfUser)
router.delete('/delete/:property_id', authentication, propertyController.deleteProperty)

module.exports = router;