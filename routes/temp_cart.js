// routes/temp_products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/temp_cart'); // 引入商品模型

// 处理POST请求，添加新商品    working
// router.post('/', async (req, res) => {
//   const product = new Product({
//     name: req.body.name,
//     Special_Requests: req.body.Special_Requests,
//     price: req.body.price,
//     Number: req.body.Number,
//     total: req.body.total,
//     id_spc: req.body.id_spc,

//   });

//   try {
//     const newProduct = await product.save();
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

router.post("/", async (req, res) => {
  const { name, price, Special_Request, Number, total } = req.body;
  try {
    // 查找資料庫中是否已經存在該商品
    const existingProduct = await Product.findOne({ name: name });

    if (existingProduct) {
      // 如果存在，則更新價格和數量
      await Product.findOneAndUpdate(
        { name: name },
        { price: price, Number: Number, total: total ,Special_Request: Special_Request },
        { new: true }
      );
      res.status(200).json({ message: "商品更新成功！" });
    } else {
      // 如果不存在，則創建一個新的文檔
      const product = new Product({
        name: name,
        price: price,
        Special_Request: Special_Request,
        Number: Number,
        total: total,
      });
      const newProduct = await product.save();
      res.status(201).json(newProduct);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/clear', async (req, res) => {
  try {
    // 使用 deleteMany 刪除 Temp_cart 中的所有文檔
    const result = await Product.deleteMany({});
    res.json({ message: 'Temp_cart 內容已清空' });
  } catch (error) {
    res.status(500).json({ message: '清空 Temp_cart 內容時出現錯誤' });
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

// 处理PATCH请求，更新商品數量及總價
router.patch('/:id', async (req, res) => {
  const productId = req.params.id;
  // const productId = req.body.id_spc;
  const Special_Request = req.body.Special_Request;
  const newNumber = req.body.Number;
  const newTotal = req.body.total;

  try {
    const product = await Product.findByIdAndUpdate(productId, {Special_Request:Special_Request, Number: newNumber ,total:newTotal}, { new: true }); // 更新价格
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