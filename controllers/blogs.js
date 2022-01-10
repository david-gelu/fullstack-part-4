const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(note => note.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (body.title === undefined) {
    return response.status(400).json({ error: 'title is missing' }).end()
  }
  if (body.author === undefined) {
    return response.status(400).json({ error: 'author is missing' }).end()
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  savedBlog.populate('user', { username: 1, name: 1, id: 1 })
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.send(
      `
        {
        <pre>
        <strong>id:</strong> <span style="color:green; font-weight:900;">${request.params.id}</span>
        <strong>title:</strong> <span style="color:green; font-weight:900;">${blog.title}</span>
        <strong>author:</strong> <span style="color:green; font-weight:900;">${blog.author}</span>
        <strong>url:</strong> <span style="color:green; font-weight:900;">${blog.url}</span>
        <strong>likes:</strong><span style="color:green; font-weight:900;"> ${blog.likes}</span>
        </pre>
        }`
    )
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const paramBody = request.params
  const reqBody = request.body
  const resBody = response.req.body
  await Blog.findByIdAndUpdate(paramBody.id, { $set: { author: resBody.author } }, { new: true },
    (error, data) => {
      if (error) error => next(error)
      else response.status(200).send(data)
      console.log(`Update author ${resBody.author} for title ${reqBody.title} with success`)
    })
})

blogsRouter.delete('/:id', async (request, response) => {
  const body = request.params
  const user = request.user
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  await Blog.findByIdAndRemove(body.id === user.id)
  response.status(200).end()
})

blogsRouter.get('info', (request, response) => {
  response.send(`
  <h2>Blog has info for ${request.length} posts</h2>
  <h3>${new Date()}<h3>
  `)
})

module.exports = blogsRouter