var createServer = require('http').createServer
var byteLength = require('buffer').Buffer.byteLength

var itemResource = new function (originItems) {
  var uid = 1
  var items = {}

  this.get = function (id) {
    if (id == null) {
      return Object.keys(items).map(function (id) {
        return items[id]
      })
    }
    if (id in items)
      return items[id]
    return null
  }

  this.post = function (newItem) {
    var item = {
      'id': uid++,
      'text': 'Unnamed',
      'finish': false
    }
    
    if('text' in newItem)
      item['text'] = '' + newItem['text']
    if('finish' in newItem)
      item['finish'] = !!newItem['finish']

    items[item.id] = item
    return item
  }

  this.put = function (id, newItem) {
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

  if (Array.isArray(originItems)) {
    originItems.forEach(this.post)
  }
} ([
  { text: '吃饭' },
  { text: '睡觉' },
  { text: '打豆豆', finish: true }
])


createServer(function (request, response) {

  function receive(callback) {
    var body = ''
    request.on('data', function (chunk) {
      body += chunk
    }).on('end', function () {
      callback(JSON.parse(body))
    })
  }

  function send(object) {
    var body = JSON.stringify(object)

    response.setHeader('Content-Type', 'application/json')
    response.setHeader('Content-Encoding', 'utf-8')
    response.setHeader('Content-Length', byteLength(body))
    response.write(body)
  }

  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE')

  if (request.method == 'OPTIONS') {
    response.setHeader('Allow', 'OPTIONS, GET, POST, PUT, DELETE')
    return response.end()
  }

  var id = +request.url.slice(1) || undefined
  var baseLocation = 'http://' + request.headers['host'] + '/'

  if (request.method == 'GET') {
    if (id) {
      var item = itemResource.get(id)
      response.statusCode = item ? 200 : 404
      if (item) {
        response.setHeader('Content-Location', baseLocation + item.id)
        send(item)
      }
      return response.end()
    } else {
      var items = itemResource.get()
      response.statusCode = 200
      response.setHeader('Content-Location', baseLocation)
      send(items)
      return response.end()
    }
  } else if (request.method == 'DELETE' && id) {
    var item = itemResource.delete(id)
    response.statusCode = item ? 204 : 404
    return response.end()
  }

  receive(function (newItem) {
    if (!newItem) {
      response.statusCode = 400
    } else if (request.method == 'POST' && !id) {
      item = itemResource.post(newItem)
      response.statusCode = 201
      response.setHeader('Location', baseLocation + item.id)
      response.setHeader('Content-Location', baseLocation + item.id)
      send(item)
    } else if (request.method == 'PUT' && id) {
      item = itemResource.put(id, newItem)
      response.statusCode = item ? 200 : 404
      if (item) {
        response.setHeader('Content-Location', baseLocation + item.id)
        send(item)
      }
    } else {
      response.statusCode = 400
    }
    return response.end()
  })
}).listen(8000)
