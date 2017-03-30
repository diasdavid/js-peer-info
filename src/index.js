'use strict'

const Id = require('peer-id')
const multiaddr = require('multiaddr')
const uniqBy = require('lodash.uniqby')
const assert = require('assert')

function ensureMultiaddr (addr) {
  if (multiaddr.isMultiaddr(addr)) {
    return addr
  }

  return multiaddr(addr)
}

// Peer represents a peer on the IPFS network
class PeerInfo {
  constructor (peerId) {
    assert(peerId, 'Missing peerId. Use Peer.create(cb) to create one')

    this.id = peerId
    this.multiaddrs = []
    this.protocols = []
    this._observedMultiaddrs = []
    this._connectedMultiaddr = undefined
  }

  multiaddrAdd (addr) {
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

  // to prevent multiaddr explosion due to Identify
  multiaddrAddSafe (addr) {
    addr = ensureMultiaddr(addr)

    let check = false
    this._observedMultiaddrs.some((m, i) => {
      if (m.equals(addr)) {
        this.multiaddr.add(addr)
        this._observedMultiaddrs.splice(i, 1)
        check = true
      }
    })
    if (!check) {
      this._observedMultiaddrs.push(addr)
    }
  }

  multiaddrRemove (addr) {
    addr = ensureMultiaddr(addr)

    this.multiaddrs.some((m, i) => {
      if (m.equals(addr)) {
        this.multiaddrs.splice(i, 1)
        return true
      }
    })
  }

  multiaddrReplace (existing, fresh) {
    if (!Array.isArray(existing)) {
      existing = [existing]
    }
    if (!Array.isArray(fresh)) {
      fresh = [fresh]
    }
    existing.forEach((m) => this.multiaddr.rm(m))
    fresh.forEach((m) => this.multiaddr.add(m))
  }

  multiaddrUniq () {
    return uniqBy(this.multiaddrs, (item) => {
      return [item.toOptions().port, item.toOptions().transport].join()
    })
  }

  // only stores the current multiaddr being used
  connect (ma) {
    ma = ensureMultiaddr(ma)
    this._connectedMultiaddr = ma
  }

  disconnect () {
    this._connectedMultiaddr = undefined
  }

  isConnected () {
    return Boolean(this._connectedMultiaddr)
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

module.exports = PeerInfo
