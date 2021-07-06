import express from 'express'
import multer from 'multer'
import { User } from '../models'
import { requireAuth } from '../middleware'

const router = express.Router()

const storage = multer.diskStorage({
  destination: '../client/public/',
  filename: (req, file, cb) => {
    cb(null, "IMAGE-" + Date.now() + file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: {filesize: 3000000}
})

router.get('/', (req, res) => {
  res.send('Upload endpoint working')
})

router.post('/', upload.single('myFile'), requireAuth, async (req, res) => {
  const { user } = req
  try {
    const url = `./${req.file.filename}`
    const success = await User.findByIdAndUpdate(
      {
        _id: user._id
      },
      {
        profile_image: url
      },
      {
        new: true
      }
    )
    res.json({ url: url, user: success })
  } catch(err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router