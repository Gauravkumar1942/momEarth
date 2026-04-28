const express = require('express');
const router = express.Router();
const fetchWishlistedProduct = require('../controllers/fetchWishlistedProduct.js');

router.post('/', fetchWishlistedProduct);
module.exports = router;