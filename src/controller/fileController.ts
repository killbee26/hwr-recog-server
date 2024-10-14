import AWS from 'aws-sdk';
import multer from 'multer';
import File from '../models/File';
import User from '../models/User';
import { invokeGoogleVision } from '../utils/googleVision';
import { Request, Response } from 'express';

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });
const bucketName = process.env.S3_BUCKET_NAME as string;
// S3 setup
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Middleware to handle file uploads
export const uploadFile = upload.single('file');

// Upload file to S3, store in DB, and process via Lambda
export const processFile = async (req: Request, res: Response) => {
  const file = req.file; // Access the uploaded file from req.file
  const userID = req.body.userID;

  // Check if the file is present
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const user = await User.findById(userID);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Upload file to S3
    const s3Params = {
      Bucket: bucketName,
      Key: `uploads/${file.originalname}`, // Use the uploaded file's original name
      Body: file.buffer, // Use the buffer of the uploaded file
    };

    const s3Data = await s3.upload(s3Params).promise();

    // Store file details in DB
    const newFile = new File({
      fileName: file.originalname, // Use the original name of the uploaded file
      s3Key: s3Data.Location, // Store the URL of the uploaded file
      uploadedByID: user._id, // Reference to the user who uploaded the file
    });
    await newFile.save();

    // Call Google Vision Lambda
    const visionResult = await invokeGoogleVision(s3Data.Location);

    // Update file with extracted text
    newFile.textExtracted = visionResult.text; // Update the textExtracted field
    await newFile.save();

    // Send the extracted text back to the client
    res.status(200).json({ text: visionResult.text });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'File processing failed' });
  }
};
