const router = require('express').Router()

const { Blog, ReadingList, User } = require('../models')
const { userExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  
  const blog = await Blog.findByPk(req.body.blogId)
  if (!blog) return res.status(404).end()

  const user = await User.findByPk(req.body.userId)
  if (!user) return res.status(404).end()

  const reading_list = await ReadingList.create({ ...req.body, blogId: blog.id, userId: user.id })

  res.json(reading_list)
})

router.put('/:id', userExtractor, async (req, res) => {
  const { body: { read } } = req;

  const user = await User.findByPk(req.decodedToken.id);
  if (!user) return res.status(401).end();

  const reading_list = await ReadingList.findByPk(req.params.id);
  if (!reading_list) return res.status(404).end();

  if (user.id !== reading_list.userId) return res.status(401).end();

  reading_list.read = read === 'true' || read === true;
  await reading_list.save();

  res.json(reading_list);
})

module.exports = router