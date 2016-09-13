'use strict'

const Id = require('peer-id')
const multiaddr = require('multiaddr')

exports = module.exports = Peer

function ensureMultiaddr (addr) {
  if (multiaddr.isMultiaddr(addr)) {
    return addr
  }

  return multiaddr(addr)
}

// Peer represents a peer on the IPFS network
function Peer (peerId) {
  if (!(this instanceof Peer)) {
    return new Peer(peerId)
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

  // TODO: add features to fetch multiaddr using filters
  // look at https://github.com/whyrusleeping/js-mafmt/blob/master/src/index.js
}

Peer.create = (cb) => {
  Id.create((err, key) => {
    if (err) {
      return cb(err)
    }

    cb(null, new Peer(key))
  })
}
