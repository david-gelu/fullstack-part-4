const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.title === undefined) {
    return response.status(400).json({ error: 'title is missing' })
  }
  if (body.author === undefined) {
    return response.status(400).json({ error: 'author is missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  const savedBlog = await blog.save()
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
  await Blog.findByIdAndRemove(body.id)
  response.status(200).end()
})

blogsRouter.get('/api/info', (request, response) => {
  response.send(`
  <h2>Blog has info for ${Blog.length - 1} posts</h2>
  <h3>${new Date()}<h3>
  `)
})

module.exports = blogsRouter