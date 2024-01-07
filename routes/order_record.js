// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/order_record'); // 引入商品模型

// 处理POST请求，添加新商品   
router.post('/', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    note: req.body.note,
    content: req.body.content
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
    // 确保请求体中有有效的price字段
    if (!newPrice || isNaN(newPrice)) {
      return res.status(400).json({ message: '无效的价格' });
    }

    // 确保商品存在于数据库中
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: '商品未找到' });
    }

    // 更新价格和name_nospace字段
    existingProduct.price = newPrice;
    existingProduct.name_nospace = existingProduct.name.replace(/\s+/g, '_');

    // 保存更新后的商品
    const updatedProduct = await existingProduct.save();

    res.json(updatedProduct); // 返回更新后的商品数据作为 JSON 响应

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
