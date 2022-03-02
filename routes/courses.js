const express = require('express');
const router = express.Router();
const courseController = require('../app/controllers/CourseController');
const validator = require('../validator/courses');

router.get('/:id', courseController.show);
router.put('/:id', validator.courseUpdate, courseController.update);
router.delete('/:id', courseController.destroy);
router.post('/', validator.courseStore, courseController.store);
router.get('/', courseController.index);

module.exports = router;
