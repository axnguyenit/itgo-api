const Class = require('../models/Class');

const ClassController = {
	// [GET] /api/classes/:id --> courseId
	async getStudents(req, res) {
		try {
			const { id } = req.params;
			const classCourse = await Class.findOne({ course: id }).populate({
				path: 'students',
				model: 'User',
				select: 'firstName lastName email isInstructor avatar position isBanned',
			});

			return res.json({ students: classCourse?.students || [] });
		} catch (error) {
			console.error(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = ClassController;
