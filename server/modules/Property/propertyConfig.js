var { fileSizes } = require('../../config/keys');
fileSizes = (fileSizes / (1024 * 1024)).toFixed(2);
module.exports = {
    validate: {
        empty: 'This field is required',
        nameLength: 'The length should be between 3 to 50',
        descriptionLength: 'The length should be between 5 to 200',
        keyLength: 'The length should be between 2 to 20',
        isDate: 'Please input date type data',
        isEmail: 'please enter valid email Id',
        isInt: 'input must be integer'
    },
    errorIn: {
        inputErrors: "Input errors",
        noProperty: "We dont have such property",
        fileSizeLimitExceed: `file size must be less than ${fileSizes}MB`,

    },
    get: 'property get successful!!',
    save: 'property save successful',
    gets: 'property get successful',
    delete: 'property deleted successfully!!',
    is_active: 'property is_active changed successfully!!',
};