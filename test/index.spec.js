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
      const pi2 = new PeerInfo(id)
      expect(pi.id).to.exist()
      expect(pi.id).to.eql(id)
      expect(pi2).to.exist()
      expect(pi2.id).to.exist()
      expect(pi2.id).to.eql(id)
      done()
    })
  })

  it('throws when not passing an Id', () => {
    expect(() => new PeerInfo()).to.throw()
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

  it('PeerInfo.create with existing id', (done) => {
    PeerId.create((err, id) => {
      expect(err).to.not.exist()
      PeerInfo.create(id, (err, pi) => {
        expect(err).to.not.exist()
        expect(pi.id).to.exist()
        expect(pi.id.isEqual(id)).to.equal(true)
        done()
      })
    })
  })

  it('add multiaddr', () => {
    const ma = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    pi.multiaddrs.add(ma)
    expect(pi.multiaddrs.size).to.equal(1)
  })

  it('add multiaddr that are buffers', () => {
    const ma = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    pi.multiaddrs.add(ma.buffer)
    expect(pi.multiaddrs.has(ma)).to.equal(true)
  })

  it('add repeated multiaddr', () => {
    const ma = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    pi.multiaddrs.add(ma)
    expect(pi.multiaddrs.size).to.equal(1)
    pi.multiaddrs.add(ma)
    expect(pi.multiaddrs.size).to.equal(1)
  })

  it('delete multiaddr', () => {
    const ma = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    pi.multiaddrs.add(ma)
    expect(pi.multiaddrs.size).to.equal(1)
    pi.multiaddrs.delete(ma)
    expect(pi.multiaddrs.size).to.equal(0)
  })

  it('addSafe - avoid multiaddr explosion', () => {
    const ma = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const ma2 = Multiaddr('/ip4/127.0.0.1/tcp/9002')
    const ma3 = Multiaddr('/ip4/127.0.0.1/tcp/9009')
    pi.multiaddrs.addSafe(ma)
    expect(pi.multiaddrs.size).to.equal(0)
    pi.multiaddrs.addSafe(ma)
    expect(pi.multiaddrs.size).to.equal(1)
    pi.multiaddrs.addSafe(ma2)
    pi.multiaddrs.addSafe(ma3)
    expect(pi.multiaddrs.size).to.equal(1)
  })

  it('addSafe - multiaddr that are buffers', () => {
    const ma = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    pi.multiaddrs.addSafe(ma.buffer)
    pi.multiaddrs.addSafe(ma.buffer)
    expect(pi.multiaddrs.has(ma)).to.equal(true)
  })

  it('replace multiaddr', () => {
    const ma1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const ma2 = Multiaddr('/ip4/127.0.0.1/tcp/5002')
    const ma3 = Multiaddr('/ip4/127.0.0.1/tcp/5003')
    const ma4 = Multiaddr('/ip4/127.0.0.1/tcp/5004')
    const ma5 = Multiaddr('/ip4/127.0.0.1/tcp/5005')
    const ma6 = Multiaddr('/ip4/127.0.0.1/tcp/5006')

    pi.multiaddrs.add(ma1)
    pi.multiaddrs.add(ma2)
    pi.multiaddrs.add(ma3)
    pi.multiaddrs.add(ma4)

    expect(pi.multiaddrs.size).to.equal(4)

    const old = [ma2, ma4]
    const fresh = [ma5, ma6]

    pi.multiaddrs.replace(old, fresh)

    expect(pi.multiaddrs.size).to.equal(4)
  })

  it('replace multiaddr (no arrays)', () => {
    const ma1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const ma2 = Multiaddr('/ip4/127.0.0.1/tcp/5002')
    const ma3 = Multiaddr('/ip4/127.0.0.1/tcp/5003')
    const ma4 = Multiaddr('/ip4/127.0.0.1/tcp/5004')
    const ma5 = Multiaddr('/ip4/127.0.0.1/tcp/5005')

    pi.multiaddrs.add(ma1)
    pi.multiaddrs.add(ma2)
    pi.multiaddrs.add(ma3)
    pi.multiaddrs.add(ma4)

    expect(pi.multiaddrs.size).to.equal(4)

    const old = ma2
    const fresh = ma5

    pi.multiaddrs.replace(old, fresh)

    expect(pi.multiaddrs.size).to.equal(4)
  })

  it('get distinct multiaddr same transport multiple different ports', () => {
    const ma1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const ma2 = Multiaddr('/ip4/127.0.0.1/tcp/5002')
    const ma3 = Multiaddr('/ip4/127.0.0.1/tcp/5003')
    const ma4 = Multiaddr('/ip4/127.0.0.1/tcp/5004')

    pi.multiaddrs.add(ma1)
    pi.multiaddrs.add(ma2)
    pi.multiaddrs.add(ma3)
    pi.multiaddrs.add(ma4)

    var distinctMultiaddr = pi.multiaddrs.distinct()
    expect(distinctMultiaddr.length).to.equal(4)
  })

  it('get distinct multiaddr same transport different port', () => {
    const ma1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const ma2 = Multiaddr('/ip4/127.0.0.1/tcp/5002')

    pi.multiaddrs.add(ma1)
    pi.multiaddrs.add(ma2)

    var multiaddrDistinct = pi.multiaddrs.distinct()
    expect(multiaddrDistinct.length).to.equal(2)
  })

  it('get distinct multiaddr same transport same port', () => {
    const ma1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const ma2 = Multiaddr('/ip4/127.0.0.1/tcp/5001')

    pi.multiaddrs.add(ma1)
    pi.multiaddrs.add(ma2)

    var multiaddrDistinct = pi.multiaddrs.distinct()
    expect(multiaddrDistinct.length).to.equal(1)
  })

  it('get distinct multiaddr different transport same port', () => {
    const ma1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const ma2 = Multiaddr('/ip4/127.0.0.1/udp/5001')

    pi.multiaddrs.add(ma1)
    pi.multiaddrs.add(ma2)

    var multiaddrDistinct = pi.multiaddrs.distinct()
    expect(multiaddrDistinct.length).to.equal(2)
  })

  it('get distinct multiaddr different family same port same transport', () => {
    const ma1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const ma2 = Multiaddr('/ip6/::/tcp/5001')

    pi.multiaddrs.add(ma1)
    pi.multiaddrs.add(ma2)

    const multiaddrDistinct = pi.multiaddrs.distinct()
    expect(multiaddrDistinct.length).to.equal(1)
  })

  it('get distinct multiaddr different family same port multiple transports', () => {
    const ma1 = Multiaddr('/ip4/127.0.0.1/tcp/5001')
    const ma2 = Multiaddr('/ip6/::/tcp/5001')
    const ma3 = Multiaddr('/ip6/::/udp/5002')
    const ma4 = Multiaddr('/ip4/127.0.0.1/udp/5002')

    pi.multiaddrs.add(ma1)
    pi.multiaddrs.add(ma2)
    pi.multiaddrs.add(ma3)
    pi.multiaddrs.add(ma4)

    const multiaddrDistinct = pi.multiaddrs.distinct()
    expect(multiaddrDistinct.length).to.equal(2)

    expect(multiaddrDistinct[0].toOptions().family).to.equal('ipv4')
    expect(multiaddrDistinct[1].toOptions().family).to.equal('ipv6')
  })

  it('.connect', () => {
    pi.connect('/ip4/127.0.0.1')
    expect(pi.isConnected()).to.equal(true)
  })

  it('.disconnect', () => {
    pi.disconnect('/ip4/127.0.0.1')
    expect(pi.isConnected()).to.equal(false)
  })
})
