const mongoose = require('mongoose');
const schema = mongoose.Schema;

const favoriteSchema = new schema({
    array_of_property: [{ type: schema.Types.ObjectId, ref: 'property' }],
    is_deleted: { type: Boolean, required: true, default: false },
    added_at: { type: Date, default: Date.now },
    added_by: { type: schema.Types.ObjectId, ref: 'users' },
});

module.exports = favorite = mongoose.model('favorite', favoriteSchema);
