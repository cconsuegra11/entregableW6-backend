const cloudinary = require('./cloudinary.config');
const stream = require('stream');

const uploadToCloudinary = (fileBuffer, fileName) => new Promise((resolve, reject) => {
  const fileStream = new stream.PassThrough();
  fileStream.end(fileBuffer)

  const uploadResponse = cloudinary.uploader.upload_stream(
    {
      resource_type: 'auto',
      public_id: fileName,
    },
    (error, result) => {
      if (error) reject(error)
      else resolve(result)
    }
  ) 

  fileStream.pipe(uploadResponse)
})

module.exports = uploadToCloudinary