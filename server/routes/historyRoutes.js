const express = require('express');
const router = express.Router();
const { getHistory, deleteHistoryItem, clearAllHistory } = require('../controllers/historyController');

router.get('/', getHistory);
router.delete('/:id', deleteHistoryItem);
router.delete('/', clearAllHistory);

module.exports = router;
