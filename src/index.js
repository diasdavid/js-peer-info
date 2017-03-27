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

/**
 * Creates a new `PeerInfo` instance from an existing `PeerID`.
 * @class {PeerInfo}
 * @param {PeerId} peerId
 * @returns {PeerInfo}
 */
function PeerInfo (peerId) {
  if (!(this instanceof PeerInfo)) {
    return new PeerInfo(peerId)
  }

  if (!peerId) {
    throw new Error('Missing peerId. Use Peer.create(cb) to create one')
  }

  /**
   * The `PeerId` identifying this `PeerInfo`.
   *
   * @type {PeerId}
   */
  this.id = peerId

  /**
   * A list of `Multiaddr`s that this `peer` can be reached at.
   *
   * @type {Array<Multiaddr>}
   */
  this.multiaddrs = []
  const observedMultiaddrs = []

  /**
   *
   * @returns {Array<Array<mixed>>}
   */
  this.distinctMultiaddr = () => {
    var result = uniqBy(this.multiaddrs, function (item) {
      return [item.toOptions().port, item.toOptions().transport].join()
    })
    return result
  }

  this.multiaddr = {}

  /**
   * Adds a new multiaddress that `peer` can be reached at.
   * @param {Multiaddr} addr
   * @returns {undefined}
   * @alias multiaddr.add
   * @memberof PeerInfo#
   */
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

  /**
   * The `addSafe` call, in comparison to `add`, will only add the multiaddr to
   * `multiaddrs` if the same multiaddr tries to be added twice.
   *
   * This is a simple mechanism to prevent `multiaddrs` from becoming bloated with
   * unusable addresses, which happens when we exchange observed multiaddrs with
   * peers which will not provide a useful multiaddr to be shared to the rest of the
   * network (e.g. a multiaddr referring to a peer inside a LAN being shared to the
   * outside world).
   *
   * @param {Multiaddr} addr
   * @returns {undefined}
   * @alias multiaddr.addSafe
   * @memberof PeerInfo#
   */
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

  /**
   * Removes a multiaddress instance `addr` from `peer`.
   *
   * @param {Multiaddr} addr
   * @returns {undefined}
   * @alias multiaddr.rm
   * @memberof PeerInfo#
   */
  this.multiaddr.rm = (addr) => {
    addr = ensureMultiaddr(addr)

    this.multiaddrs.some((m, i) => {
      if (m.equals(addr)) {
        this.multiaddrs.splice(i, 1)
        return true
      }
    })
  }

  /**
   * Removes the array of multiaddresses `existing` from `peer`, and adds the array
   * of multiaddresses `fresh`.
   *
   * @param {Array} existing
   * @param {Array} fresh
   * @returns {undefined}
   * @alias multiaddr.replace
   * @memberof PeerInfo#
   */
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

/**
 * Creates a new PeerInfo instance and if no `id` is passed it
 * generates a new underlying [PeerID](https://github.com/libp2p/js-peer-id)
 * for it.
 *
 * @param {PeerId=} id
 * @param {function(Error, PeerInfo)} callback
 * @returns {undefined}
 */
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
