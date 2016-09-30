peer-info JavaScript implementation
===================================

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![Build Status](https://travis-ci.org/diasdavid/js-peer-info.svg?style=flat-square)](https://travis-ci.org/diasdavid/js-peer-info)
[![Coverage Status](https://coveralls.io/repos/github/diasdavid/js-peer-info/badge.svg?branch=master)](https://coveralls.io/github/diasdavid/js-peer-info?branch=master)
[![Dependency Status](https://david-dm.org/diasdavid/js-peer-info.svg?style=flat-square)](https://david-dm.org/diasdavid/js-peer-info)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> A PeerInfo object contains information about a
> [PeerID](https://github.com/libp2p/js-peer-id) and its
> [multiaddrs](https://github.com/multiformats/js-multiaddr). This module is used by
> [IPFS](https://github.com/ipfs/ipfs) and
> [libp2p](https://github.com/libp2p/js-libp2p).

# Example

```js
const PeerInfo = require('peer-info')
const multiaddr = require('multiaddr')

const peer = new PeerInfo()

// TCP port 5001
peer.multiaddr.add(multiaddr('/ip4/1.2.3.4/tcp/5001'))

// UDP port 8001
peer.multiaddr.add(multiaddr('/ip4/1.2.3.4/udp/8001'))

// mic/speaker soundwaves using frequencies 697 and 1209
peer.multiaddr.add(multiaddr('/sonic/bfsk/697/1209'))
```

# API

```js
const PeerInfo = require('peer-info')
```

## const peer = new PeerInfo()

Creates a new PeerInfo instance and also generates a new underlying
[PeerID](https://github.com/diasdavid/js-peer-id) for it.

## const peer = new PeerInfo(peerId)

Creates a new PeerInfo instance from an existing PeerID.

## peer.multiaddrs

A list of multiaddresses instances that `peer` can be reached at.

## peer.multiaddr.add(addr)

Adds a new multiaddress that `peer` can be reached at. `addr` is an instance of
a [multiaddr](https://github.com/jbenet/js-multiaddr).

## peer.multiaddr.addSafe(addr)

The `addSafe` call, in comparison to `add`, will only add the multiaddr to
`multiaddrs` if the same multiaddr tries to be added twice.

This is a simple mechanism to prevent `multiaddrs` from becoming bloated with
unusable addresses, which happens when we exchange observed multiaddrs with
peers which will not provide a useful multiaddr to be shared to the rest of the
network (e.g. a multiaddr referring to a peer inside a LAN being shared to the
outside world).

## peer.multiaddr.rm(addr)

Removes a multiaddress instance `addr` from `peer`.

## peer.multiaddr.replace(existing, fresh)

Removes the array of multiaddresses `existing` from `peer`, and adds the array
of multiaddresses `fresh`.


# Installation

## npm

```sh
> npm i peer-info
```

## Node.JS, Browserify, Webpack

```JavaScript
var PeerInfo = require('peer-info')
```

## Browser: `<script>` Tag

Loading this module through a script tag will make the `PeerInfo` obj available in the global namespace.

```html
<script src="/peer-info@0.7.1/dist/index.min.js"></script>
<!-- OR -->
<script src="/peer-info@0.7.1/dist/index.js"></script>
```

# License

MIT
