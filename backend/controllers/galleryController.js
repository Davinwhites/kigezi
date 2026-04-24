const Gallery = require('../models/Gallery');

const getImages = async (req, res) => {
    try {
        const images = await Gallery.find({}).sort({ createdAt: -1 });
        const mapped = images.map(img => ({
            id: img._id,
            title: img.title,
            imageUrl: img.imageUrl,
            category: img.category
        }));
        res.status(200).json({ success: true, data: mapped });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const uploadImage = async (req, res) => {
    try {
        const { title, category } = req.body;
        const imageUrl = req.file ? req.file.path : req.body.imageUrl;
        
        const image = await Gallery.create({ 
            title, 
            imageUrl, 
            category: category || 'general' 
        });
        
        res.status(201).json({ success: true, data: { ...image._doc, id: image._id } });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const deleteImage = async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Image deleted' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = { getImages, uploadImage, deleteImage };
