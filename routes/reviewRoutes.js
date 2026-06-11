const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/teachers/:id/reviews', requireAuth, reviewController.handleAddReview);

module.exports = router;