const News = require('../models/News');

const getNews = async (req, res) => {
    try {
        const news = await News.find({}).sort({ createdAt: -1 });
        const mapped = news.map(n => ({
            id: n._id,
            title: n.title,
            content: n.content,
            imageUrl: n.imageUrl,
            date: n.date
        }));
        res.status(200).json({ success: true, data: mapped });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const addNews = async (req, res) => {
    try {
        const { title, content } = req.body;
        const imageUrl = req.file ? req.file.path : req.body.imageUrl;
        
        const newNews = await News.create({ 
            title, 
            content, 
            imageUrl, 
            date: new Date().toLocaleDateString() 
        });
        
        res.status(201).json({ success: true, data: { ...newNews._doc, id: newNews._id } });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateNews = async (req, res) => {
    try {
        const { title, content } = req.body;
        const updateData = { title, content };
        if (req.file) {
            updateData.imageUrl = req.file.path;
        } else if (req.body.imageUrl) {
            updateData.imageUrl = req.body.imageUrl;
        }

        const updatedNews = await News.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ success: true, data: { ...updatedNews._doc, id: updatedNews._id } });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = { getNews, addNews, deleteNews, updateNews };
