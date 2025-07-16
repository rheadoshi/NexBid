const {Schema, model} = require('mongoose');

const adSchema = new Schema({
  title: { type: String, required: true },
  publisher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adSlot: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  device : { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Ad = model('Ad', adSchema);

module.exports = Ad;
