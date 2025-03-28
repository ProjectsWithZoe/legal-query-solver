const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Files will be stored in an 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    cb(null, Date.now() + '-' + file.originalname)
  }
});

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Handle file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return file information
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: req.file.path
    });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading file' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 