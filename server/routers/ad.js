const express = require('express');
const router = express.Router();
const adController = require('../controllers/ad');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET all ads (public)
router.get('/', adController.getAllAds);

// GET my ads (protected)
router.get('/my-ads', authenticateToken, adController.getMyAds);

// POST a new ad (protected, with image upload)
router.post('/', authenticateToken, upload.single('image'), adController.createAd);

// GET a specific ad by ID (public)
router.get('/:id', adController.getAdById);

// PUT update an ad (protected, owner only)
router.put('/:id', authenticateToken, adController.updateAd);

// DELETE an ad (protected, owner only)
router.delete('/:id', authenticateToken, adController.deleteAd);

module.exports = router;
