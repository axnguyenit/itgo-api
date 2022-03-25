const { validationResult } = require('express-validator');
const Roadmap = require('../models/Roadmap');
const cloudinary = require('../../config/cloudinary');
const RoadmapDetail = require('../models/RoadmapDetail');

const roadmapController = {
	// [GET] /api/roadmap
	async index(req, res) {
		let _page = parseInt(req.query._page);
		let _limit = parseInt(req.query._limit);

		// get roadmaps base on _page and _limit per _page
		if (_page) {
			_page = _page >= 0 ? _page : 1;
			_limit = _limit || 1;
			_limit = _limit >= 0 ? _limit : 1;
			const skipDocs = (_page - 1) * _limit;

			try {
				const _totalRows = await Roadmap.find().count();
				const roadmaps = await Roadmap.find().sort({ createdAt: -1 }).limit(_limit).skip(skipDocs);

				const pagination = { _page, _limit, _totalRows };
				return res.json({ roadmaps, pagination });
			} catch (error) {
				console.log(error);
				return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
			}
		}

		// get all roadmaps
		try {
			const roadmaps = await Roadmap.find().sort({ createdAt: -1 });
			return res.json({ roadmaps });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [GET] /api/roadmap/:slug
	async show(req, res) {
		const { id } = req.params;

		try {
			const roadmap = await Roadmap.findById(id);
			if (!roadmap) return res.status(400).json({ errors: [{ msg: 'Roadmap not found' }] });

			const roadmapDetails = await RoadmapDetail.find({ roadmapId: id });

			return res.json({ roadmap: { ...roadmap.toObject(), technologies: roadmapDetails } });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/roadmap
	async store(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		try {
			const { name, slogan, description, technologies } = req.body;

			const roadmap = new Roadmap({ name, slogan, description });
			await roadmap.save();

			technologies.map(async (technology) => {
				const response = await cloudinary.uploader.upload(technology.image, {
					folder: 'itgo/roadmap',
					resource_type: 'image',
				});
				technology.image = response.public_id;

				const roadmapDetail = new RoadmapDetail({ roadmapId: roadmap._id, ...technology });
				await roadmapDetail.save();
			});

			return res.json({ roadmap, msg: 'Roadmap was created successfully' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [PUT] /api/roadmap/:id
	async update(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { id } = req.params;
		const { name, slogan, description, technologies } = req.body;

		try {
			const roadmap = await Roadmap.findByIdAndUpdate(id, { name, slogan, description });
			if (!roadmap) return res.status(400).json({ errors: [{ msg: 'Roadmap not found' }] });

			technologies.map(async (_technology) => {
				const { _id, technology, description, image, tags } = _technology;
				let newImage = '';
				if (image.startsWith('data:')) {
					const response = await cloudinary.uploader.upload(image, {
						folder: 'itgo/roadmap',
						resource_type: 'image',
					});
					newImage = response.public_id;
				}

				await RoadmapDetail.findByIdAndUpdate(_id, {
					technology,
					description,
					image: image.startsWith('data:') ? newImage : image,
					tags,
				});
			});

			return res.json({ msg: 'Roadmap was updated successfully' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = roadmapController;
