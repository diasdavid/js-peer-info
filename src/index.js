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
    this._observedMultiaddrs = []
    this._connectedMultiaddr = undefined

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

    // to prevent multiaddr explosion due to Identify
    this.multiaddr.addSafe = (addr) => {
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
      existing.forEach((m) => this.multiaddr.rm(m))
      fresh.forEach((m) => this.multiaddr.add(m))
    }
  }

  distinctMultiaddr () {
    return uniqBy(this.multiaddrs, (item) => {
      return [item.toOptions().port, item.toOptions().transport].join()
    })
  }

  setConnectedMultiaddr (ma) {
    ma = ensureMultiaddr(ma)
    this._connectedMultiaddr = ma
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
