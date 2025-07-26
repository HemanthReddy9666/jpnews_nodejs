const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const dashboardSchema = new mongoose.Schema({
  dashAdminId: { // dashboardadminid
    type: String,
    default: () => uuidv4(),
    unique: true,
    required: true
  },
  sessionId: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: { // phonenumber
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: { // emailid
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  username: { // username
    type: String,
    required: true,
    trim: true
  },
  pass: { // password
    type: String,
    required: true
  },
  roleType: { // roleType
    type: Number,
    required: true,
    enum: [1, 2, 3], //1.Super Admin 2.Validator 3.Reporter
    default: 1
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
dashboardSchema.index({ username: 1 }, { 
  unique: true, 
  collation: { locale: 'en', strength: 2 } 
});

dashboardSchema.index({ email: 1 }, { 
  unique: true, 
  collation: { locale: 'en', strength: 2 } 
});

module.exports = mongoose.model('Dashboard', dashboardSchema); 