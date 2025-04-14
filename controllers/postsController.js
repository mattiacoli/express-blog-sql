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

  const sql = 'SELECT * FROM posts WHERE id=?'

  const sqlJoin = `
  SELECT tags.*
  FROM tags
  JOIN post_tag ON tags.id = post_tag.tag_id
  WHERE post_tag.post_id = ?

  `

  connection.query(sql, [postId], (error, postResult) => {
    if (error) return res.status(500).json({ error: `Query Failed` })
    if (postResult.length === 0) return res.status(400).json({ message: 'Post not found' })
    const post = postResult[0]



    connection.query(sqlJoin, [postId], (err, tagsResult) => {
      if (err) return res.status(500).json({ error: `Query Failed` })
      post.tags = tagsResult
      res.json(post)
    })
  })

}

// store
function store(req, res) {

  // create new object
  const { title, content, image } = req.body;

  const sql = `INSERT INTO posts(title, content, image) VALUES(?, ?, ?);`
  const values = [title, content, image]

  connection.query(sql, values, (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(201).json({ message: 'Post create successfully' })
  })
}

// update
function update(req, res) {

  const postId = req.params.id

  const { title, content, image } = req.body


  const sql = 'UPDATE posts SET title = ?, content=?, image=? WHERE(id =?);'

  const values = [title, content, image, postId]

  connection.query(sql, values, (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    if (results.length === 0) res.status(404).json({ message: 'Post not found' })
    res.status(200).json({ message: 'Post update successfully' })
    const post = results[0]
    res.json(post)
  })

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