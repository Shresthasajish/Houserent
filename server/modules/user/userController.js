const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('./userConfig');
const otherHelper = require('../../helper/others.helper');
const userSch = require('./userSchema');
const { secretOrKey, tokenExpireTime } = require('../../config/keys');
const loginLogs = require('../loginlogs/loginlogController').internal;
const sendMail = require('../../helper/email.helper');
const { loginLogController } = require('../loginlogs/loginlogController');

const userController = {};

userController.register = async (req, res, next) => {
      try {
            let email = req.body.email && req.body.email.toLowerCase();
            const user = await userSch.findOne({ email: email });



            if (user) {
                  const errors = { email: 'Email already exists' };
                  const data = { email: email };
                  return otherHelper.sendResponse(res, httpStatus.CONFLICT, false, data, errors, errors.email, null);
            } else {


                  const newUser = req.body;
                  newUser.email = req.body.email.toLowerCase()
                  const salt = await bcrypt.genSalt(10);
                  const hash = await bcrypt.hash(newUser.password, salt);
                  newUser.password = hash;
                  newUser.email_verification_code = otherHelper.generateRandomHexString(6);
                  newUser.email_verified = false;
                  newUser.last_password_change_date = new Date();
                  newUser.email_verified_request_date = new Date();
                  const mailOptions = {
                        to: newUser.email,
                        subject: 'House Rent Service Verification Code',
                        text: `Dear ${newUser.name}, \n \n Your verification code is ${newUser.email_verification_code}`
                  };
                  await sendMail.send(mailOptions)
                  const userInfo = new userSch(newUser);
                  const userSave = await userInfo.save();
                  const { token, payload } = await userController.validLoginResponse(req, userSave, next);

                  return otherHelper.sendResponse(res, httpStatus.OK, true, payload, null, 'user register successful', token);
            }
      } catch (err) {
            next(err)
      }

};

userController.login = async (req, res, next) => {
      try {
            let errors = {};
            const password = req.body.password;
            let email = req.body.email.toLowerCase();
            const user = await userSch.findOne({ email });
            if (!user) {
                  errors.email = 'User not found';
                  return otherHelper.sendResponse(res, httpStatus.NOT_FOUND, false, null, errors, 'Username or Password Incorrect', null);
            } else {
                  if (!user.email_verified) {
                        return otherHelper.sendResponse(res, httpStatus.NOT_ACCEPTABLE, false, { email: email, email_verified: false }, null, 'Please Verify your Email', null);
                  }
                  // Check Password
                  const isMatch = await bcrypt.compare(password, user.password);
                  if (isMatch) {
                        const { token, payload } = await userController.validLoginResponse(req, user, next);
                        return otherHelper.sendResponse(res, httpStatus.OK, true, payload, null, null, token);
                  } else {
                        errors.password = 'Username or Password Incorrect';
                        return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors.password, null);
                  }
            }
      } catch (err) {
            next(err);
      }
};

userController.verifyEmail = async (req, res, next) => {
      try {
            const email = req.body.email.toLowerCase();
            const code = req.body.code;
            const user = await userSch.findOne({ email, email_verification_code: code });
            const data = { email };
            const user1 = await userSch.findOne({ email });

            let errors = {};
            if (user1.email_verified) {
                  errors.email = 'Email Already Verified';
                  return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, data, null, errors.email, null);
            }
            else if (!user) {
                  errors.email = 'Invalid Verification Code';
                  return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, data, null, errors.email, null);
            } else {
                  const pulledData = await userSch.findByIdAndUpdate(user._id, { $set: { email_verified: true }, $unset: { email_verification_code: 1 } }, { new: true });
                  const { token, payload } = await userController.validLoginResponse(req, pulledData, next);
                  return otherHelper.sendResponse(res, httpStatus.OK, true, payload, null, config.emailVerify, token);
            }
      } catch (err) {
            next(err);
      }
};

userController.changePassword = async (req, res, next) => {
      try {
            let errors = {};
            const { oldPassword, newPassword } = req.body;
            if (oldPassword == newPassword) {
                  errors.oldPassword = 'Old and New password field cannot be same';
                  return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, null, null);
            }
            const user = await userSch.findById(req.user.id);
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (isMatch) {
                  loginLogController.RemoveToken(req, res, next)
                  const salt = await bcrypt.genSaltSync(10);
                  const hash = await bcrypt.hashSync(newPassword, salt);
                  const dbRes = await userSch.findByIdAndUpdate(req.user.id, { $set: { password: hash, last_password_change_date: new Date() } }, { $new: true });
                  return otherHelper.sendResponse(res, httpStatus.OK, true, dbRes, null, 'Password Change Success', null);
            } else {
                  errors.oldPassword = 'Old Password incorrect';
                  return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, null, null);
            }
      } catch (err) {
            next(err);
      }
};

userController.ResendVerificationCode = async (req, res, next) => {
      try {
            const email = req.body.email.toLowerCase();
            const user = await userSch.findOne({ email });
            if (user) {
                  if (user.email_verified) {
                        return otherHelper.sendResponse(res, httpStatus.OK, true, { email }, null, 'Email Already Verified', null);
                  } else {
                        const currentDate = new Date();
                        const diff = parseInt((currentDate - user.email_verified_request_date) / (1000 * 1)); //in minute
                        if (diff < 10) {
                              return otherHelper.sendResponse(res, httpStatus.OK, true, { email }, null, 'Email Already Sent', null);
                        }
                        const email_verification_code = otherHelper.generateRandomHexString(6);
                        const newUser = await userSch.findOneAndUpdate({ email: email }, { $set: { email_verification_code, email_verified: false, email_verified_request_date: currentDate } }, { new: true });
                        const mailOptions = {
                              to: newUser.email,
                              subject: 'House Rent Service Verification Code',
                              text: `Dear ${newUser.name}, \n \n Your verification code is ${email_verification_code}`
                        };
                        sendMail.send(mailOptions, next)
                        const dataReturn = { email: user.email, name: user.name };
                        return otherHelper.sendResponse(res, httpStatus.OK, true, dataReturn, null, 'Email verification code Resent!!', null);
                  }
            }
      }
      catch (err) {
            next(err);
      }
};

userController.ForgotPassword = async (req, res, next) => {
      try {
            const email = req.body.email.toLowerCase();
            const errors = {};
            const user = await userSch.findOne({ email });
            const data = { email };
            if (!user) {
                  errors.email = 'Email not found';
                  return otherHelper.sendResponse(res, httpStatus.NOT_FOUND, false, data, errors, errors.email, null);
            }
            const currentDate = new Date();
            if (user.password_reset_request_date) {
                  const diff = parseInt((currentDate - user.password_reset_request_date) / (1000 * 60)); //in minute
                  if (diff < 10) {
                        return otherHelper.sendResponse(res, httpStatus.OK, true, { email }, null, 'Email Already Sent, Check your Inbox', null);
                  }
            }
            user.password_reset_code = otherHelper.generateRandomHexString(6);
            user.password_reset_request_date = currentDate;
            const update = await userSch.findByIdAndUpdate(
                  user._id,
                  {
                        $set: {
                              password_reset_code: user.password_reset_code,
                              password_reset_request_date: user.password_reset_request_date,
                        },
                  },
                  { new: true },
            );
            const mailOptions = {
                  to: update.email,
                  subject: 'House Rent Service Password Reset Code',
                  text: `Dear ${user.name}, \n \n Your Password Reset code is ${user.password_reset_code}`
            };
            sendMail.send(mailOptions, next)
            const msg = `Password Reset Code For ${update.email} is sent to email`;
            return otherHelper.sendResponse(res, httpStatus.OK, true, null, null, msg, null);
      } catch (err) {
            next(err);
      }
};

userController.ResetPassword = async (req, res, next) => {
      try {
            let { email, code, password } = req.body;
            email = email.toLowerCase();
            const user = await userSch.findOne({ email, password_reset_code: code });
            const data = { email };
            const errors = {};
            if (!user) {
                  errors.email = 'Invalid Password Reset Code';
                  return otherHelper.sendResponse(res, httpStatus.NOT_FOUND, false, data, errors, errors.email, null);
            }
            let salt = await bcrypt.genSalt(10);
            let hashPw = await bcrypt.hash(password, salt);
            const d = await userSch.findByIdAndUpdate(user._id, { $set: { password: hashPw, last_password_change_date: Date.now(), email_verified: true }, $unset: { password_reset_code: 1, password_reset_request_date: 1 } }, { new: true });
            // Create JWT payload

            const { token, payload } = await userController.validLoginResponse(req, d, next);
            return otherHelper.sendResponse(res, httpStatus.OK, true, payload, null, null, token);
      } catch (err) {
            return next(err);
      }
};

userController.validLoginResponse = async (req, user, next) => {
      try {
            // Create JWT payload
            const payload = {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  email_verified: user.email_verified,
                  roles: user.roles,
                  gender: user.gender,
            };
            // SignIn Token
            let token = await jwt.sign(payload, secretOrKey, {
                  expiresIn: tokenExpireTime,
            });
            loginLogs.addLoginLog(req, token, next);
            token = `Bearer ${token}`;
            return { token, payload };
      } catch (err) {
            next(err);
      }
};

module.exports = userController