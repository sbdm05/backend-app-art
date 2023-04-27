const express = require('express');
const router = express.Router();

const { getQuestions } = require('../controllers/flash.js');

router.post('', getQuestions);


module.exports = router;