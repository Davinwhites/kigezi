const Contact = require('../models/Contact');

const submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const contact = await Contact.create({ name, email, message });
        res.status(201).json({ success: true, data: { ...contact._doc, id: contact._id } });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        const mapped = contacts.map(c => ({
            id: c._id,
            name: c.name,
            email: c.email,
            message: c.message,
            date: c.createdAt
        }));
        res.status(200).json({ success: true, data: mapped });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = { submitContact, getContacts };
