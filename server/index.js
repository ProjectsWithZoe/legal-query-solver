const express = require('express');
const multer = require('multer');
const cors = require('cors');
const admin = require('./firebase-config');
const path = require('path');

const app = express();
app.use(cors());

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Handle file upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = admin.storage().bucket();
    const fileName = Date.now() + '-' + req.file.originalname;
    const file = bucket.file(fileName);

    // Create a write stream and upload the file
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'Error uploading file' });
    });

    stream.on('finish', async () => {
      // Make the file publicly accessible
      await file.makePublic();
      
      // Get the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      
      res.json({
        message: 'File uploaded successfully',
        fileName: fileName,
        url: publicUrl
      });
    });

    stream.end(req.file.buffer);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 