const express = require('express');
const router = express.Router();
const { getAllContent, updateContent } = require('../controllers/contentController');

router.route('/').get(getAllContent).post(updateContent);

module.exports = router;
