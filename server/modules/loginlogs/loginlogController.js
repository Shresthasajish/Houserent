const loginLogSch = require('./loginlogSchema');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const otherHelper = require('../../helper/others.helper');
const { secretOrKey } = require('../../config/keys');
const internal = {};
const loginLogController = {};

internal.addLoginLog = async (req, token, next) => {
  try {
    let jwtPayLoad = await jwt.verify(token, secretOrKey);
    let expires_in = new Date(jwtPayLoad.exp * 1000);
    let user_id = jwtPayLoad.id;
    const newLog = new loginLogSch({ user_id, expires_in, token });
    return newLog.save();
  } catch (err) {
    next(err);
  }
};

loginLogController.logout = async (req, res, next) => {
  try {
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization || req.headers.token;
    token = token.replace('Bearer ', '');
    let inactiveLog = await loginLogSch.findOneAndUpdate({ token }, { $set: { is_active: false, logout_date: Date.now() } });
    if (inactiveLog) {
      return otherHelper.sendResponse(res, httpStatus.OK, true, null, null, 'Logged out', null);
    } else {
      return otherHelper.sendResponse(res, httpStatus.OK, false, null, null, 'Logged out', null);
    }
  } catch (err) {
    next(err);
  }
};
loginLogController.RemoveToken = async (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization || req.headers.token;
  token = token.replace('Bearer ', '')
  let passed = await loginLogSch.findOne({ token, is_active: true });
  if (passed) {
    passed.is_active = false
    await loginLogSch.findByIdAndUpdate(passed._id, { $set: passed })
  }
  return next()
}

loginLogController.removeTokenLogout = async (req, res, next) => {
  let { loginID } = req.body;
  let found;
  try {
    found = await loginLogSch.findOneAndUpdate({ _id: loginID, user_id: req.user.id }, { $set: { is_active: false, logout_date: Date.now() } }, { new: true }).select('login_date logout_date ip_address device_info browser_info is_active');
  } catch (err) {
    next(err);
  }
  if (found) {
    return otherHelper.sendResponse(res, httpStatus.OK, true, found, null, 'Logged out', null);
  } else {
    return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, null, 'Invalid Data', null);
  }
};

module.exports = { internal, loginLogController };
