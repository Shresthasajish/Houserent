const express = require('express');
const router = express.Router();
const validation = require('./../../modules/user/userValidations')
const { authentication } = require('../../middleware/auth.middleware');
const userController = require('../../modules/user/userController')

// router.get('/grby', authentication, authorization, userModule.GetAllUserGroupBy);
router.post('/register', validation.sanitizeRegister, validation.validateRegister, userController.register)
router.post('/login', validation.sanitizeLogin, validation.validateLogin, userController.login)
router.post('/verify-email', userController.verifyEmail)
router.post('/change-password', validation.sanitizeChangePassword, validation.validateChangePassword, authentication, userController.changePassword)
router.post('/resend-code', userController.ResendVerificationCode)
router.post('/forgot-password', userController.ForgotPassword)
router.post('/reset-password', userController.ResetPassword)


module.exports = router;
