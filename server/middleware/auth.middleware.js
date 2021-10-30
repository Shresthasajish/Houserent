'use strict';
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status');
const loginLogSch = require('../modules/loginlogs/loginlogSchema');
const otherHelper = require('../helper/others.helper');
const { secretOrKey } = require('../config/keys');
const authMiddleware = {};

authMiddleware.authentication = async (req, res, next) => {
  try {
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization || req.headers.token;
    if (token && token.length) {
      token = token.replace('Bearer ', '');
      const tokenData = await jwt.verify(token, secretOrKey);
      req.user = tokenData;
      let passed = await loginLogSch.findOne({ token, is_active: true });
      if (passed) {
        return next();
      } else {
        return otherHelper.sendResponse(res, HttpStatus.UNAUTHORIZED, false, null, null, 'Session Expired', null);
      }
    }
    return otherHelper.sendResponse(res, HttpStatus.UNAUTHORIZED, false, null, token, 'token not found', null);
  } catch (err) {
    return next(err);
  }
};

authMiddleware.authenticationForLogout = async (req, res, next) => {
  try {
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization || req.headers.token;
    if (token && token.length) {
      token = token.replace('Bearer ', '');
      const d = await jwt.verify(token, secretOrKey);
      req.user = d;
      return next();
    }
    return otherHelper.sendResponse(res, HttpStatus.UNAUTHORIZED, false, null, token, 'token not found', null);
  } catch (err) {
    return next(err);
  }
};

authMiddleware.authorization = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.roles = 'super-admin') {
      return next()
    } else {
      return otherHelper.sendResponse(res, HttpStatus.UNAUTHORIZED, false, null, null, 'Unauthorize Access', null);
    }
  }
  catch (err) {
    next(err);
  }
}





module.exports = authMiddleware;
