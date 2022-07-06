const { validationResult } = require('express-validator');
const Roadmap = require('../models/Roadmap');
const cloudinary = require('../../config/cloudinary');
const RoadmapDetail = require('../models/RoadmapDetail');

const RoadmapController = {
  // [GET] /api/roadmaps
  async index(req, res) {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    // get roadmaps base on page and limit per page
    if (page) {
      page = page >= 0 ? page : 1;
      limit = limit || 1;
      limit = limit >= 0 ? limit : 1;
      const skipDocs = (page - 1) * limit;

      try {
        const totalRows = await Roadmap.find().count();
        const roadmaps = await Roadmap.find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skipDocs);

        const pagination = { page, limit, totalRows };
        return res.json({ results: roadmaps, pagination });
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
      }
    }

    // get all roadmaps
    try {
      const roadmaps = await Roadmap.find().sort({ createdAt: -1 });
      return res.json({ results: roadmaps });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  },

  // [GET] /api/roadmaps/:id
  async show(req, res) {
    const { id } = req.params;

    try {
      const roadmap = await Roadmap.findById(id);
      if (!roadmap)
        return res.status(400).json({ errors: [{ msg: 'Roadmap not found' }] });

      const roadmapDetails = await RoadmapDetail.find({ roadmapId: id });

      const { _id, __v, ...rest } = roadmap.toObject();
      rest.id = _id;

      return res.json({ ...rest, technologies: roadmapDetails });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  },

  // [POST] /api/roadmaps
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
        const roadmapDetail = new RoadmapDetail({
          roadmapId: roadmap._id,
          ...technology,
        });
        await roadmapDetail.save();
      });

      return res.json({ roadmap, msg: 'Roadmap was created successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  },

  // [PUT] /api/roadmaps/:id
  async update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { name, slogan, description, technologies } = req.body;

    try {
      const roadmap = await Roadmap.findByIdAndUpdate(id, { name, slogan, description });
      if (!roadmap)
        return res.status(400).json({ errors: [{ msg: 'Roadmap not found' }] });

      technologies.map(async (_technology) => {
        const { id, technology, description, image, tag } = _technology;
        let newImage = '';
        if (image.startsWith('data:')) {
          const response = await cloudinary.uploader.upload(image, {
            folder: 'itgo/roadmap',
            resource_type: 'image',
          });
          newImage = response.public_id;
        }

        await RoadmapDetail.findByIdAndUpdate(id, {
          technology,
          description,
          image: image.startsWith('data:') ? newImage : image,
          tag,
        });
      });

      return res.json({ msg: 'Roadmap was updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  },

  // [DELETE] /api/roadmaps/:id
  async destroy(req, res) {
    const { id } = req.params;
    try {
      await Roadmap.findByIdAndDelete(id);
      await RoadmapDetail.deleteMany({ roadmapId: id });

      return res.json({ msg: 'Roadmap was removed successfully' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  },
};

module.exports = RoadmapController;
