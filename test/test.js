const express = require('express');
const admin = require('firebase-admin');

// 初始化Express应用
const app = express();
app.use(express.json()); // 用于解析JSON格式的请求体

// 初始化Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    // 您需要将以下字段替换为您的Firebase Admin SDK的实际配置
    apiKey: "AIzaSyBFxXemKEJRW_X7nS1NnrDBZXWye8km0s4",
    authDomain: "cafe-web-e93a9.firebaseapp.com",
    projectId: "cafe-web-e93a9",
    storageBucket: "cafe-web-e93a9.appspot.com",
    messagingSenderId: "755176808542",
    appId: "1:755176808542:web:ca57d4699f0871504294cf"
  }),
  databaseURL: "https://cafe-web-e93a9-default-rtdb.asia-southeast1.firebasedatabase.app"
});



// 获取数据库实例
const database = admin.database();

// 定义REST API的端点

// 获取数据
app.get('/items', (req, res) => {
  const ref = database.ref('/items');
  ref.once('value', (snapshot) => {
    res.json(snapshot.val());
  }, (error) => {
    res.status(500).json({ error: error.message });
  });
});

// 添加数据
app.post('/', (req, res) => {
  const newItemRef = database.ref('/').push();
  newItemRef.set(req.body, (error) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(201).json({ id: newItemRef.key });
    }
  });
});

// 更新数据
app.put('/items/:id', (req, res) => {
  const itemRef = database.ref('/items').child(req.params.id);
  itemRef.update(req.body, (error) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({ message: 'Item updated successfully' });
    }
  });
});

// 删除数据
app.delete('/items/:id', (req, res) => {
  const itemRef = database.ref('/items').child(req.params.id);
  itemRef.remove((error) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({ message: 'Item deleted successfully' });
    }
  });
});

// 设置监听端口
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
