
const Ipfs = require('ipfs');
const OrbitDB = require('orbit-db');

class NewPiecePlease {
  constructor (IPFS, OrbitDB) {
    this.OrbitDB = OrbitDB;
    this.ipfs = IPFS;
    this.counter = this.counter;
    this.node = this.node;
  }

  async _init () {
    this.node = await this.ipfs.create({
      EXPERIMENTAL: { pubsub: true },
      repo: "./ipfs",
      relay: { enabled: true, hop: { enabled: true, active: true }},
      config: {
        Addresses: {
          API: '/ip4/127.0.0.1/tcp/0',
          Swarm: [
            '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
            '/ip4/0.0.0.0/tcp/4002', 
            '/ip4/127.0.0.1/tcp/4003/ws', 
          ],
          Gateway: '/ip4/0.0.0.0/tcp/0'
        },
        Bootstrap: [],
        Discovery: {
          MDNS: {
            Enabled: true,
            Interval: 10
          },
          webRTCStar: {
            Enabled: true
          }
        }
      }
    });
    
    this.orbitdb = await this.OrbitDB.createInstance(this.node);

    const nodeInfo = this.node.id();
    const docStoreOptions = {
      indexBy: 'hash',
      accessController: {
        write: ['*'],
      },
    }

    this.counter = await this.orbitdb.counter('mytestcounter', docStoreOptions);
    await this.counter.load();

    await this.node.libp2p.on('peer:connect', this.handlePeerConnected.bind(this));
    await this.node.pubsub.subscribe(nodeInfo.id, this.handleMessageReceived.bind(this));

    this.onready();
  }

  async incrementCounter () {
    await this.counter.inc();
  }

  readCounter () {
    return this.counter.value;
  }

  async getPeers () {
    const peers = await this.node.swarm.peers();
    return peers;
  }

  async connectToPeer (multiaddr, protocol = "/ip4/159.89.92.87/tcp/4002/p2p/") {

    try {
      await this.node.swarm.connect(protocol + multiaddr);
    } catch (e) {
      throw (e);
    }
  }

  handlePeerConnected (ipfsPeer) {
    const ipfsId = ipfsPeer.id._idB58String;
    console.log("Yo:", ipfsId);
    setTimeout(async () => {
      await this.sendMessage(ipfsId, { userDb: this.user.id });
    }, 2000);
    if(this.onpeerconnect) this.onpeerconnect(ipfsId); 
  }

  async handleMessageReceived (msg) {
    const parsedMsg = JSON.parse(msg.data.toString());
    const msgKeys = Object.keys(parsedMsg);

    console.log("Hello:", msgKeys[0]);

    switch(msgKeys[0]) {
      case "userDb":
        const peerDb = await this.orbitdb.open(parsedMsg.userDb);
        
        peerDb.events.on("replicated", async () => {
          if(peerDb.get("pieces")) {
            this.ondbdiscovered && this.ondbdiscovered(peerDb)
          }
        })
      break;
      default:
        break;
    }

    if (this.onmessage) this.onmessage(msg);
  }

  async sendMessage (topic, message, callback) {
    try {
      const msgString = JSON.stringify(message);
      const messageBuffer = this.node.types.Buffer(msgString);
      await this.node.pubsub.publish(topic, messageBuffer);
    } catch (e) {
      throw (e);
    }
  }
}

const NPP = new NewPiecePlease(Ipfs, OrbitDB);

NPP.onready = () => {
  console.log(NPP.orbitdb.id);
}

NPP.ondbdiscovered = (db) => console.log(db.all());

NPP.onpeerconnect = console.log;
NPP.onmessage = console.log;

NPP._init().then(async () => {
  await NPP.incrementCounter();
  await NPP.node.config.set("Addresses.Swarm", [
    '/ip4/0.0.0.0/tcp/4002', 
    '/ip4/127.0.0.1/tcp/4003/ws',
    '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
  ]);

  console.log(NPP.readCounter());
  console.log(await NPP.getPeers());
  // console.log(await NPP.node.bootstrap.list());
  console.log(await NPP.connectToPeer('QmWvut6LyLC1BSay1JnzFZmsfeoZvRA3wDjkTunjMS68pK'));
  console.log(await NPP.getPeers());
  console.log(NPP.readCounter());
});

const express = require('express');
const app = express();

app.get('/', async (req, res) => {
  await NPP.incrementCounter();
  const count = NPP.readCounter();

  res.send(`The counter is: ${count}`);
});

app.listen(3000);


// try {
//   module.exports = exports = new NewPiecePlease(Ipfs, OrbitDB);
// } catch (e) {
//   window.NPP = new NewPiecePlease(window.Ipfs, window.OrbitDB);
// }