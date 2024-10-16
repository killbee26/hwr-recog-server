// server/models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  s3Key: {
    type: String,
    required: true,
  },
  s3Url: {
    type: String,
    required: true,
  },
  uploadedByID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // You can add other fields as needed, e.g., for Google Vision results
  textExtracted: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  }
});

// Create a model from the schema
const File = mongoose.model('File', fileSchema);

// Export the model
module.exports = File;
