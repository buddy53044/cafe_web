// 在主文件中导入 Product 模型
const mongoose = require('mongoose');
const Product = require('./models/product'); // 假设模型文件位于正确的相对路径

// 连接到MongoDB数据库
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to the database');
});

// 监听按钮点击事件 deleteTest
document.getElementById('deleteTest').addEventListener('click', function () {
  // 获取要删除的商品ID
  const productIdToDelete = "6594487783a2a8ffc1b1e5c1";

  // 使用 Product 模型执行删除操作
  Product.deleteOne({
    _id: productIdToDelete,
    name: "t",
    price: 131,
    __v: 0
  }, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log(`Deleted product with ID: ${productIdToDelete}`);
    }
  });
});
