const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { blogFinder, tokenExtractor, userFinder, sessionFinder } = require('../util/middleware')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    order: [ ['likes', 'DESC'] ],
    where
  })
  res.json(blogs)
})
  
router.post('/', tokenExtractor, userFinder, sessionFinder, async (req, res) => {
  const blog = await Blog.create({ ...req.body, userId: req.user.id })
  res.json(blog)
})
  
router.delete('/:id', tokenExtractor, userFinder, sessionFinder, blogFinder, async (req, res) => {

  if(req.user.id === req.blog.userId) {
    await req.blog.destroy()
    res.status(204).end()
  } else {
    res.status(401).send({ error: 'You are not authorized to delete this blog' })
  }

})

router.put('/:id', blogFinder, async (req, res) => {
  const { likes } = req.body
  req.blog.likes = likes

  const updatedBlog = await req.blog.save()
  res.json(updatedBlog)
})

module.exports = router