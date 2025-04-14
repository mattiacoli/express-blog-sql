const connection = require('../data/db')
const posts = require('../data/posts')

// index
function index(req, res) {

  const sql = 'SELECT * FROM posts'

  connection.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: 'Query Failed' })
    console.log(result);
    res.json(result)

  })
}

// show
function show(req, res) {
  const postId = req.params.id
  const post = posts.find(post => post.id === Number(postId))
  if (!post) {
    return res.status(404).json({
      error: "error 404",
      message: "post not found"
    })
  }
  res.json(post)
}

// store
function store(req, res) {

  // create new object
  const newPost = {
    title: req.body.title,
    slug: req.body.slug,
    content: req.body.content,
    image: req.body.image,
    tags: req.body.tags
  }
  // save new object in array
  posts.push(newPost)
  // log the array with the new post
  console.log(posts);
  // return new post on postman
  res.status(201).json(newPost)

}

// update
function update(req, res) {
  // find post by slug
  const postId = req.params.id
  const post = posts.find(post => post.id === Number(postId))
  // handle message 404 if post not found
  if (!post) {
    return res.status(404).json({
      error: "error 404",
      message: "post not found"
    })
  }

  // edit all object key
  post.title = req.body.title
  post.slug = req.body.title.replaceAll(' ', '-').toLowerCase()
  post.content = req.body.content
  post.image = req.body.image
  post.tags = req.body.tags

  // check edits in array
  console.log(posts);

  // return edited post on postman
  res.json(post)
}

// modify
function modify(req, res) {
  // find post by slug
  const postId = req.params.id
  const post = posts.find(post => post.id === Number(postId))
  // handle message 404 if post not found
  if (!post) {
    return res.status(404).json({
      error: "error 404",
      message: "post not found"
    })
  }
  // modify some key of the object
  post.title = req.body.title
  post.slug = req.body.title.replaceAll(' ', '-').toLowerCase()
  post.content = req.body.content

  // check changes in array
  console.log(posts);

  // return modified post on postman
  res.json(post)

}

// destroy
function destroy(req, res) {

  const postId = req.params.id

  const sql = 'DELETE FROM posts WHERE id=?'

  connection.query(sql, [postId], (err) => {
    if (err) return res.status(500).json({ error: 'Query Failed' })

    res.sendStatus(204)
  })
}

module.exports = { index, show, store, update, modify, destroy }