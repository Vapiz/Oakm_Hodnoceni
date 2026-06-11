const Review = require('../models/Review');

const handleAddReview = async (req, res) => {
    try {
        const { rating } = req.body;
        const teacherId = req.params.id;
        const userId = req.session.user.id;

        const review = new Review({
            teacher: teacherId,
            user: userId,
            rating: Number(rating)
        });

        await review.save();
        res.redirect(`/teachers/${teacherId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při přidávání recenze');
    }
};

module.exports = { handleAddReview };