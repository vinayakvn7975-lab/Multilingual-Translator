const express = require('express');
const router = express.Router();
const { handleTranslate } = require('../controllers/translationController');

router.post('/', handleTranslate);

module.exports = router;
