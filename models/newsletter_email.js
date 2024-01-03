// models/newsletter_email.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  email: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('newsletter_email', productSchema);
