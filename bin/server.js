#!/usr/bin/env node
/* global process */
require('dotenv').config()
const debug = require('debug')('boiler-express:server')
const http = require('http')

const createServer = app => {
  const server = http.createServer(app)
  const port = normalizePort(process.env.PORT || '3000')
  server.listen(port)
  server.on('error', onError.bind(null, port))
  server.on('listening', onListening.bind(null, server))
  return port
}

function normalizePort(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

function onError(error, port) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening(server) {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}

module.exports = {
  createServer,
}
