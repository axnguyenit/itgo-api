const express = require('express');
const router = express.Router();
const path = require('path');
const verifyToken = require('../app/middleware/authentication');
const upload = require('../utils/upload');
// ----------------------------------------------------------------------

router.post('/course-image', verifyToken, upload.uploadCourseImage.single('image'), (req, res) => {
	const file = req.file;
	if (!file)
		return res.status(400).json({
			success: false,
			errors: [
				{
					msg: 'Image not found',
				},
			],
		});

	file.path = `${req.protocol}://${path.join(
		req.headers.host,
		'assets',
		'images',
		'courses',
		file.filename
	)}`;

	return res.json({
		success: true,
		file,
	});
});

// ----------------------------------------------------------------------

router.post('/avatar', verifyToken, upload.uploadAvatar.single('avatar'), (req, res) => {
	const file = req.file;
	if (!file)
		return res.status(400).json({
			success: false,
			errors: [
				{
					msg: 'Image not found',
				},
			],
		});

	// if (images && images.length > 0)
	// 	images.map((image) => fs.unlinkSync(`public/uploads/courses/${image}`));

	console.log(file);

	file.path = `${req.protocol}://${path.join(
		req.headers.host,
		'assets',
		'images',
		'avatar',
		file.filename
	)}`;

	// images = [file.filename];
	return res.json({
		success: true,
		file,
	});
});

module.exports = router;
