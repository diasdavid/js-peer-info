'use strict'

const ensureMultiaddr = require('./utils').ensureMultiaddr

// Because JavaScript doesn't let you overload the compare in Set()..
class MultiaddrSet {
  constructor (multiaddrs) {
    this._multiaddrs = multiaddrs || []
    this._observedMultiaddrs = []
  }

  add (ma) {
    ma = ensureMultiaddr(ma)

    if (!this.multiaddrHas(ma)) {
      this.multiaddrs.push(ma)
    }
  }

  // to prevent multiaddr explosion due to identify
  addSafe (ma) {
    ma = ensureMultiaddr(ma)

    let check = false
    this._observedMultiaddrs.some((m, i) => {
      if (m.equals(ma)) {
        this.multiaddr.add(ma)
        this._observedMultiaddrs.splice(i, 1)
        check = true
      }
    })
    if (!check) {
      this._observedMultiaddrs.push(ma)
    }
  }

  toArray () {
    return this._multiaddrs
  }

  get length () {
    return this.multiaddrs.length
  }

  forEach (fn) {
    return this._multiaddrs.forEach(fn)
  }

  has (ma) {
    return this._multiaddrs.some((m) => m.equals(ma))
  }

  delete (ma) {
    ma = ensureMultiaddr(ma)

    this._multiaddrs.some((m, i) => {
      if (m.equals(ma)) {
        this.multiaddrs.splice(i, 1)
        return true
      }
    })
  }

  // replaces selected existing multiaddrs with new ones
  replace (existing, fresh) {
    if (!Array.isArray(existing)) {
      existing = [existing]
    }
    if (!Array.isArray(fresh)) {
      fresh = [fresh]
    }
    existing.forEach((m) => this.multiaddr.rm(m))
    fresh.forEach((m) => this.multiaddr.add(m))
  }

  clear () {
    this._multiaddrs = []
  }
}

module.exports = MultiaddrSet
