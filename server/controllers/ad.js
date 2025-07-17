const Ad = require('../models/Ad');

// GET all ads
const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().populate('publisher', 'username email');
    res.status(200).json(ads);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET ads by current user
const getMyAds = async (req, res) => {
  try {
    const ads = await Ad.find({ publisher: req.user._id }).populate('publisher', 'username email');
    res.status(200).json(ads);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET ad by ID
const getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('publisher', 'username email');
    if (!ad) return res.status(404).json({ error: 'Ad not found' });
    res.status(200).json(ad);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST new ad
const createAd = async (req, res) => {
  try {
    const { 
      title, 
      adSlot, 
      description, 
      location, 
      device, 
      category, 
      budget, 
      bidType,
      targetAudience 
    } = req.body;

    // Validate required fields
    if (!title || !adSlot || !description || !location || !category || !budget) {
      return res.status(400).json({ 
        message: 'Title, ad slot, description, location, category, and budget are required' 
      });
    }

    // Handle image URL
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/ads/${req.file.filename}`;
    }

    // Parse targetAudience if it's a string (from FormData)
    let parsedTargetAudience = targetAudience;
    if (typeof targetAudience === 'string') {
      try {
        parsedTargetAudience = JSON.parse(targetAudience);
      } catch (e) {
        parsedTargetAudience = {};
      }
    }

    const newAd = new Ad({ 
      title, 
      publisher: req.user._id, // Use authenticated user's ID
      adSlot, 
      description, 
      location, 
      device, 
      category, 
      budget: parseFloat(budget), 
      bidType,
      imageUrl,
      targetAudience: parsedTargetAudience 
    });

    await newAd.save();
    
    // Populate publisher info before sending response
    const populatedAd = await Ad.findById(newAd._id).populate('publisher', 'username email');
    
    res.status(201).json(populatedAd);
  } catch (err) {
    console.error('Error creating ad:', err);
    res.status(500).json({ error: 'Failed to create ad' });
  }
};

// UPDATE ad (only by owner)
const updateAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    // Check if user is the owner
    if (ad.publisher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this ad' });
    }

    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: Date.now() }, 
      { new: true }
    ).populate('publisher', 'username email');

    res.status(200).json(updatedAd);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE ad by ID (only by owner)
const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    // Check if user is the owner
    if (ad.publisher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this ad' });
    }

    await Ad.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Ad deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllAds,
  getMyAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd
};
