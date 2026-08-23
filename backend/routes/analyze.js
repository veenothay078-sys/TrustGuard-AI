const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { analyzeText, analyzeUrlEndpoint, analyzePage, analyzeScreenshot } = require('../controllers/analyzeController');

const router = express.Router();

const os = require('os');
const fs = require('fs');

// ─── File Upload Config ────────────────────────────────────────────────────────
const maxFileSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB) || 5;
const uploadDir = process.env.UPLOAD_DIR 
  ? path.resolve(process.env.UPLOAD_DIR) 
  : (process.env.NODE_ENV === 'production' || process.env.VERCEL ? os.tmpdir() : path.join(__dirname, '../uploads'));

if (!fs.existsSync(uploadDir)) {
  try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (_) {}
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `screenshot-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: maxFileSizeMB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error('Only image files are allowed (jpg, jpeg, png, gif, webp, bmp)'));
    }
    cb(null, true);
  }
});

// ─── Validation Middleware ─────────────────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// POST /api/analyze/text
router.post('/text',
  [body('text').notEmpty().withMessage('text is required').isLength({ max: 5000 }).withMessage('Text too long')],
  validate,
  analyzeText
);

// POST /api/analyze/url
router.post('/url',
  [body('url').notEmpty().withMessage('url is required').isLength({ max: 2000 })],
  validate,
  analyzeUrlEndpoint
);

// POST /api/analyze/page
router.post('/page',
  [body('text').notEmpty().withMessage('Page text is required')],
  validate,
  analyzePage
);

// POST /api/analyze/screenshot
router.post('/screenshot',
  upload.single('screenshot'),
  analyzeScreenshot
);

// POST /api/analyze/ocr (alias)
router.post('/ocr',
  upload.single('screenshot'),
  analyzeScreenshot
);

module.exports = router;
