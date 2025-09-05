const express = require('express');
const router = express.Router();

// Google Maps JavaScript APIのプロキシエンドポイント
router.get('/js', (req, res) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Google Maps API key not configured' });
  }

  // Google Maps JavaScript APIのURLを返す
  const mapsUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
  
  res.json({ url: mapsUrl });
});

module.exports = router;
