const express = require('express');
const router = express.Router();
const fetchByPid = require('../controllers/fetchByPid.js');
const fetchByBrand = require('../controllers/fetchByBrand.js');
const fetchByType = require('../controllers/fetchByType.js');
const fetchBySearch = require('../controllers/fetchBySearch.js');
const fetchReview = require('../controllers/fetchReview.js');


router.get('/pid/:pid', fetchByPid);
router.get('/brand/:brand', fetchByBrand);
router.get('/type/:productType', fetchByType);
router.post('/search', fetchBySearch);
router.get('/review/:pid', fetchReview);
module.exports = router;