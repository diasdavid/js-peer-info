'use strict'

const Id = require('peer-id')
const multiaddr = require('multiaddr')
const uniqBy = require('lodash.uniqby')

exports = module.exports = PeerInfo

function ensureMultiaddr (addr) {
  if (multiaddr.isMultiaddr(addr)) {
    return addr
  }

  return multiaddr(addr)
}

// Peer represents a peer on the IPFS network
function PeerInfo (peerId) {
  if (!(this instanceof PeerInfo)) {
    return new PeerInfo(peerId)
  }

  if (!peerId) {
    throw new Error('Missing peerId. Use Peer.create(cb) to create one')
  }

  this.id = peerId

  this.multiaddrs = []
  const observedMultiaddrs = []

  this.multiaddr = {}

  this.multiaddr.add = (addr) => {
    addr = ensureMultiaddr(addr)

    var exists = false
    this.multiaddrs.some((m, i) => {
      if (m.equals(addr)) {
        exists = true
        return true
      }
    })
    if (!exists) {
      this.multiaddrs.push(addr)
    }
  }

  // to prevent multiaddr explosion
  this.multiaddr.addSafe = (addr) => {
    addr = ensureMultiaddr(addr)

    var check = false
    observedMultiaddrs.some((m, i) => {
      if (m.equals(addr)) {
        this.multiaddr.add(addr)
        observedMultiaddrs.splice(i, 1)
        check = true
      }
    })
    if (!check) {
      observedMultiaddrs.push(addr)
    }
  }

  this.multiaddr.rm = (addr) => {
    addr = ensureMultiaddr(addr)

    this.multiaddrs.some((m, i) => {
      if (m.equals(addr)) {
        this.multiaddrs.splice(i, 1)
        return true
      }
    })
  }

  this.multiaddr.replace = (existing, fresh) => {
    if (!Array.isArray(existing)) {
      existing = [existing]
    }
    if (!Array.isArray(fresh)) {
      fresh = [fresh]
    }
    existing.forEach((m) => {
      this.multiaddr.rm(m)
    })
    fresh.forEach((m) => {
      this.multiaddr.add(m)
    })
  }

  this.distinctMultiaddr = () => {
    var result = uniqBy(this.multiaddrs, function (item) {
      return [item.toOptions().port, item.toOptions().transport].join()
    })
    return result
  }
}

PeerInfo.create = (id, callback) => {
  if (typeof id === 'function') {
    callback = id
    id = null

    Id.create((err, id) => {
      if (err) {
        return callback(err)
      }

      callback(null, new PeerInfo(id))
    })
    return
  }

  callback(null, new PeerInfo(id))
}

PeerInfo.isPeerInfo = (peerInfo) => {
  return Boolean(typeof peerInfo === 'object' &&
    peerInfo.id &&
    peerInfo.multiaddrs)
}
