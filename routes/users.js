var express = require('express');
var router = express.Router();
const Product = require('../models/users'); // 引入User模型

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


// 路由处理函数，例如获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await Product.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 路由处理函数，例如添加新用户
router.post("/", async (req, res) => {
  const product = new Product({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Product.findOne({ username, password });
      if (user) {
        req.session.user = user;
        console.log("req.session.user",req.session.user);
        // console.log("user.body",user.body);
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Example route to check if a user is logged in
router.get('/check-login', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});


module.exports = router;
