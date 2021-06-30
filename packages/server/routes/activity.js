import express from 'express'
import { User } from '../models'

const router = express.Router()

router.get('/hello/:name', (req, res, next) => {
  try{
    res.json({ message: `Hello ${req.params.name}!` })
  } catch(err) {
    res.status(400).send('Error')
  }
})

router.get('/add/:x/:y', (req, res, next) => {
  const { x, y } = req.params
  if(!x || !y) {
    res.status(400).json({message: "Please give 2 numbers"})
  }
  try{
    let sum = parseInt(x) + parseInt(y)
    res.json({message:`{sum: ${sum}}`})
  } catch(err) {
    res.status(400).send({error: err.message})
  }
})

module.exports = router