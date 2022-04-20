const router = require('express').Router()
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
	if(!req.blog) {
		throw new Error('Blog not found')
	}
	next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})
  
router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body)
  res.json(blog)
})
  
router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
	const { likes } = req.body
	req.blog.likes = likes

	const updatedBlog = await req.blog.save()
	res.json(updatedBlog)
})

module.exports = router