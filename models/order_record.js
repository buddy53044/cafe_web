const mongoose = require("mongoose");
const moment = require("moment-timezone");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
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
  note: {
    type: String,
    required: false,
  },
  content: {
    type: Array,
    required: true,
  },

  id_spc: {
    type: String,
    default: function () {
      // 使用前綴加上轉換後的 _id 作為唯一標識符，避免特殊字符和空格
      const prefix = "id_spc_";
      const alphanumericId = this._id.toString().replace(/\W/g, ""); // 移除非字母數字字符
      return `${prefix}${alphanumericId}`;
    },
  },

  createdAt: {
    type: String,
    default: function () {
      return moment.tz("Asia/Taipei").format("YYYY/MM/DD HH:mm");
    },
  },
});

module.exports = mongoose.model("order_record", productSchema);
