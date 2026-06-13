const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/teachers/:id/reviews', reviewController.addReview);
router.delete('/reviews/:id', reviewController.deleteReview);

module.exports = router;