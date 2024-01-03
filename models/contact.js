const mongoose = require("mongoose");
const moment = require("moment-timezone");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },

  createdAt: {
    type: String,
    default: function () {
      return moment.tz("Asia/Taipei").format("YYYY/MM/DD HH:mm");
    }, // 使用函数来设置默认值为台湾时区的当前时间
  },
});

module.exports = mongoose.model("contact", productSchema);
