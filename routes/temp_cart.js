// routes/temp_products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/temp_cart'); // 引入商品模型

// 处理POST请求，添加新商品   
router.post('/', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    Special_Requests: req.body.Special_Requests,
    price: req.body.price,
    Number: req.body.Number,
    total: req.body.total,
    id_spc: req.body.id_spc,

  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 处理GET请求，获取商品列表
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // 获取所有商品数据
    res.json(products); // 返回商品数据作为 JSON 响应
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 处理PATCH请求，更新商品价格
router.patch('/:id', async (req, res) => {
  const productId = req.params.id;
  const newPrice = req.body.price;

  try {
    const product = await Product.findByIdAndUpdate(productId, { price: newPrice }, { new: true }); // 更新价格
    res.json(product); // 返回更新后的商品数据作为 JSON 响应

    if (!product) {
      return res.status(404).json({ message: '商品未找到' });
    }

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 处理DELETE请求，删除指定ID的商品
router.delete('/:id', async (req, res) => {
  const productId = req.params.id;
  const productIdToDelete= req.body.productIdToDelete

  try {
      // 从数据库中查找并删除商品
      const deletedProduct = await Product.deleteOne({ _id: productId });

      if (!deletedProduct) {
          // 如果找不到相应的商品
          return res.status(404).json({ message: '商品未找到' });
      }

      res.json({ message: '商品删除成功' });
  } catch (error) {
      res.status(500).json({ message: '服务器错误' });
  }
});







module.exports = router;