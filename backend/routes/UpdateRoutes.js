import path from 'path'
import express from 'express'
import multer from 'multer'
import fs from 'fs'

const router = express.Router()

// مسیر مطلق پروژه
const __dirname = path.resolve()

// مسیر uploads به صورت مطلق
const uploadPath = path.join(__dirname, 'uploads')

// اگر فولدر وجود نداشت، بساز
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true })
}

// تنظیم storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadPath)
  },
  filename(req, file, cb) {
    cb(
      null,
      `image-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

// فیلتر فایل
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/

  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  )
  const mimetype = mimetypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error('Images only!'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
})

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' })
  }

  res.status(200).send({
    message: 'Image uploaded successfully',
    image: `/uploads/${req.file.filename}`,
  })
})

export default router
