const express = require('express');
const router = express.Router();
const { getAllContent, updateContent, uploadLogo } = require('../controllers/contentController');
const upload = require('../middleware/upload');

router.route('/').get(getAllContent).post(updateContent);
router.route('/upload-logo').post(upload.single('image'), uploadLogo);

module.exports = router;
