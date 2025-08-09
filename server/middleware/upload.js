const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/ads');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ad-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter - only allow images with enhanced security
const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (file.mimetype.startsWith('image/')) {
    // Additional security: check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(fileExtension)) {
      // Sanitize filename to prevent path traversal
      const sanitizedName = path.basename(file.originalname);
      if (sanitizedName === file.originalname) {
        cb(null, true);
      } else {
        cb(new Error('Invalid filename detected!'), false);
      }
    } else {
      cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed!'), false);
    }
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
