const User = require('../models/User');
const bcrypt = require('bcryptjs');

const renderRegister = (req, res) => {
    res.render('auth/register');
};

const handleRegister = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Zásadní novinka: Proaktivně zkontrolujeme, jestli jméno už neexistuje (ignorujeme velikost písmen)
        const existingUser = await User.findOne({ username: new RegExp('^' + username + '$', 'i') });
        if (existingUser) {
            // Místo padnutí a bílé obrazovky pošleme chybovou hlášku zpět do registrace
            return res.render('auth/register', { error: 'Tohle uživatelské jméno už bohužel někdo používá.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        // I nečekané chyby vracíme v hezkém kabátu
        res.render('auth/register', { error: 'Nastala neočekávaná chyba při registraci. Zkuste to znovu.' });
    }
};

const renderLogin = (req, res) => {
    res.render('auth/login');
};

const handleLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Magie pro ignorování velikosti písmen u jména
        const user = await User.findOne({ username: new RegExp('^' + username + '$', 'i') });
        
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = { 
                id: user._id, 
                username: user.username, 
                role: user.role 
            };
            res.redirect('/');
        } else {
            // Tady se teď místo textu na bílé stránce pošle do skleněné karty chybová proměnná
            res.render('auth/login', { error: 'Zadali jste špatné uživatelské jméno nebo heslo.' });
        }
    } catch (error) {
        console.error(error);
        res.render('auth/login', { error: 'Nastala chyba při přihlašování. Zkuste to prosím znovu.' });
    }
};

const handleLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

module.exports = { renderRegister, handleRegister, renderLogin, handleLogin, handleLogout };