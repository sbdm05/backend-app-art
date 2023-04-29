const express = require('express');
const router = express.Router();

const { getQuestions, onPrompt } = require('../controllers/flash.js');

router.post('', getQuestions);
router.post('/prompt', onPrompt);


module.exports = router;