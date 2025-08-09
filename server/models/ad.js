const {Schema, model} = require('mongoose');

const adSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  publisher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adSlot: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  location: { type: String, required: true, trim: true },
  device: { type: String, enum: ['desktop', 'mobile', 'tablet', 'all'], default: 'all' },
  category: { type: String, required: true, trim: true },
  budget: { type: Number, required: true, min: 1, max: 1000000 },
  bidType: { type: String, enum: ['cpc', 'cpm', 'cpa'], default: 'cpc' },
  imageUrl: { type: String },
  targetAudience: {
    ageRange: { type: String, trim: true },
    gender: { type: String, enum: ['male', 'female', 'all'], default: 'all' },
    interests: [{ type: String, trim: true }]
  },
  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for better performance
adSchema.index({ publisher: 1 });
adSchema.index({ category: 1 });
adSchema.index({ status: 1 });
adSchema.index({ createdAt: -1 });
adSchema.index({ location: 1 });
adSchema.index({ budget: 1 });

const Ad = model('Ad', adSchema);

module.exports = Ad;
