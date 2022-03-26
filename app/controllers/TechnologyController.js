const { validationResult } = require('express-validator');
const Technology = require('../models/Technology');
const cloudinary = require('../../config/cloudinary');

const TechnologyController = {
	// [GET] /api/technologies
	async index(req, res) {},

	// [GET] /api/technologies/:id
	async show(req, res) {
		const { id } = req.params;
	},

	// [POST] /api/technologies
	async store(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		try {
			const { name, image, tag } = req.body;

			const response = await cloudinary.uploader.upload(image, {
				folder: 'itgo/technology',
				resource_type: 'image',
			});
			const newImage = response.public_id;

			const technology = new Technology({ name, image: newImage, tag });
			await technology.save();

			return res.json({ technology, msg: 'Technology was created successfully' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [PUT] /api/technologies/:id
	async update(req, res) {
		const { id } = req.params;
	},

	// [DELETE] /api/technologies/:id
	async destroy(req, res) {
		const { id } = req.params;
	},
};

module.exports = TechnologyController;
