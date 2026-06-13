const Review = require('../models/Review');

const addReview = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).send('Pro přidání recenze musíte být přihlášeni.');
        }

        const teacherId = req.params.id;
        const { rating, comment } = req.body;
        
        const newReview = new Review({
            teacher: teacherId,
            user: req.session.user.id,
            rating: parseInt(rating),
            comment: comment
        });

        await newReview.save();
        res.redirect(`/teachers/${teacherId}`);
    } catch (error) {
        res.status(500).send('Chyba při přidávání hodnocení.');
    }
};

const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const teacherId = req.body.teacherId; 

        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/teachers/${teacherId}`);
    } catch (error) {
        res.status(500).send('Nastala chyba při mazání recenze.');
    }
};

module.exports = {
    addReview,
    deleteReview
};