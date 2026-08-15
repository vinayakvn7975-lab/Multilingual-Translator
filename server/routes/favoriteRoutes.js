const express = require('express');
const router = express.Router();
const { toggleFavorite, getFavorites, removeFavorite } = require('../controllers/favoriteController');

router.post('/', toggleFavorite);
router.get('/', getFavorites);
router.delete('/:id', removeFavorite);

module.exports = router;
