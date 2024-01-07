var express = require('express');
var router = express.Router();

const Newsletter_email = require('../models/newsletter_email'); // 引入商品模型

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Exprindexless' });
});


// footer_Newsletter_email with post
router.post('/Newsletter', async (req, res) => {
  const newsletter_email = new Newsletter_email({
    email: req.body.email,
  });

  try {
    const Save_newsletter_email = await newsletter_email.save();
    res.status(201).json(Save_newsletter_email);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;
