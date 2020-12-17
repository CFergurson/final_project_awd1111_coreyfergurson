const express = require('express');
const debug = require('debug')('app:routes:group');
const db = require('../db');

const router = express.Router();

router.get('/login', async (req, res, next) => {
  res.render('login', { title: 'login' });
});
module.exports = router;