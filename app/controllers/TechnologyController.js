const { validationResult } = require('express-validator');
const Technology = require('../models/Technology');
const cloudinary = require('../../config/cloudinary');

const TechnologyController = {
	// [GET] /api/technologies
	async index(req, res) {
		let _page = parseInt(req.query._page);
		let _limit = parseInt(req.query._limit);

		// get technologies base on _page and _limit per _page
		if (_page) {
			_page = _page >= 0 ? _page : 1;
			_limit = _limit || 1;
			_limit = _limit >= 0 ? _limit : 1;
			const skipDocs = (_page - 1) * _limit;

			try {
				const _totalRows = await Technology.countDocuments();
				const technologies = await Technology.find()
					.sort({ createdAt: -1 })
					.limit(_limit)
					.skip(skipDocs);

				const pagination = { _page, _limit, _totalRows };
				return res.json({ technologies, pagination });
			} catch (error) {
				console.log(error);
				return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
			}
		}

		// ----------------------------------------------------------------------

		// get all technologies
		try {
			const technologies = await Technology.find().sort({ createdAt: -1 });
			return res.json({ technologies });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [GET] /api/technologies/:id
	async show(req, res) {
		const { id } = req.params;

		try {
			const technology = await Technology.findById(id);
			if (!technology) return res.status(400).json({ errors: [{ msg: 'Technology not found' }] });
			return res.json({ technology });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/technologies
	async store(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { name, image, tag } = req.body;

		try {
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
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { id } = req.params;
		const { name, image, tag } = req.body;

		try {
			let newImage = '';
			if (image.startsWith('data:')) {
				const response = await cloudinary.uploader.upload(image, {
					folder: 'itgo/technology',
					resource_type: 'image',
				});
				newImage = response.public_id;
			}

			await Technology.findByIdAndUpdate(id, {
				name,
				image: image.startsWith('data:') ? newImage : image,
				tag,
			});

			return res.json({ msg: 'Technology was updated successfully' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [DELETE] /api/technologies/:id
	async destroy(req, res) {
		const { id } = req.params;

		try {
			const technology = await Technology.findByIdAndDelete(id);

			if (!technology)
				return res.status(400).json({ errors: [{ msg: 'Technology item not found' }] });
			return res.json({ msg: 'Technology was removed successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = TechnologyController;
