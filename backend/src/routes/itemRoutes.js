const express = require('express');
const checkAccessToken = require('../middlewares/authMiddleware'); // Mengimpor middleware
const ItemController = require('../controllers/itemController');

const router = express.Router();

// Menambahkan middleware checkAccessToken sebelum route lainnya
router.get('/', checkAccessToken, ItemController.getItems);
router.get('/:id', checkAccessToken, ItemController.getItemById);
router.post('/new', checkAccessToken, ItemController.createItem);
router.put('/:id', checkAccessToken, ItemController.updateItem);
router.delete('/:id', checkAccessToken, ItemController.deleteItem);

module.exports = router;