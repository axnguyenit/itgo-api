const express = require('express');
const router = express.Router();
const crypto = require('crypto');

router.post('/', (req, res) => {
	const timestamp = new Date().getTime() - 30000;
	const msg = Buffer.from(
		process.env.ZOOM_JWT_API_KEY + req.body.meetingNumber + timestamp + req.body.role
	).toString('base64');
	const hash = crypto
		.createHmac('sha256', process.env.ZOOM_JWT_API_SECRET)
		.update(msg)
		.digest('base64');
	const signature = Buffer.from(
		`${process.env.ZOOM_JWT_API_KEY}.${req.body.meetingNumber}.${timestamp}.${req.body.role}.${hash}`
	).toString('base64');

	res.json({
		signature: signature,
	});
});

module.exports = router;
