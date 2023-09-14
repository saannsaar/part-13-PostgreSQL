require('dotenv').config()
const { Sequelize, Model, QueryTypes, DataTypes } = require('sequelize')

const express = require('express')
const app = express()
app.use(express.json())


const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model {}
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    author: {
        type: DataTypes.STRING,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    // Table names are derived from model names as plural snake case versions
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})
Blog.sync()

app.get('/api/blogs', async(req, res) => {
    const blogs = await Blog.findAll()
    // console.log('Executing (default): SELECT * FROM blogs')
    // blogs.forEach((blog) => {
    //     console.log(`${blog.author}: ${blog.title}, ${blog.likes} likes`)
    // })

    console.log(JSON.stringify(blogs))

    res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
   console.log(req.body)
   try {
    console.log(req.body)
    const blog = await Blog.create(req.body)
    res.json(blog)
   } catch(error) {
    return res.status(400).json({ error })
   }
  })

  app.get('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        res.json(blog)
    } else {
        res.status(404).end()
    }
  })
 
app.delete('/api/blogs/:id', async(req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    await blog.destroy()
    res.json(blog)
})
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
