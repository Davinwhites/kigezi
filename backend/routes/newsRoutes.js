const express = require('express');
const router = express.Router();
const { getNews, addNews, deleteNews, updateNews } = require('../controllers/newsController');
const upload = require('../middleware/upload');

router.route('/').get(getNews).post(upload.single('image'), addNews);
router.route('/:id').delete(deleteNews).put(upload.single('image'), updateNews);

module.exports = router;
