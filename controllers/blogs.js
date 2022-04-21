const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Blog, User } = require('../models')
const { blogFinder, tokenExtractor } = require('../util/middleware')
const { SECRET } = require('../util/config')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
		attributes: { exclude: ['userId'] },
		include: {
			model: User,
			attributes: ['name']
		}
	})
  res.json(blogs)
})
  
router.post('/', tokenExtractor, async (req, res) => {
	const decodedToken = jwt.verify(req.token, SECRET)
  const user = await User.findByPk(decodedToken.id)

  const blog = await Blog.create({ ...req.body, userId: user.id })
  res.json(blog)
})
  
router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
	const decodedToken = jwt.verify(req.token, SECRET)
  const user = await User.findByPk(decodedToken.id)

	if(user.id === req.blog.userId) {
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