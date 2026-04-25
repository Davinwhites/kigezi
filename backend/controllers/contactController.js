const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const contact = await Contact.create({ name, email, message });

        // Email Notification Logic
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'tugyendanekigezifestival@gmail.com',
                pass: process.env.EMAIL_PASS // User needs to set this in Render env vars
            }
        });

        const mailOptions = {
            from: email,
            to: 'tugyendanekigezifestival@gmail.com',
            subject: `New Festival Contact from ${name}`,
            text: `You have received a new message from your website contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        // Try to send email but don't block the response if it fails
        if (process.env.EMAIL_PASS) {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) console.error('Email sending failed:', error);
                else console.log('Email sent:', info.response);
            });
        }

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
