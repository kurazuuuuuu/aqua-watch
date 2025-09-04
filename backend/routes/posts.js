const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const router = express.Router();

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
    const { title, description, latitude, longitude, nickname } = req.body;
    
    let imagePath = null;
    
    if (req.file) {
      const filename = `${Date.now()}_${uuidv4()}.jpg`;
      imagePath = `uploads/images/${filename}`;
      
      await sharp(req.file.buffer)
        .resize(800, 600, { fit: 'inside' })
        .jpeg({ quality: 80 })
        .toFile(path.join(__dirname, '..', imagePath));
    }
    
    const result = await db.query(
      'INSERT INTO posts (title, description, latitude, longitude, image_path, nickname) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, latitude, longitude, imagePath, nickname || 'Anonymous']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 投稿一覧取得
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    res.json(result.rows);
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
