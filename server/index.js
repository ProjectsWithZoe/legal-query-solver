const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());

// Initialize Supabase client
const supabase = createClient(
  'your-supabase-url',     // Get from Supabase dashboard
  'your-supabase-anon-key' // Get from Supabase dashboard
);

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

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('contracts') // bucket name
      .upload(
        `${Date.now()}-${req.file.originalname}`, 
        req.file.buffer,
        {
          contentType: req.file.mimetype,
          cacheControl: '3600'
        }
      );

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('contracts')
      .getPublicUrl(data.path);

    res.json({
      message: 'File uploaded successfully',
      fileName: req.file.originalname,
      url: publicUrl
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 