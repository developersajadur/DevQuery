import { UploadClient } from 'uploadthing';

// Create the UploadClient instance
const uploadClient = new UploadClient({
  apiKey: process.env.UPLOADTHING_TOKEN, 
});

export default uploadClient; 
