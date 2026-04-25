const Content = require('../models/Content');

const getAllContent = async (req, res) => {
    try {
        const contents = await Content.find({});
        const contentMap = {};
        contents.forEach(c => contentMap[c.key] = c.value);
        res.status(200).json({ success: true, data: contentMap });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateContent = async (req, res) => {
    try {
        const updates = req.body; // { key: value }
        for (const [key, value] of Object.entries(updates)) {
            await Content.findOneAndUpdate(
                { key },
                { value },
                { upsert: true, new: true }
            );
        }
        res.status(200).json({ success: true, message: 'Content updated successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const uploadLogo = async (req, res) => {
    try {
        if (!req.file) throw new Error('No logo file uploaded');
        const key = req.body.key || 'siteLogo';
        await Content.findOneAndUpdate(
            { key },
            { value: req.file.path },
            { upsert: true, new: true }
        );
        res.status(200).json({ success: true, url: req.file.path });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = { getAllContent, updateContent, uploadLogo };
