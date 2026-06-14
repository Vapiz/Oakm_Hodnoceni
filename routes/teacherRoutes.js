const express = require('express');
const router = express.Router();
const multer = require('multer');
const teacherController = require('../controllers/teacherController');
const { requireAdmin } = require('../middlewares/adminMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', teacherController.getTeachers);
router.get('/teachers/:id', teacherController.getTeacherDetail);

router.get('/admin/add-teacher', requireAdmin, teacherController.renderAddTeacher);
router.post('/admin/add-teacher', requireAdmin, upload.single('image'), teacherController.handleAddTeacher);

router.get('/admin/edit-teacher/:id', requireAdmin, teacherController.renderEditTeacher);
router.put('/admin/edit-teacher/:id', requireAdmin, upload.single('image'), teacherController.handleEditTeacher);

router.delete('/admin/delete-teacher/:id', requireAdmin, teacherController.handleDeleteTeacher);

module.exports = router;