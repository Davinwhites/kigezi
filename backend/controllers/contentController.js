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

module.exports = { getAllContent, updateContent };
