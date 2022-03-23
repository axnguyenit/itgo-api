const express = require('express');
const router = express.Router();
const path = require('path');
const verifyToken = require('../app/middleware/authentication');
const upload = require('../utils/upload');
// ----------------------------------------------------------------------

router.post('/course-image', verifyToken, upload.uploadCourseImage.single('image'), (req, res) => {
	const file = req.file;
	if (!file) return res.status(400).json({ errors: [{ msg: 'Image not found' }] });

	file.path = `${process.env.PROTOCOL}://${path.join(
		req.headers.host,
		'assets',
		'images',
		'courses',
		file.filename
	)}`;

	return res.json({ file });
});

// ----------------------------------------------------------------------

router.post('/avatar', verifyToken, upload.uploadAvatar.single('avatar'), (req, res) => {
	const file = req.file;
	if (!file) return res.status(400).json({ errors: [{ msg: 'Image not found' }] });

	// if (images && images.length > 0)
	// 	images.map((image) => fs.unlinkSync(`public/uploads/courses/${image}`));

	file.path = `${process.env.PROTOCOL}://${path.join(
		req.headers.host,
		'assets',
		'images',
		'avatar',
		file.filename
	)}`;

	// images = [file.filename];
	return res.json({ file });
});

module.exports = router;
