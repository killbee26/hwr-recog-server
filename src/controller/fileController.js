const AWS = require('aws-sdk');
const multer = require('multer');
const File = require('../models/File');
const User = require('../models/User');
const { invokeGoogleVision } = require('../utils/googleVision');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.uploadFile = upload.single('file');

// Upload file to S3, store in MongoDB, and process with Lambda
exports.processFile = async (req, res) => {
  const { file } = req;
  const userID = req.userID; // Make sure this is being set correctly from authentication middleware
  const { description } = req.body;

  try {
    // Find the user by userID
    const user = await User.findById(userID);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create a unique key for S3
    const uniqueKey = `uploads/${Date.now()}-${file.originalname}`;

    // Upload file to S3
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueKey,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const s3Data = await s3.upload(s3Params).promise();

    // Save file information to MongoDB
    const newFile = new File({
      fileName: file.originalname,
      s3Key: s3Data.Key,
      s3Url: s3Data.Location,
      uploadedByID: user._id, // Assuming you're storing the user ID correctly
      description: description,
    });
    await newFile.save();

    // Call the Google Vision Lambda function to extract text
    const visionResult = await invokeGoogleVision(s3Data.Key).catch(err => {
      console.error("Vision processing failed:", err);
      return { text: '' }; // Handle error gracefully
    });

    // Update the file record with extracted text
    newFile.textExtracted = visionResult.extractedText;
    await newFile.save();

    // Return the extracted text to the client
    res.status(200).json({ success: true, extractedText: visionResult.extractedText });
  } catch (error) {
    res.status(500).json({ error: 'File processing failed', details: error.message });
  }
};
