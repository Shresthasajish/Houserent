const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  phone: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  date_of_birth: { type: Date },
  email_verification_code: { type: String },
  email_verified: { type: Boolean, required: true, default: false },
  email_verified_request_date: { type: Date },
  password_reset_code: { type: String },
  password_reset_request_date: { type: Date },
  added_at: { type: Date, default: Date.now, required: true },
  is_active: { type: Boolean, required: true, default: true },
  cover_profile_picture: { type: schema.Types.Mixed },
  profile_picture: { type: schema.Types.Mixed },
  roles: { type: String, enum: ['normal-user', 'super-admin'] },
});

module.exports = User = mongoose.model('users', userSchema);
