const { fn, col } = require('sequelize')
const router = require('express').Router()
const { Blog } = require('../models')


router.get('/', async (req, res) => {
  const authorData = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('id')), 'blogs'],
      [fn('SUM', col('likes')), 'total_likes']
    ],
    group: 'author',
    order: [ [col('total_likes'), 'DESC'] ],
  })

  res.json(authorData)
})

module.exports = router