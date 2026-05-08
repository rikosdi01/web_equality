const express = require('express');
const EqualityController = require('../controllers/equalityController');
const checkAccessToken = require('../middlewares/authMiddleware'); // Mengimpor middleware

const router = express.Router();

// Menambahkan middleware checkAccessToken sebelum route lainnya
router.get('/search', checkAccessToken, EqualityController.searchEqualities);
router.get('/', checkAccessToken, EqualityController.getEqualities);
router.get('/:id', checkAccessToken, EqualityController.getEqualityById);
router.post('/new', checkAccessToken, EqualityController.createEquality);
router.put('/:id', checkAccessToken, EqualityController.updateEquality);
router.delete('/:id', checkAccessToken, EqualityController.deleteEquality);

module.exports = router;