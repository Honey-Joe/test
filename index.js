const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
const app = express();

// MongoDB connection
const mongoURI = 'mongodb+srv://honeyjoe942:Honey0511@techx.gkypa.mongodb.net/';
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Initialize GridFS
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// GridFS storage setup
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
            filename: `file-${Date.now()}${path.extname(file.originalname)}`,
            bucketName: 'uploads', // Collection name in GridFS
        };
    },
});
const upload = multer({ storage });

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
});

app.get('/files/:filename', async (req, res) => {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) return res.status(404).send('File not found');

    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
});

app.listen(5000, () => console.log('Server running on port 5000'));
