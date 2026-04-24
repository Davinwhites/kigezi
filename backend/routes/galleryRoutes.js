const express = require('express');
const router = express.Router();
const { getImages, uploadImage, deleteImage } = require('../controllers/galleryController');
const upload = require('../middleware/upload');

router.route('/').get(getImages).post(upload.single('image'), uploadImage);
router.route('/:id').delete(deleteImage);

module.exports = router;
