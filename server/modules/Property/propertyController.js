const httpStatus = require('http-status');
const otherHelper = require('../../helper/others.helper');
const propertySch = require('./propertySchema');
const propertyConfig = require('./propertyConfig');
const propertyController = {};

propertyController.saveProperty = async (req, res, next) => {
    try {
        const property = req.body;
        if (req.files) {
            property.images = req.files
        }
        if (req.files.length == 0) {
            return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, null, 'image field required', null);
        }
        property.added_by = req.user.id
        const new_property = new propertySch(property);
        const new_property_save = await new_property.save();
        return otherHelper.sendResponse(res, httpStatus.OK, true, new_property_save, null, propertyConfig.save, null)
    }
    catch (err) {
        next(err);
    }
}

propertyController.editProperty = async (req, res, next) => {
    try {
        const property = req.body;
        const property_id = req.params.id
        if (req.files) {
            delete property.images
            property.images = req.files
        }
        if (property && property._id) {
            const update = await propertySch.findByIdAndUpdate(property_id, { $set: property }, { new: true });
            return otherHelper.sendResponse(res, httpStatus.OK, true, update, null, propertyConfig.save, null);
        }
    }
    catch (err) {
        next(err);
    }
}

propertyController.getAllProperty = async (req, res, next) => {
    try {
        let { page, size, populate, selectQuery, searchQuery, sortQuery } = otherHelper.parseFilters(req, 10, false);
        const address = req.query.address;
        const propertyType = req.query.propertyType;
        const numberOfRooms = req.query.numberOfRooms;
        const numberOfBathrooms = req.query.numberOfBathrooms;
        const maximum_budget = req.query.maximum_budget;
        const city = req.query.city;
        const parking = req.query.parking;


        if (address) {
            searchQuery = { address: { $regex: address, $options: 'i' }, ...searchQuery };
        }
        if (city) {
            searchQuery = { city: { $regex: city, $options: 'i' }, ...searchQuery };
        }
        if (propertyType) {
            searchQuery = { property_type: { $regex: propertyType, $options: 'i' }, ...searchQuery };
        }
        if (numberOfRooms) {
            searchQuery = { ...searchQuery, numberOfRooms: { $lte: numberOfRooms } };
        }
        if (numberOfBathrooms) {
            searchQuery = { ...searchQuery, numberOfBathrooms: { $gte: numberOfBathrooms } };
        }
        if (maximum_budget) {
            searchQuery = { ...searchQuery, price: { $lte: maximum_budget } };
        }
        if (parking) {
            searchQuery = { ...searchQuery, parking: parking };
        }
        // let pulledData = await otherHelper.getQuerySendResponse(propertySch, page, size, sortQuery, searchQuery, selectQuery, next, populate);
        var pulledData = await propertySch.find(searchQuery);
        return otherHelper.sendResponse(res, httpStatus.OK, true, pulledData, null, propertyConfig.get, null)
        // return otherHelper.paginationSendResponse(res, httpStatus.OK, true, pulledData.data, propertyConfig.gets, page, size, pulledData.totalData);

    } catch (err) {
        next(err);
    }
}

propertyController.getSingleProperty = async (req, res, next) => {
    const propertyId = req.params.property_id
    try {
        var pulledData = await propertySch.findOne({ _id: propertyId, is_active: true, is_deleted: false });
        if (pulledData && pulledData._id) {
            return otherHelper.sendResponse(res, httpStatus.OK, true, pulledData, null, propertyConfig.get, null)
        } else {
            return otherHelper.sendResponse(res, httpStatus.NOT_FOUND, false, null, null, propertyConfig.errorIn.noProperty, null);
        }
    } catch (err) {
        next(err);
    }
}

// propertyController.getPropertyAdmin = async (req, res, next) => {
//     try {
//         let { page, size, populate, selectQuery, searchQuery, sortQuery } = otherHelper.parseFilters(req, 10, false);
//         let pulledData = await otherHelper.getQuerySendResponse(propertySch, page, size, sortQuery, searchQuery, selectQuery, next, populate);
//         return otherHelper.paginationSendResponse(res, httpStatus.OK, true, pulledData.data, propertyConfig.get, page, size, pulledData.totalData);
//     } catch (err) {
//         next(err);
//     }
// }

propertyController.deleteProperty = async (req, res, next) => {
    try {
        const propertyId = req.params.property_id;
        const property = await propertySch.findByIdAndUpdate(
            propertyId, {
            $set: {
                is_deleted: true
            },
        }, { new: true },
        );
        return otherHelper.sendResponse(res, httpStatus.OK, true, property, null, propertyConfig.delete, null)
    }
    catch (err) {
        next(err)
    }
}

propertyController.getAllPropertyOfUser = async (req, res, next) => {
    try {
        const userId = req.user.id
        let { page, size, populate, selectQuery, searchQuery, sortQuery } = otherHelper.parseFilters(req, 10, false);
        searchQuery = { ...searchQuery, is_active: true, added_by: userId }
        var pulledData = await propertySch.find(searchQuery);
        return otherHelper.sendResponse(res, httpStatus.OK, true, pulledData, null, propertyConfig.get, null)
    } catch (err) {
        next(err);
    }
}


// propertyController.changeActiveProperty = async (req, res, next) => {
//     try {
//         const propertyId = req.params.property_id;
//         var value = await propertySch.findOne({ _id: propertyId });
//         var property = await propertySch.findByIdAndUpdate(
//             propertyId, {
//             $set: {
//                 is_active: !value.is_active
//             },
//         }, { new: true },
//         );
//         return otherHelper.sendResponse(res, httpStatus.OK, true, property, null, propertyConfig.is_active, null)
//     }
//     catch (err) {
//         next(err)
//     }
// }

module.exports = propertyController;
