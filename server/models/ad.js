const {Schema, model} = require('mongoose');

const adSchema = new Schema({
  title: { type: String, required: true },
  publisher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adSlot: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  device: { type: String, enum: ['desktop', 'mobile', 'tablet', 'all'], default: 'all' },
  category: { type: String, required: true },
  budget: { type: Number, required: true, min: 0 },
  bidType: { type: String, enum: ['cpc', 'cpm', 'cpa'], default: 'cpc' },
  imageUrl: { type: String }, // Add image URL field
  targetAudience: {
    ageRange: { type: String },
    gender: { type: String, enum: ['male', 'female', 'all'], default: 'all' },
    interests: [{ type: String }]
  },
  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Ad = model('Ad', adSchema);

module.exports = Ad;
