const httpStatus = require('http-status');
const otherHelper = require('../../helper/others.helper');
const favoritesConfig = require('./favoriteConfig');
const favoriteSch = require('./favoriteSchema');
let favoriteController = {};




favoriteController.addFavorite = async (req, res, next) => {
    try {
        const propertyId = req.body.property_id
        const propertyStatus = req.body.status
        const userId = req.user.id
        const value = await favoriteSch.findOne({ added_by: userId })
        if (value) {
            const favId = value._id
            const favProperty = value.array_of_property
            if (propertyStatus) {
                const temp = favProperty.includes(propertyId);
                if (temp) {
                    return otherHelper.sendResponse(res, httpStatus.OK, true, value, null, 'this property is already in your property favorite list', null);
                } else {
                    let pulledData = await favoriteSch.findByIdAndUpdate({ _id: favId }, { $push: { array_of_property: propertyId } }, { new: true });
                    return otherHelper.sendResponse(res, httpStatus.OK, true, pulledData, null, 'property added to favorite list', null);
                }
            } else {
                var propertyIndex = favProperty.indexOf(propertyId)
                favProperty.splice(propertyIndex, 1)
                value.array_of_property = favProperty
                let pulledData = await favoriteSch.findByIdAndUpdate({ _id: favId }, { $set: value }, { new: true });
                return otherHelper.sendResponse(res, httpStatus.OK, true, pulledData, null, 'property is removed from favorite list', null);
            }
        } else if (propertyStatus) {
            const favorite = {}
            favorite.added_by = userId;
            favorite.array_of_property = [propertyId]
            const new_favorite = new favoriteSch(favorite);
            const new_favorite_save = await new_favorite.save();
            return otherHelper.sendResponse(res, httpStatus.OK, true, new_favorite_save, null, favoritesConfig.save, null);
        }
    }
    catch (err) {
        next(err)
    }
}

favoriteController.getAllFavoriteUsers = async (req, res, next) => {
    try {
        let { page, size, populate, selectQuery, searchQuery, sortQuery } = otherHelper.parseFilters(req, 10, false);
        populate = [{ path: 'array_of_property', select: 'images address contact_person_name address email mobile_number ' }]
        let pulledData = await otherHelper.getQuerySendResponse(favoriteSch, page, size, sortQuery, searchQuery, selectQuery, next, populate);
        return otherHelper.paginationSendResponse(res, httpStatus.OK, true, pulledData.data, favoritesConfig.get, page, size, pulledData.totalData);
    } catch (err) {
        next(err);
    }
}

favoriteController.getSingleFavoriteByUser = async (req, res, next) => {
    const userId = req.user.id
    try {
        var pulledData = await favoriteSch.findOne({ added_by: userId }).populate({ path: 'array_of_property', select: 'images address contact_person_name address email mobile_number price property_type' });
        if (pulledData && pulledData._id) {
            return otherHelper.sendResponse(res, httpStatus.OK, true, pulledData, null, favoritesConfig.get, null)
        } else {
            return otherHelper.sendResponse(res, httpStatus.NOT_FOUND, false, null, null, 'no favorite list', null);
        }
    } catch (err) {
        next(err);
    }
}


module.exports = favoriteController;

