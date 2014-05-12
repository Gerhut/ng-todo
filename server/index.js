var createServer = require('http').createServer
var byteLength = require('buffer').Buffer.byteLength

var items = new function (items) {
  var uid = 0
  var items = items || {}

  this.get = function (id) {
    if (id == null)
      return items
    if (id in items)
      return items[id]
    return null
  }

  this.post = function (newItem) {
    var item = {
      'id': uid++,
      'text': 'null',
      'finish': false
    }
    
    if('text' in newItem)
      item['text'] = '' + newItem['text']
    if('finish' in newItem)
      item['finish'] = !!newItem['finish']

    items[item.id] = item
    return item
  }

  this.patch = function (id, newItem) {
    if (!(id in items))
      return null
    
    var item = items[id]
    
    if('text' in newItem)
      item['text'] = '' + newItem['text']
    if('finish' in newItem)
      item['finish'] = !!newItem['finish']
    
    return item
  }

  this.delete = function (id) {
    if (!(id in items))
      return null

    var item = items[id]
    delete items[id]
    return item
  }
} ()

createServer(function (request, response) {
  try {
    var id
    if (request.url.length > 1)
      id = +request.url.slice(1)

    var body = ''
    while (true) {
      var chunk = request.read()
      if (chunk == null)
        break
      body += chunk
    }

    var newItem
    if (body.length > 0)
      newItem = JSON.parse(body)

    var item
    if (request.method == 'GET') {
      item = items.get(id)
      response.statusCode = 200
    } else if (request.method == 'POST') {
      item = items.post(newItem)
      response.statusCode = 201
    } else if (request.method == 'PATCH') {
      item = items.patch(id, newItem)
      response.statusCode = 200
    } else if (request.method == 'DELETE') {
      item = items.delete(id)
      response.statusCode = 204
    }

    if (item === null)
      return response.writeHead(404)

    if (response.statusCode == 204)
      return

    var location = 'http://' + request.headers['host'] + '/' + (item.id || '')
    var body = JSON.stringify(item)
    
    response.setHeader('Content-Type', 'application/json')
    response.setHeader('Content-Encoding', 'utf-8')
    response.setHeader('Content-Length', byteLength(body))
    response.setHeader('Content-Location', location)
    
    if (response.statusCode == 201)
      response.setHeader('Location', location)

    response.write(body)
  } catch(error) {
    var body = error.stack
    response.writeHead(400)
    response.write(body)
  } finally {
    response.end()
  }
}).listen(8000)
