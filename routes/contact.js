const express = require("express");
const router = express.Router();
const Product = require("../models/contact"); // 引入模型

// 处理POST请求，添加新message
router.post("/", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    message: req.body.message,
  });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 处理GET请求，获取connection列表
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // 获取所有商品数据
    res.json(products); // 返回商品数据作为 JSON 响应
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;