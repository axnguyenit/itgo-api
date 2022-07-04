const Course = require('../models/Course');
const Event = require('../models/Event');
const Cart = require('../models/Cart');

const authorization = {
	// only admin & author can update, delete course
	async canUpdateCourse(req, res, next) {
		const { id: userId, isAdmin } = req.user;
		const { id } = req.params;

		try {
			const course = await Course.findById(id);

			// course not found
			if (!course) return res.status(400).json({ errors: [{ msg: 'Course not found' }] });

			const isAuthor = userId === course.instructor.toString();
			if (!isAuthor && !isAdmin)
				return res.status(403).json({ errors: [{ msg: 'Permission denied' }] });

			next();
		} catch (error) {
			console.error(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// only admin & instructor can create course
	canCreateCourse(req, res, next) {
		const { isAdmin, isInstructor } = req.user;

		if (!isAdmin && !isInstructor)
			return res.status(403).json({ errors: [{ msg: 'Permission denied' }] });

		next();
	},

	// only author can update cart
	async canUpdateCart(req, res, next) {
		const { id: userId } = req.user;
		const { id } = req.params;
		try {
			const cart = await Cart.findById(id);
			if (!cart) return res.status(400).json({ errors: [{ msg: 'Cart not found' }] });

			const isAuthor = cart.userId === userId;
			if (!isAuthor) return res.status(403).json({ errors: [{ msg: 'Permission denied' }] });

			next();
		} catch (error) {
			console.error(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// only author & admin can update user info
	async canUpdateAccount(req, res, next) {
		const { id: userId, isAdmin } = req.user;
		const { id } = req.params;
		const isAuthor = userId === id;

		if (!isAdmin && !isAuthor)
			return res.status(403).json({ errors: [{ msg: 'Permission denied' }] });

		next();
	},

	// verify that who is admin
	async isAdmin(req, res, next) {
		const { isAdmin } = req.user;

		if (!isAdmin) return res.status(403).json({ errors: [{ msg: 'Permission denied' }] });
		next();
	},

	// verify that who is instructor
	async isInstructor(req, res, next) {
		const { isInstructor } = req.user;

		if (!isInstructor) return res.status(403).json({ errors: [{ msg: 'Permission denied' }] });
		next();
	},

	// only author & admin can create event
	async canCreateEvent(req, res, next) {
		const { id: userId, isAdmin } = req.user;
		const { courseId } = req.body;

		try {
			const course = await Course.findById(courseId);
			// course not found
			if (!course) return res.status(400).json({ errors: [{ msg: 'Course not found' }] });

			const isAuthor = userId === course.instructor.toString();
			if (!isAuthor && !isAdmin)
				return res.status(403).json({ errors: [{ msg: 'Permission denied' }] });

			next();
		} catch (error) {
			console.error(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// only admin & author can update, delete event
	async canUpdateEvent(req, res, next) {
		const { id: userId, isAdmin } = req.user;
    const { id } = req.params;

    try {
      const event = await Event.findById(id);

      // event not found
      if (!event) return res.status(400).json({ errors: [{ msg: 'Event not found' }] });

      const isAuthor = userId === event.instructor;
      if (!isAuthor && !isAdmin)
        return res.status(403).json({ errors: [{ msg: 'Permission denied' }] });

      next();
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
	},
};

module.exports = authorization;
