const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

blogsRouter.post('/', (request, response, next) => {
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

  blog
    .save()
    .then(saveBlog => response.json(saveBlog))
    .then(savedAndFormattedBlog => {
      response.json(savedAndFormattedBlog)
    })
    .catch(error => next(error))
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.send(`
        {
        <pre>
        <strong>id:</strong> <span style="color:green; font-weight:900;">${request.params.id}</span>
        <strong>title:</strong> <span style="color:green; font-weight:900;">${blog.title}</span>
        <strong>author:</strong> <span style="color:green; font-weight:900;">${blog.author}</span>
        <strong>url:</strong> <span style="color:green; font-weight:900;">${blog.url}</span>
        <strong>likes:</strong><span style="color:green; font-weight:900;"> ${blog.likes}</span>
        </pre>
        }
        `)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
  const paramBody = request.params
  const reqBody = request.body
  const resBody = response.req.body
  Blog.findByIdAndUpdate(paramBody.id, { $set: { author: resBody.author } }, { new: true },
    (error, data) => {
      if (error) error => next(error)
      else response.status(200).send(data)
      console.log(`Update author ${resBody.author} for title ${reqBody.title} with success`)
    })
})

blogsRouter.delete('/:id', (request, response, next) => {
  const body = request.params
  Blog.findByIdAndRemove(body.id)
    .then(() => {
      response.status(200).end()
    })
    .catch(error => next(error))
})
blogsRouter.get('/info', (request, response) => {
  response.send(`
  <h2>Blog has info for ${length} posts</h2>
  <h3>${new Date()}<h3>
  `)
})

module.exports = blogsRouter