const Teacher = require('../models/Teacher');
const Review = require('../models/Review');

const getTeachers = async (req, res) => {
    try {
        let query = {};
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            query = { $or: [{ name: searchRegex }, { subjects: searchRegex }] };
        }
        
        let teachers = await Teacher.find(query).lean();

        for (let teacher of teachers) {
            const reviews = await Review.find({ teacher: teacher._id });
            
            if (reviews.length > 0) {
                const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
                teacher.averageRating = parseFloat((sum / reviews.length).toFixed(1));
                teacher.displayRating = `${teacher.averageRating} / 5`;
            } else {
                teacher.averageRating = 0;
                teacher.displayRating = 'Zatím nehodnoceno';
            }

            if (teacher.image && teacher.image.data) {
                teacher.imageBase64 = `data:${teacher.image.contentType};base64,${teacher.image.data.toString('base64')}`;
            }
        }

        teachers.sort((a, b) => b.averageRating - a.averageRating);

        res.render('teachers/index', { teachers, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při načítání učitelů');
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).send('Učitel nenalezen');

        const reviews = await Review.find({ teacher: teacher._id }).populate('user', 'username').sort({ createdAt: -1 });

        let averageRating = 0;
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
            averageRating = (sum / reviews.length).toFixed(1);
        }

        let imageBase64 = null;
        if (teacher.image && teacher.image.data) {
            imageBase64 = `data:${teacher.image.contentType};base64,${teacher.image.data.toString('base64')}`;
        }

        res.render('teachers/detail', { teacher, reviews, averageRating, user: req.session.user, imageBase64 });
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při načítání detailu');
    }
};

const renderAddTeacher = (req, res) => {
    res.render('admin/addTeacher', { user: req.session.user });
};

const handleAddTeacher = async (req, res) => {
    try {
        const { name, subjects } = req.body;
        const subjectsArray = subjects.split(',').map(s => s.trim());
        
        let newTeacherData = { name, subjects: subjectsArray };
        
        if (req.file) {
            newTeacherData.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        const teacher = new Teacher(newTeacherData);
        await teacher.save();
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při přidávání učitele');
    }
};

const renderEditTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        
        let imageBase64 = null;
        if (teacher.image && teacher.image.data) {
            imageBase64 = `data:${teacher.image.contentType};base64,${teacher.image.data.toString('base64')}`;
        }

        res.render('admin/editTeacher', { teacher, user: req.session.user, imageBase64 });
    } catch (error) {
        res.status(500).send('Chyba při načítání úpravy');
    }
};

const handleEditTeacher = async (req, res) => {
    try {
        const { name, subjects } = req.body;
        const subjectsArray = subjects.split(',').map(s => s.trim());
        
        let updateData = { name, subjects: subjectsArray };
        
        if (req.file) {
            updateData.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        await Teacher.findByIdAndUpdate(req.params.id, updateData);
        res.redirect(`/teachers/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při úpravě učitele');
    }
};

const handleDeleteTeacher = async (req, res) => {
    try {
        await Teacher.findByIdAndDelete(req.params.id);
        await Review.deleteMany({ teacher: req.params.id }); 
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Chyba při mazání učitele');
    }
};

module.exports = {
    getTeachers, getTeacherDetail, renderAddTeacher, 
    handleAddTeacher, renderEditTeacher, handleEditTeacher, handleDeleteTeacher
};