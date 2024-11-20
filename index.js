const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

// Middleware to handle CORS
app.use(cors({
    origin: 'http://localhost:5173', // Your React app's frontend URL
    methods: ['GET', 'POST'],
}));

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the folder where files should be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save file with timestamp
    }
});

const upload = multer({ storage: storage });

// POST route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // You can process the file here, or store it in a database if needed
    // For now, we return the file URL (local path for testing)
    const fileUrl = `https://test-three-indol-29.vercel.app/uploads/${req.file.filename}`;
    res.json({ fileUrl });
});

// Serve the uploaded files (in real-world, use a cloud storage or CDN)
app.use('/uploads', express.static('uploads'));

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
