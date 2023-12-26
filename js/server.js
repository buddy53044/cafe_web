// server.js
var mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
 
//將request進來的 data 轉成 json()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// 監聽於 8080 端口
app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});


// db

// host、user、password 請更換成自己的
var mc = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    insecureAuth : true
});

mc.connect();


app.get('/show', function (req, res) {
    // 是為了修復 CORS 的問題而設
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    mc.query('SELECT * FROM 0805_schema.product_list', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'products list.' });
    });
});