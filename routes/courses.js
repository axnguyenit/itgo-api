const express = require('express');
const router = express.Router();
const courseController = require('../app/controllers/CourseController');
const validator = require('../validator/courses');

// router.get('/create', courseController.create);
// router.get('/:id/edit', courseController.edit);
// router.delete('/:id', courseController.destroy);
router.get('/:id', courseController.show);
router.put('/:id', validator.course, courseController.update);
router.post('/', validator.course, courseController.store);
router.get('/', courseController.index);

module.exports = router;
