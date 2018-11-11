const hypercore = require("hypercore");
const discovery = require("discovery-swarm");

const feed = hypercore("./single-chat-feed", {
  valueEncoding: "json"
});

feed.ready(function() {
  console.log("public key:", feed.key.toString("hex"));
  console.log("discovery key:", feed.discoveryKey.toString("hex"));
  console.log("secret key:", feed.secretKey.toString("hex"));
});

const swarm = discovery();

feed.ready(() => {
  swarm.join(feed.discoveryKey);
});

swarm.on("connection", function(connection, info) {
  // `info `is a simple object that describes the peer we connected to
  //console.log("found a peer", info);

  // `connection` is a duplex stream that you read from and write to

  process.stdin.on("data", function(data) {
    appendMsg(data);
    connection.write(data);
  });

  //connection.on("data", function(data) {
  //  appendMsg(data);
  //});
});

feed.createReadStream({ live: true }).on("data", function(data) {
  console.log(data);
});

function appendMsg(msg) {
  feed.append({
    type: "chat-message",
    nickname: "cat-lover",
    text: msg.toString().trim(),
    timestamp: new Date().toISOString()
  });
}
