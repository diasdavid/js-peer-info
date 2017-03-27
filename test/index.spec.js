/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
chai.use(dirtyChai)
const expect = chai.expect
const PeerId = require('peer-id')
const Multiaddr = require('multiaddr')
const PeerInfo = require('../src')

describe('peer-info', () => {
  let pi

  beforeEach((done) => {
    PeerInfo.create((err, _pi) => {
      if (err) {
        return done(err)
      }
      pi = _pi
      done()
    })
  })

  it('create with Id', (done) => {
    PeerId.create((err, id) => {
      expect(err).to.not.exist()
      const pi = new PeerInfo(id)
      const pi2 = PeerInfo(id)
      expect(pi.id).to.exist()
      expect(pi.id).to.deep.equal(id)
      expect(pi2).to.exist()
      expect(pi2.id).to.exist()
      expect(pi2.id).to.deep.equal(id)
      done()
    })
  })

  it('throws when not passing an Id', () => {
    expect(
      () => new PeerInfo()
    ).to.throw()
  })

  it('isPeerInfo', () => {
    expect(PeerInfo.isPeerInfo(pi)).to.equal(true)
    expect(PeerInfo.isPeerInfo(pi.id)).to.equal(false)
    expect(PeerInfo.isPeerInfo('bananas')).to.equal(false)
  })

  it('PeerInfo.create', (done) => {
    PeerInfo.create((err, pi) => {
      expect(err).to.not.exist()
      expect(pi.id).to.exist()
      done()
    })
  })

  it('PeerInfo.create with exist()ing id', (done) => {
    PeerId.create((err, id) => {
      expect(err).to.not.exist()
      PeerInfo.create(id, (err, pi) => {
        expect(err).to.not.exist()
        expect(pi.id).to.exist()
        expect(pi.id).to.deep.equal(id)
        done()
      })
    })
  })

  it('add multiaddr', () => {
    const mh = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    pi.multiaddr.add(mh)
    expect(pi.multiaddrs.length).to.equal(1)
  })

  it('add multiaddr that are buffers', () => {
    const mh = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    pi.multiaddr.add(mh.buffer)
    expect(pi.multiaddrs[0] instanceof Multiaddr).to.equal(true)
  })

  it('add repeated multiaddr', () => {
    const mh = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    pi.multiaddr.add(mh)
    expect(pi.multiaddrs.length).to.equal(1)
    pi.multiaddr.add(mh)
    expect(pi.multiaddrs.length).to.equal(1)
  })

  it('rm multiaddr', () => {
    const mh = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    pi.multiaddr.add(mh)
    expect(pi.multiaddrs.length).to.equal(1)
    pi.multiaddr.rm(mh)
    expect(pi.multiaddrs.length).to.equal(0)
  })

  it('addSafe - avoid multiaddr explosion', () => {
    const mh = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const mh2 = Multiaddr('/ip4/127.0.0.1/tcp/9002')
    const mh3 = Multiaddr('/ip4/127.0.0.1/tcp/9009')
    pi.multiaddr.addSafe(mh)
    expect(pi.multiaddrs.length).to.equal(0)
    pi.multiaddr.addSafe(mh)
    expect(pi.multiaddrs.length).to.equal(1)
    pi.multiaddr.addSafe(mh2)
    pi.multiaddr.addSafe(mh3)
    expect(pi.multiaddrs.length).to.equal(1)
  })

  it('addSafe - multiaddr that are buffers', () => {
    const mh = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    pi.multiaddr.addSafe(mh.buffer)
    pi.multiaddr.addSafe(mh.buffer)
    expect(pi.multiaddrs[0] instanceof Multiaddr).to.equal(true)
  })

  it('replace multiaddr', () => {
    const mh1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const mh2 = Multiaddr('/ip4/127.0.0.1/tcp/5002')
    const mh3 = Multiaddr('/ip4/127.0.0.1/tcp/5003')
    const mh4 = Multiaddr('/ip4/127.0.0.1/tcp/5004')
    const mh5 = Multiaddr('/ip4/127.0.0.1/tcp/5005')
    const mh6 = Multiaddr('/ip4/127.0.0.1/tcp/5006')

    pi.multiaddr.add(mh1)
    pi.multiaddr.add(mh2)
    pi.multiaddr.add(mh3)
    pi.multiaddr.add(mh4)

    expect(pi.multiaddrs.length).to.equal(4)

    const old = [mh2, mh4]
    const fresh = [mh5, mh6]

    pi.multiaddr.replace(old, fresh)

    expect(pi.multiaddrs.length).to.equal(4)
  })

  it('replace multiaddr (no arrays)', () => {
    const mh1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const mh2 = Multiaddr('/ip4/127.0.0.1/tcp/5002')
    const mh3 = Multiaddr('/ip4/127.0.0.1/tcp/5003')
    const mh4 = Multiaddr('/ip4/127.0.0.1/tcp/5004')
    const mh5 = Multiaddr('/ip4/127.0.0.1/tcp/5005')

    pi.multiaddr.add(mh1)
    pi.multiaddr.add(mh2)
    pi.multiaddr.add(mh3)
    pi.multiaddr.add(mh4)

    expect(pi.multiaddrs.length).to.equal(4)

    const old = mh2
    const fresh = mh5

    pi.multiaddr.replace(old, fresh)

    expect(pi.multiaddrs.length).to.equal(4)
  })

  it('get distinct multiaddr same transport multiple different ports', () => {
    const mh1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const mh2 = Multiaddr('/ip4/127.0.0.1/tcp/5002')
    const mh3 = Multiaddr('/ip4/127.0.0.1/tcp/5003')
    const mh4 = Multiaddr('/ip4/127.0.0.1/tcp/5004')

    pi.multiaddr.add(mh1)
    pi.multiaddr.add(mh2)
    pi.multiaddr.add(mh3)
    pi.multiaddr.add(mh4)

    var distinctMultiaddr = pi.distinctMultiaddr()
    expect(distinctMultiaddr.length).to.equal(4)
  })

  it('get distinct multiaddr same transport different port', () => {
    const mh1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const mh2 = Multiaddr('/ip4/127.0.0.1/tcp/5002')

    pi.multiaddr.add(mh1)
    pi.multiaddr.add(mh2)

    var distinctMultiaddr = pi.distinctMultiaddr()
    expect(distinctMultiaddr.length).to.equal(2)
  })

  it('get distinct multiaddr same transport same port', () => {
    const mh1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const mh2 = Multiaddr('/ip4/127.0.0.1/tcp/5001')

    pi.multiaddr.add(mh1)
    pi.multiaddr.add(mh2)

    var distinctMultiaddr = pi.distinctMultiaddr()
    expect(distinctMultiaddr.length).to.equal(1)
  })

  it('get distinct multiaddr different transport same port', () => {
    const mh1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const mh2 = Multiaddr('/ip4/127.0.0.1/udp/5001')

    pi.multiaddr.add(mh1)
    pi.multiaddr.add(mh2)

    var distinctMultiaddr = pi.distinctMultiaddr()
    expect(distinctMultiaddr.length).to.equal(2)
  })

  it('get distinct multiaddr different family same port same transport', () => {
    const mh1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const mh2 = Multiaddr('/ip6/::/tcp/5001')

    pi.multiaddr.add(mh1)
    pi.multiaddr.add(mh2)

    var distinctMultiaddr = pi.distinctMultiaddr()
    expect(distinctMultiaddr.length).to.equal(1)
  })

  it('get distinct multiaddr different family same port multiple transports', () => {
    const mh1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const mh2 = Multiaddr('/ip6/::/tcp/5001')
    const mh3 = Multiaddr('/ip6/::/udp/5002')
    const mh4 = Multiaddr('/ip4/127.0.0.1/udp/5002')

    pi.multiaddr.add(mh1)
    pi.multiaddr.add(mh2)
    pi.multiaddr.add(mh3)
    pi.multiaddr.add(mh4)

    var distinctMultiaddr = pi.distinctMultiaddr()
    expect(distinctMultiaddr.length).to.equal(2)

    expect(distinctMultiaddr[0].toOptions().family).to.equal('ipv4')
    expect(distinctMultiaddr[1].toOptions().family).to.equal('ipv6')
  })
})
