const express = require('express');
const demoPosts = require('../data/demo-posts');

const router = express.Router();

// デモ投稿一覧取得
router.get('/posts', (req, res) => {
  try {
    res.json(demoPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// デモ投稿詳細取得
router.get('/posts/:id', (req, res) => {
  try {
    const post = demoPosts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
