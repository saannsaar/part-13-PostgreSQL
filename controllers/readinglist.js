const router = require('express').Router()

const { Blog, ReadingList, User } = require('../models')

router.post('/', async (req, res) => {
  
  const blog = await Blog.findByPk(req.body.blogId)
  if (!blog) return res.status(404).end()

  const user = await User.findByPk(req.body.userId)
  if (!user) return res.status(404).end()

  const reading_list = await ReadingList.create({ ...req.body, blogId: blog.id, userId: user.id })

  res.json(reading_list)
})

module.exports = router