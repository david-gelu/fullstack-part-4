const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const dummyBlogs = (blogsArr) => {
  return blogsArr.length === 0
    ? 0
    : blogsArr.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogsArr) => {
  return Math.max(...blogsArr.map(f => f.likes), 0)
}
const mostBlogs = (blogsArr) => {
  const authorWhithMostBlogs = blogsArr.map(a => a.author).filter(a => a === 'Robert C. Martin')
  const result = _.uniq(_.filter(authorWhithMostBlogs, (v, i, a) => a.indexOf(v) !== i))
  return { author: result[0], blogs: authorWhithMostBlogs.length }
}
const mostLikes = (blogsArr) => {
  const authorWhithMostLikes = blogsArr.map(a => a.author)
  const result = _.uniq(_.filter(authorWhithMostLikes, (v, i, a) => a.indexOf(v) !== i))
  const mostLikes = Math.max(...blogsArr.map(f => f.likes), 0)
  return { author: result[0], likes: mostLikes }
}

module.exports = {
  dummy,
  dummyBlogs,
  favoriteBlog,
  mostBlogs,
  mostLikes
}