const cloudinary = require('../../config/cloudinary');
const Application = require('../models/Application');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const ApplicationController = {
	// [GET] /api/applications
	async index(req, res) {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    // get applications base on page and limit per page
    if (page) {
      page = page >= 0 ? page : 1;
      limit = limit || 1;
      limit = limit >= 0 ? limit : 1;
      const skipDocs = (page - 1) * limit;

      try {
        const totalRows = await Application.countDocuments();
        const applications = await Application.find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skipDocs)
          .populate({
            path: 'user',
            model: 'User',
            select: 'firstName lastName email avatar',
          });

        const pagination = { page, limit, totalRows };
        return res.json({ results: applications, pagination });
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
      }
    }

    // ----------------------------------------------------------------------

    // get all applications
    try {
      const applications = await Application.find().sort({ createdAt: -1 }).populate({
        path: 'user',
        model: 'User',
        select: 'firstName lastName email avatar',
      });
      return res.json({ results: applications });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  },

	async show(req, res) {
		const { id } = req.params;

		try {
			const application = await Application.findById(id).select('cv');
			if (!application) return res.status(400).json({ errors: [{ msg: 'Application not found' }] });

			return res.json(application);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/applications
	async store(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { id } = req.user;
		const { position, cv } = req.body;

		try {
			const user = await Application.findOne({ user: id });
			if (user) return res.status(409).json({ errors: [{ msg: 'Application already exist' }] });

			if (!cv.startsWith('data:'))
				return res.status(400).json({ errors: [{ msg: 'CV must be convert to base64' }] });
			const response = await cloudinary.uploader.upload(cv, {
				folder: 'itgo/application',
				pages: true,
				// resource_type: 'pdf',
			});

			const application = new Application({
				user: id,
				position,
				cv: response.public_id,
			});

			await application.save();
			await User.findByIdAndUpdate(id, { isApply: true });

			return res.json({ msg: 'Application was created successfully' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/applications/:id/approve
	async approve(req, res) {
		const { id } = req.params;

		try {
			const application = await Application.findByIdAndDelete(id);
			if (!application) return res.status(400).json({ errors: [{ msg: 'Application not found' }] });
			await User.findByIdAndUpdate(application.user, {
				isInstructor: true,
				position: application.position,
			});

			return res.json({ msg: 'Permission was updated successfully' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/applications/:id/deny
	async deny(req, res) {
		const { id } = req.params;

		try {
			const application = await Application.findByIdAndDelete(id);
			if (!application) return res.status(400).json({ errors: [{ msg: 'Application not found' }] });
			await User.findByIdAndUpdate(application.user, { isApply: false });

			return res.json({ msg: 'Application was removed successfully' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = ApplicationController;
