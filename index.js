require('dotenv').config()
const { Sequelize, Model, QueryTypes, DataTypes } = require('sequelize')

const express = require('express')
const app = express()


const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model {}
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
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

app.get('/api/blogs', async(req, res) => {
    const blogs = await Blog.findAll()
    console.log('Executing (default): SELECT * FROM blogs')
    blogs.forEach((blog) => {
        console.log(`${blog.author}: ${blog.title}, ${blog.likes} likes`)
    })
    res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
   try {
    console.log(req.body)
    const blog = await Blog.create(req.body)
    res.json(blog)
   } catch(error) {
    return res.status(400).json({ error })
   }
  })

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
