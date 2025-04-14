function errorsHandler(err, req, res, next) {
  res.status(500)
  res.json({
    err: err.message
  })
}

module.exports = errorsHandler