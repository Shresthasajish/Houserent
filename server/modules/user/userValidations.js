const httpStatus = require('http-status');
const isEmpty = require('../../validation/isEmpty');
const config = require('./userConfig');
const otherHelper = require('../../helper/others.helper');
const sanitizeHelper = require('../../helper/sanitize.helper');
const validateHelper = require('../../helper/validate.helper');
const userSch = require('./userSchema');
const validations = {};

validations.sanitizeRegister = (req, res, next) => {
  const sanitizeArray = [
    {
      field: 'name',
      sanitize: {
        trim: true,
      },
    },
    {
      field: 'phone',
      sanitize: {
        trim: true,
      },
    },
    {
      field: 'email',
      sanitize: {
        trim: true,
      },
    },
    {
      field: 'password',
      sanitize: {
        trim: true,
      },
    },
    {
      field: 'gender',
      sanitize: {
        trim: true,
      },
    },
    {
      field: 'date_of_birth',
      sanitize: {
        trim: true,
      },
    },
  ];
  sanitizeHelper.sanitize(req, sanitizeArray);
  next();
};

validations.validateRegister = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: 'name',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
        {
          condition: 'IsLength',
          msg: config.validate.nameLength,
          option: { min: 2, max: 30 },
        },
      ],
    },
    {
      field: 'email',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
        {
          condition: 'IsEmail',
          msg: config.validate.isEmail,
        },
      ],
    },
    {
      field: 'phone',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: 'password',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
        {
          condition: 'IsLength',
          msg: config.validate.passLength,
          option: { min: 6, max: 30 },
        },
      ],
    },
  ];
  let errors = validateHelper.validation(data, validateArray);

  let key_filter = { is_deleted: false, email: data.email }
  if (data._id) {
    key_filter = { ...key_filter, _id: { $ne: data._id } }
  }
  const already_key = await userSch.findOne(key_filter);
  if (already_key && already_key._id) {
    errors = { ...errors, email: 'email already exist' }
  }
  if (!isEmpty(errors)) {
    return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, config.validate.invalidInput, null);
  } else {
    next();
  }
};

validations.sanitizeLogin = (req, res, next) => {
  const sanitizeArray = [
    {
      field: 'email',
      sanitize: {
        trim: true,
      },
    },
    {
      field: 'password',
      sanitize: {
        trim: true,
      },
    }
  ];
  sanitizeHelper.sanitize(req, sanitizeArray);
  next();
};

validations.validateLogin = (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: 'email',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
        {
          condition: 'IsEmail',
          msg: config.validate.isEmail,
        },
      ],
    },
    {
      field: 'password',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
        {
          condition: 'IsLength',
          msg: config.validate.passLength,
        },
      ],
    },
  ];
  const errors = validateHelper.validation(data, validateArray);
  if (!isEmpty(errors)) {
    return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, config.validate.invalidInput, null);
  } else {
    next();
  }
};

validations.sanitizeChangePassword = (req, res, next) => {
  const sanitizeArray = [
    {
      field: 'oldPassword',
      sanitize: {
        trim: true,
      },
    },
    {
      field: 'newPassword',
      sanitize: {
        trim: true,
      },
    }
  ];
  sanitizeHelper.sanitize(req, sanitizeArray);
  next();
};

validations.validateChangePassword = (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: 'oldPassword',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        }
      ],
    },
    {
      field: 'newPassword',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
        {
          condition: 'IsLength',
          msg: config.validate.passLength,
          option: { min: 6, max: 30 },
        },
      ],
    },
  ];
  const errors = validateHelper.validation(data, validateArray);
  if (!isEmpty(errors)) {
    return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, config.validate.invalidInput, null);
  } else {
    next();
  }
};

module.exports = validations;
