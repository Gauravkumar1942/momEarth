const express = require('express');
const router = express.Router();

const fetchCart  = require('../controllers/fetchCart.js');
const AddToCart = require('../controllers/AddToCart.js');
const RemoveFromCart = require('../controllers/RemoveFromCart.js');
const InCart = require('../controllers/InCart.js');

router.get('/', fetchCart);
router.post('/add', AddToCart);
router.delete('/remove', RemoveFromCart);
router.post('/check/:pid', InCart);

module.exports = router;