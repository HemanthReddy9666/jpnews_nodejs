const mongoose = require('mongoose');

const languagesSchema = new mongoose.Schema({
  languageId: { 
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  isActive: { // isActive
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add collation indexes for case-insensitive uniqueness
languagesSchema.index({ name: 1 }, { 
  unique: true, 
  collation: { locale: 'en', strength: 2 } 
});
module.exports = mongoose.model('languages', languagesSchema); 