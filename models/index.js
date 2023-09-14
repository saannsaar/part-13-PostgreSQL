const Blog = require('./blog')
const User = require('./user')

// Defining that there is a one-to-many relationship connection between
// users and notes entries
User.hasMany(Blog)
Blog.belongsTo(User)

Blog.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
    Blog, User
}