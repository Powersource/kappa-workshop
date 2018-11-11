var hypercore = require('hypercore')
var pump = require("pump")
var disco = require("discovery-swarm")
var feed = hypercore('./single-chat-feed', {
    valueEncoding: 'json'
})

var swarm = disco()

feed.ready(function () {
    console.log("pub", feed.key.toString("hex"))
    swarm.join(feed.discoveryKey)
    swarm.on("connection", function (connection) {
        pump(connection, feed.replicate({ live: true }), connection)
    })
})

feed.createReadStream({ live: true })
  .on("data", function(data) { 
      console.log("rsdata->", data)
  })

process.stdin.on("data", function(data) { 
    feed.append({ 
        type: 'chat-message',
        nickname: 'dat-lover',
        text: data.toString(), 
        timestamp: new Date().toISOString()
    })
})