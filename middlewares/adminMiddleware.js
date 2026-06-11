const requireAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Přístup odepřen. Tuto stránku může vidět pouze administrátor.');
};

module.exports = { requireAdmin };