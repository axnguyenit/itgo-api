const multer = require('multer');
const path = require('path');

const storageCourseImage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join('public', 'assets', 'images', 'courses'));
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}.${file.mimetype.split('/').pop()}`);
	},
});

const uploadCourseImage = multer({
	storage: storageCourseImage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype.includes('image')) {
			cb(null, true);
		} else {
			cb(null, false);
			return;
		}
	},
});

// ----------------------------------------------------------------------

const storageAvatar = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join('public', 'assets', 'images', 'avatar'));
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}.${file.mimetype.split('/').pop()}`);
	},
});

const uploadAvatar = multer({
	storage: storageAvatar,
	fileFilter: (req, file, cb) => {
		if (file.mimetype.includes('image')) {
			cb(null, true);
		} else {
			cb(null, false);
			return;
		}
	},
});

const upload = { uploadCourseImage, uploadAvatar };

module.exports = upload;
