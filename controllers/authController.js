const User = require('../models/User');
const bcrypt = require('bcryptjs');

const renderRegister = (req, res) => {
    res.render('auth/register');
};

const handleRegister = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při registraci (možná jméno už existuje)');
    }
};

const renderLogin = (req, res) => {
    res.render('auth/login');
};

const handleLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = { 
                id: user._id, 
                username: user.username, 
                role: user.role 
            };
            res.redirect('/');
        } else {
            res.status(401).send('Špatné jméno nebo heslo');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při přihlašování');
    }
};

const handleLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

module.exports = { renderRegister, handleRegister, renderLogin, handleLogin, handleLogout };