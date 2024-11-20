const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
}));
app.use(cors());


// MongoDB Atlas URI
const mongoURI = 'mongodb+srv://honeyjoe942:Honey0511@techx.gkypa.mongodb.net/';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

// Define a schema and model
const imageSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    contentType: String,
});
const Image = mongoose.model('Image', imageSchema);

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware
app.use(bodyParser.json());

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { originalname, mimetype, buffer } = req.file;
        const newImage = new Image({
            name: originalname,
            data: buffer,
            contentType: mimetype,
        });

        await newImage.save();
        res.json({ message: 'File uploaded successfully', id: newImage._id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading file');
    }
});

// Retrieve image
app.get('/image/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) return res.status(404).send('Image not found');

        res.set('Content-Type', image.contentType);
        res.send(image.data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching image');
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
