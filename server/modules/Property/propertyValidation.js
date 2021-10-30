const httpStatus = require('http-status');
const propertyConfig = require('./propertyConfig')
const sanitizeHelper = require('./../../helper/sanitize.helper');
const validateHelper = require('./../../helper/validate.helper');
const otherHelper = require('./../../helper/others.helper');
const isEmpty = require('./../../validation/isEmpty');
const validation = {};

validation.sanitize = (req, res, next) => {
    const sanitizeArray = [
        {
            field: 'state',
            sanitize: {
                trim: true
            },
        },
        {
            field: 'contact_person_name',
            sanitize: {
                trim: true
            },
        },
        {
            field: 'city',
            sanitize: {
                trim: true
            },
        },
        {
            field: 'address',
            sanitize: {
                trim: true
            },
        },
        {
            field: 'mobile_number',
            sanitize: {
                trim: true
            },
        },
        {
            field: 'numberOfRooms',
            sanitize: {
                trim: true
            },
        },
        {
            field: 'price',
            sanitize: {
                trim: true,
            },
        },
        {
            field: 'email',
            sanitize: {
                trim: true
            },
        },
        {
            field: 'numberOfBathrooms',
            sanitize: {
                trim: true
            },
        },
        {
            field: 'property_type',
            sanitize: {
                trim: true
            },
        },
        {
            field: 'waterSupply',
            sanitize: {
                trim: true
            },
        },
        {
            field: 'parking',
            sanitize: {
                trim: true
            },
        },
        {
            field: 'description',
            sanitize: {
                trim: true
            },
        },
    ];
    sanitizeHelper.sanitize(req, sanitizeArray)
    next();
}

validation.validate = (req, res, next) => {
    const data = req.body;
    const validateArray = [
        {
            field: 'state',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: propertyConfig.validate.empty,
                },
            ],
        },
        {
            field: 'contact_person_name',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: propertyConfig.validate.empty,
                },
            ],
        },
        {
            field: 'city',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: propertyConfig.validate.empty,
                },
            ],
        },
        {
            field: 'address',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: propertyConfig.validate.empty,
                },
            ],
        },
        {
            field: 'mobile_number',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: propertyConfig.validate.empty,
                },
            ],
        },
        {
            field: 'email',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: propertyConfig.validate.empty,
                },
                {
                    condition: 'IsEmail',
                    msg: propertyConfig.validate.email,
                },
            ],
        },
        {
            field: 'price',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: propertyConfig.validate.empty,
                },
            ],
        },
        {
            field: 'description',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: propertyConfig.validate.empty,
                },
            ],
        },
        {
            field: 'property_type',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: propertyConfig.validate.empty,
                },
            ],
        },
        {
            field: 'numberOfRooms',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: propertyConfig.validate.empty,
                },
                {
                    condition: 'IsInt',
                    msg: propertyConfig.validate.isInt,
                },
            ],
        },
        {
            field: 'numberOfBathrooms',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: propertyConfig.validate.empty,
                },
                {
                    condition: 'IsInt',
                    msg: propertyConfig.validate.isInt,
                },
            ],
        },
        {
            field: 'waterSupply',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: propertyConfig.validate.empty,
                },
            ],
        },
        {
            field: 'parking',
            validate: [
                {
                    condition: 'IsEmpty',
                    msg: propertyConfig.validate.empty,
                },
            ],
        }
    ];
    var errors = validateHelper.validation(data, validateArray);
    if (!isEmpty(errors)) {
        return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, propertyConfig.errorIn.inputErrors, null);
    } else {
        next();
    }
};
module.exports = validation