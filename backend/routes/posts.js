const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const router = express.Router();

// アップロードディレクトリを確保
const uploadsDir = path.join(__dirname, '..', 'uploads', 'images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

// 画像アップロード設定
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

// 投稿作成
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('POST /posts - Request body:', req.body);
    console.log('POST /posts - File:', req.file ? 'Present' : 'None');
    
    const { title, description, latitude, longitude, nickname } = req.body;
    
    let imagePath = null;
    
    if (req.file) {
      const filename = `${Date.now()}_${uuidv4()}.jpg`;
      imagePath = `uploads/images/${filename}`;
      const fullPath = path.join(__dirname, '..', imagePath);
      
      console.log('Saving image to:', fullPath);
      
      await sharp(req.file.buffer)
        .resize(800, 600, { fit: 'inside' })
        .jpeg({ quality: 80 })
        .toFile(fullPath);
        
      console.log('Image saved successfully');
    }
    
    console.log('Inserting to database:', { title, description, latitude, longitude, imagePath, nickname });
    
    // latitude と longitude を数値に変換
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    // 数値変換の検証
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error(`Invalid coordinates: latitude=${latitude}, longitude=${longitude}`);
    }
    
    console.log('Converted coordinates:', { lat, lng });
    
    const result = await db.query(
      'INSERT INTO posts (title, description, latitude, longitude, image_path, nickname) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, lat, lng, imagePath, nickname || 'Anonymous']
    );
    
    console.log('Database insert successful:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /posts error:', error);
    res.status(400).json({ error: error.message, stack: error.stack });
  }
});

// 投稿一覧取得
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    
    // latitude と longitude を確実に数値として返す
    const posts = result.rows.map(post => ({
      ...post,
      latitude: parseFloat(post.latitude),
      longitude: parseFloat(post.longitude)
    }));
    
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 投稿詳細取得
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM posts WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
