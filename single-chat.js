const hypercore = require("hypercore");
const discovery = require("discovery-swarm");

const feed = hypercore("./single-chat-feed", {
  valueEncoding: "json"
});

const swarm = discovery();

swarm.join("retreat");

swarm.on("connection", function(connection, info) {
  // `info `is a simple object that describes the peer we connected to
  //console.log("found a peer", info);

  // `connection` is a duplex stream that you read from and write to

  process.stdin.on("data", function(data) {
    appendMsg(data);
    connection.write(data);
  });

  connection.on("data", function(data) {
    console.log(data.toString());
    appendMsg(data)
  });
});

function appendMsg(msg) {
  feed.append({
    type: "chat-message",
    nickname: "cat-lover",
    text: msg.toString().trim(),
    timestamp: new Date().toISOString()
  });
}
