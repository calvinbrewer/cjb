
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
      relay: { enabled: true, hop: { enabled: true, active: true }}
    });

    this.orbitdb = await this.OrbitDB.createInstance(this.node);

    const docStoreOptions = {
      indexBy: 'hash',
    }

    this.counter = await this.orbitdb.counter('mycounter', docStoreOptions);
    await this.counter.load();

    await this.node.libp2p.on('peer:connect', this.handlePeerConnected.bind(this));

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

  async connectToPeer (multiaddr, protocol = "/p2p-circut/ipfs/") {
    try {
      await this.node.swarm.connect(protocol + multiaddr);
    } catch (e) {
      throw (e);
    }
  }

  handlePeerConnected (ipfsPeer) {
    const ipfsId = ipfsPeer.id._idB58String;
    if(this.onpeerconnect) this.onpeerconnect(ipfsId); 
  }
}

const NPP = new NewPiecePlease(Ipfs, OrbitDB);

NPP.onready = () => {
  console.log(NPP.orbitdb.id);
}

NPP.onpeerconnect = console.log;

NPP._init().then(async () => {
  await NPP.incrementCounter();
  console.log(NPP.readCounter());
  console.log(await NPP.getPeers());
  await NPP.connectToPeer('QmaSYy4dN3sDEaketVeuwkFytPiYEcYW5ezLLBZyhUCpPq');
});


// try {
//   module.exports = exports = new NewPiecePlease(Ipfs, OrbitDB);
// } catch (e) {
//   window.NPP = new NewPiecePlease(window.Ipfs, window.OrbitDB);
// }