const { response } = require('express')
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "My first blog",
    author: "David",
    url: "https://davidgelu.netlify.com",
    likes: 10000
  },
  {
    title: "My portfolio",
    author: "David Gelu",
    url: "https://davidgelu.netlify.com",
    likes: 10000
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'Just for testing', author: 'Mos Nicolae', date: new Date() })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}