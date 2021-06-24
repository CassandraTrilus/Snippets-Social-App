import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models'

const router = express.Router()
const requireAuth = require('../requireAuth')

router
  .route('/:id')
  .get(async (request, response) => {
    const populateQuery = [
      {
        path: 'posts',
        populate: { path: 'author', select: ['username', 'profile_image'] },
      },
    ]

    const user = await User.findOne({ username: request.params.id })
      .populate(populateQuery)
      .exec()
    if (user) {
      response.json(user.toJSON())
    } else {
      response.status(404).end()
    }
  })
  .put(requireAuth(async (request, response) => {
    const { currentPassword, newPassword, profile_image } = request.body
    const { id } = request.params
    const { user } = request

    const hashedpassword = await bcrypt.hash(newPassword, 12)

    const match = bcrypt.compare(currentPassword, user.passwordHash)

    if(!match) {
      response.status(401).json({ err: "Your password is incorrect" })
    }

    try {
      const userUpdate = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          passwordHash: hashedpassword,
          profile_image: profile_image,
        },
        {
          new: true,
          strict: false,
        }
      )

      response.json(userUpdate.toJSON())
    } catch (error) {
      response.status(404).end()
    }
  }))

module.exports = router
