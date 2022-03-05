const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join('public', 'assets', 'images', 'courses'));
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}.${file.mimetype.split('/').pop()}`);
	},
});

const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype.includes('image')) {
			cb(null, true);
		} else {
			cb(null, false);
			return;
		}
	},
});

module.exports = upload;
