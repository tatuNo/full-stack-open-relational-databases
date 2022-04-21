const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['passwordHash']
    },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if(!password) return res.status(400).send({ error: 'password missing'})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({ username, name, passwordHash })
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  
  if(user) {
    user.name = req.body.name
    const updatedUser = await user.save()
    res.json(updatedUser)
  } else {
    throw new Error('User not found')
  }
})

module.exports = router