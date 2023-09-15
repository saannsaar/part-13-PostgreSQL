const router = require('express').Router()
const { Op } = require('sequelize') 
const { Blog, User } = require('../models')
const { userExtractor }  = require('../util/middleware')
const logger = require('../util/logger')

router.get('/', async(req, res) => {

    const blogs = await Blog.findAll({


        attributes: { exclude: ['userId'] },
        include: { model: User, attributes: ['username', 'name'] },
        where: {
            [Op.or]: {
                title: {
                    [Op.iLike]: req.query.search ? `%${req.query.search}` : '',
                },
                author: {
                    [Op.iLike]: req.query.search ? `%${req.query.search}` : '',
                }
            },
        },
        order: [['likes', 'DESC']],
    })


    console.log(JSON.stringify(blogs))

    res.json(blogs)
})

router.post('/', userExtractor, async (req, res) => {
    const { body, decodedToken: { id: userId } } = req;
  
    const user = await User.findByPk(userId)
    if (!user) res.status(401).end();
    logger.info('user', user.id, JSON.stringify(user, null, 2));
    const blog = await Blog.create({ ...body, userId: user.id });
    logger.info(JSON.stringify(blog, null, 2));
  
    res.json(blog);
  })


  const blogFinder = async (req,res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  }

router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
  })
 
router.delete('/:id', userExtractor, blogFinder, async(req, res) => {

    const { decodedToken: { id: userId } } = req
    const user = await User.findByPk(userId)

    if (!user || user.id !== req.blog?.userId ) return res.status(401).end()

    if (req.blog) {
        await req.blog.destroy()
    }
        res.status(204).end()
})

router.put('/:id', blogFinder, async(req, res) => {
    try {
        const blog = req.blog

        console.log(blog)
        // If blog is not found, end
        if (!blog) res.status(404).end()

        // If query does not contain likes property do not update blog
        if (!req.body.likes) return res.json(blog)

        else blog.likes = req.body.likes
        await blog.save()

        res.json(blog)
        } catch(error) {
            res.status(400).json({ error })
        }
})

module.exports = router