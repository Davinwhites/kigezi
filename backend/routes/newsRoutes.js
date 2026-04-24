const express = require('express');
const router = express.Router();
const { getNews, addNews, deleteNews } = require('../controllers/newsController');
const upload = require('../middleware/upload');

router.route('/').get(getNews).post(upload.single('image'), addNews);
router.route('/:id').delete(deleteNews);

module.exports = router;
