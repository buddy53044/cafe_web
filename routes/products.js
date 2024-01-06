// routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/products"); // 引入商品模型
const multer = require("multer");
const path = require("path");

// 处理POST请求，添加新商品
router.post("/", async (req, res) => {
  const product = new Product({
    type: req.body.type,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    short_description: req.body.short_description,
    price: req.body.price,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 处理GET请求，获取商品列表
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // 获取所有商品数据
    res.json(products); // 返回商品数据作为 JSON 响应
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 处理PATCH请求，更新商品内容
router.patch("/:id", async (req, res) => {
  const productId = req.params.id;

  try {
      // 确保商品存在于数据库中
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
          return res.status(404).json({ message: "商品未找到" });
      }

      // 更新商品内容
      if (req.body.name && req.body.name.trim() !== "") {
          existingProduct.name = req.body.name;
          existingProduct.name_nospace = existingProduct.name.replace(/\s+/g, "_");
      }

      if (!isNaN(req.body.price) && req.body.price.trim() !== "") {
          existingProduct.price = req.body.price;
      }

      if (req.body.type && req.body.type.trim() !== "") {
          existingProduct.type = req.body.type;
      }

      if (req.body.short_description && req.body.short_description.trim() !== "") {
          existingProduct.short_description = req.body.short_description;
      }

      if (req.body.description && req.body.description.trim() !== "") {
          existingProduct.description = req.body.description;
      }

      // 保存更新后的商品
      const updatedProduct = await existingProduct.save();

      res.json(updatedProduct); // 返回更新后的商品数据作为 JSON 响应
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});




// 处理DELETE请求，删除指定ID的商品
router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  const productIdToDelete = req.body.productIdToDelete;

  try {
    // 从数据库中查找并删除商品
    const deletedProduct = await Product.deleteOne({ _id: productId });

    if (!deletedProduct) {
      // 如果找不到相应的商品
      return res.status(404).json({ message: "商品未找到" });
    }

    res.json({ message: "商品删除成功" });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
});


// 設置multer存儲
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, '../public/img'); // 指定存儲目錄，確保該目錄存在
    // cb(null, 'D:\\CodeData\\112-1\\cafe_web\\public\\img'); // 確定可行
    const uploadPath = path.join(__dirname, "../public/img/menu");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // cb(null, productName + '-' + Date.now() + path.extname(file.originalname));
    cb(null,file.originalname);
  },
});

// 使用multer初始化，配置存儲
const upload = multer({ storage: storage });

// 處理文件上傳
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // 文件上傳成功，執行相關操作
    filename = req.body.name; // 使用 req.body.name 而非 req.name
    console.log(filename);
    res.send("文件上傳成功");
  } catch (error) {
    console.error("Error handling file upload:", error.message);
    res.status(500).send("文件上傳失敗，請重試。");
  }
});

module.exports = router;
