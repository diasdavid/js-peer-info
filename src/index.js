'use strict'

const PeerId = require('peer-id')
const { ensureMultiaddr } = require('./utils')
const MultiaddrSet = require('./multiaddr-set')

// Peer represents a peer on the IPFS network
class PeerInfo {
  constructor (peerId) {
    if (!peerId) {
      throw new Error('Missing peerId. Use Peer.create() to create one')
    }

    this.id = peerId
    this.multiaddrs = new MultiaddrSet()

    /**
     * Stores protocols this peers supports
     *
     * @type {Set<string>}
     */
    this.protocols = new Set()

    this._connectedMultiaddr = undefined
  }

  // only stores the current multiaddr being used
  connect (ma) {
    ma = ensureMultiaddr(ma)
    if (!this.multiaddrs.has(ma) && ma.toString() !== `/ipfs/${this.id.toB58String()}`) {
      throw new Error('can\'t be connected to missing multiaddr from set')
    }
    this._connectedMultiaddr = ma
  }

  disconnect () {
    this._connectedMultiaddr = undefined
  }

  isConnected () {
    return this._connectedMultiaddr
  }
}

PeerInfo.create = async (peerId) => {
  if (peerId == null) {
    peerId = await PeerId.create()
  } else if (!PeerId.isPeerId(peerId)) {
    peerId = await PeerId.createFromJSON(peerId)
  }

  return new PeerInfo(peerId)
}

PeerInfo.isPeerInfo = (peerInfo) => {
  return Boolean(typeof peerInfo === 'object' &&
    peerInfo.id &&
    peerInfo.multiaddrs)
}

module.exports = PeerInfo
