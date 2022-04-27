const router = require('express').Router()

const { ReadingList } = require('../models')
const { tokenExtractor, userFinder, sessionFinder } = require('../util/middleware')

router.post('/', async (req, res) => {
  const { userId, blogId } = req.body
  const userBlog = await ReadingList.create({ userId, blogId })
  res.json(userBlog)
})

router.put('/:id', tokenExtractor, userFinder, sessionFinder, async (req, res) => {
  const reading = await ReadingList.findByPk(req.params.id)

  if(reading.userId === req.user.id) {
    reading.read = req.body.read
    const savedReading = await reading.save()
    res.json(savedReading)
  } else {
    res.status(401).send({ error: 'You are not authorized to update' })
  }
})

module.exports = router
