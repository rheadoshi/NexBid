const Ad = require('../models/Ad');
const path = require('path');
const fs = require('fs');

// GET all ads with pagination
const getAllAds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.location) filter.location = new RegExp(req.query.location, 'i');
    if (req.query.status) filter.status = req.query.status;

    const ads = await Ad.find(filter)
      .populate('publisher', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Ad.countDocuments(filter);
    
    res.status(200).json({
      ads,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAds: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('Error fetching ads:', err);
    res.status(500).json({ error: 'Failed to fetch advertisements' });
  }
};

// GET ads by current user with pagination
const getMyAds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const ads = await Ad.find({ publisher: req.user._id })
      .populate('publisher', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Ad.countDocuments({ publisher: req.user._id });

    res.status(200).json({
      ads,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAds: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('Error fetching user ads:', err);
    res.status(500).json({ error: 'Failed to fetch your advertisements' });
  }
};

// GET ad by ID
const getAdById = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid ad ID format' });
    }

    const ad = await Ad.findById(req.params.id).populate('publisher', 'username email');
    if (!ad) return res.status(404).json({ error: 'Advertisement not found' });
    res.status(200).json(ad);
  } catch (err) {
    console.error('Error fetching ad:', err);
    res.status(500).json({ error: 'Failed to fetch advertisement' });
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

    // Enhanced validation
    if (!title || !adSlot || !description || !location || !category || !budget) {
      return res.status(400).json({ 
        message: 'Title, ad slot, description, location, category, and budget are required' 
      });
    }

    // Validate field lengths
    if (title.length > 200) {
      return res.status(400).json({ message: 'Title must be less than 200 characters' });
    }
    if (description.length > 1000) {
      return res.status(400).json({ message: 'Description must be less than 1000 characters' });
    }

    // Validate budget
    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum < 1 || budgetNum > 1000000) {
      return res.status(400).json({ 
        message: 'Budget must be a number between 1 and 1,000,000' 
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
      title: title.trim(), 
      publisher: req.user._id,
      adSlot: adSlot.trim(), 
      description: description.trim(), 
      location: location.trim(), 
      device, 
      category: category.trim(), 
      budget: budgetNum, 
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
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ error: 'Failed to create advertisement' });
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
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid ad ID format' });
    }

    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    // Check if user is the owner
    if (ad.publisher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this advertisement' });
    }

    // Cleanup: Delete ad image file if it exists
    if (ad.imageUrl) {
      const imagePath = path.join(__dirname, '..', ad.imageUrl);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log('Deleted image file:', imagePath);
        }
      } catch (fileErr) {
        console.error('Error deleting image file:', fileErr);
        // Continue with ad deletion even if file deletion fails
      }
    }

    await Ad.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Advertisement deleted successfully' });
  } catch (err) {
    console.error('Error deleting ad:', err);
    res.status(500).json({ error: 'Failed to delete advertisement' });
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
