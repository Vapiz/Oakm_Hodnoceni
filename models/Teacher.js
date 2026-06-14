const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subjects: [{ type: String }],
    image: {
        data: Buffer,
        contentType: String
    }
});

module.exports = mongoose.model('Teacher', teacherSchema);