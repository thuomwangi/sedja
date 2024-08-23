const path = require('path');

const fileValidator = (req, res, next) => {
  const file = req.file;


 if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    return res.status(400).json({ error: 'File is too large' });
  }

  next();
};

module.exports = fileValidator;
