const express = require('express');
const router = express.Router();
const fetchRecoOne = require('../controllers/recommended/fetchRecoOne.js');
const fetchRecoTwo = require('../controllers/recommended/fetchRecoTwo.js');
const fetchRecoThree = require('../controllers/recommended/fetchRecoThree.js');
const fetchRecoFour = require('../controllers/recommended/fetchRecoFour.js');

router.post('/one', fetchRecoOne);
router.post('/two', fetchRecoTwo);
router.post('/three', fetchRecoThree);
router.post('/four', fetchRecoFour);

module.exports = router;