const express = require('express');
const router = express.Router();
const adController = require('../controllers/ad');

// GET all ads
router.get('/', adController.getAllAds);

// POST a new ad
router.post('/', adController.createAd);

// GET a specific ad by ID
router.get('/:id', adController.getAdById);

// DELETE an ad
router.delete('/:id', adController.deleteAd);

module.exports = router;
