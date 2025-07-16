const Ad = require('../models/Ad');

// GET all ads
const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find();
    res.status(200).json(ads);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET ad by ID
const getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });
    res.status(200).json(ad);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST new ad
const createAd = async (req, res) => {
  try {
    const { title, publisher, adSlot, description, location, device } = req.body;
    const newAd = new Ad({ title, publisher, adSlot, description, location, device });
    await newAd.save();
    res.status(201).json(newAd);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ad' });
  }
};

// DELETE ad by ID
const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });
    res.status(200).json({ message: 'Ad deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllAds,
  getAdById,
  createAd,
  deleteAd
};
