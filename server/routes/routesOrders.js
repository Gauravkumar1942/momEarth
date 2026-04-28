const express = require('express');
const router = express.Router();
const fetchOrders = require('../controllers/orders/fetchOrders.js');
const cancelOrders = require('../controllers/orders/cancelOrders.js');
// const checkReview = require('../controllers/orders/checkReviews.js');
const submitReview = require('../controllers/orders/submitReview.js');
const returnOrder = require('../controllers/orders/returnOrder.js');
const insertOrder = require('../controllers/orders/insertOrder.js');
const exchangeOrder = require('../controllers/orders/exchangeOrder.js');


router.post('/', fetchOrders);
router.post('/cancel', cancelOrders);
// router.post('/reviews/check', checkReview);
router.post('/reviews/submit', submitReview);
router.post('/return', returnOrder);
router.post('/exchange', exchangeOrder);
router.post('/insertOrder', insertOrder);
module.exports = router;