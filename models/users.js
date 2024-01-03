// user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  // 其他用户属性
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
