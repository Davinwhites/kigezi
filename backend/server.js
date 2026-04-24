require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db');

// Connect to Database
connectDB();

const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));

app.get('/', (req, res) => {
    res.send('Tugyedane Kigezi Festival API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
