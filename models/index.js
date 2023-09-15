const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')
const Session = require('./session')

// Defining that there is a one-to-many relationship connection between
// users and notes entries
Blog.belongsTo(User)
User.hasMany(Blog)


User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'in_readinglist_of' })
// Blog.sync({ alter: true })
// User.sync({ alter: true })

module.exports = {
    Blog, User, ReadingList, Session
}