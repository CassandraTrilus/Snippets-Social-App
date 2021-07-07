import express from 'express'
import { User } from '../models'

const router = express.Router()

router.get('/alice', (req, res) => {
  try{
    res.status(200).json('Alice')
  } catch(err) {
    res.status(400).send('Error')
  }
})

router.get('/top', (req, res, next) => {
  try{
    User.find({})
    res.status(200).json({ })
  } catch(err) {
    res.status(400).send('Error')
  }
})