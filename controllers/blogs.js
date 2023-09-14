const router = require('express').Router()

const { Blog, User } = require('../models')



router.get('/', async(req, res) => {
    const blogs = await Blog.findAll()
    // console.log('Executing (default): SELECT * FROM blogs')
    // blogs.forEach((blog) => {
    //     console.log(`${blog.author}: ${blog.title}, ${blog.likes} likes`)
    // })

    console.log(JSON.stringify(blogs))

    res.json(blogs)
})

router.post('/', async (req, res) => {
   console.log(req.body)
   try {
    
    console.log(req.body)
    const user = await User.findOne()
    const blog = await Blog.create({...req.body, userId: user.id})
    res.json(blog)
   } catch(error) {
    return res.status(400).json({ error })
   }
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
 
router.delete('/:id', blogFinder, async(req, res) => {
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