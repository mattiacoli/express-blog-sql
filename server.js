const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000
const postsRouter = require('./routers/post_routers')
const serverErrors = require('./middlewares/serverErrors')
const notFound = require('./middlewares/notFound')

// middleware for body-parser
app.use(express.json())

// middleware for static assets
app.use(express.static('public'))

//middleware for Cors
app.use(cors({
  origin: 'http://localhost:5173'
}))

// post endpoint
app.use('/posts', postsRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})

// basic route
app.get('/', (req, res) => {
  res.send('Welcome to server')
})



// Server error middleware
app.use(serverErrors)

// 404 error middleware
app.use(notFound)


