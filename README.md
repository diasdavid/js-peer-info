# js-peer-info

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![Build Status](https://travis-ci.org/libp2p/js-peer-info.svg?style=flat-square)](https://travis-ci.org/libp2p/js-peer-info)
[![Coverage Status](https://coveralls.io/repos/github/libp2p/js-peer-info/badge.svg?branch=master)](https://coveralls.io/github/libp2p/js-peer-info?branch=master)
[![Dependency Status](https://david-dm.org/libp2p/js-peer-info.svg?style=flat-square)](https://david-dm.org/libp2p/js-peer-info)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
![](https://img.shields.io/badge/npm-%3E%3D3.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/Node.js-%3E%3D4.0.0-orange.svg?style=flat-square)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/ipfs-js-peer-info.svg)](https://saucelabs.com/u/ipfs-js-peer-info)

> A PeerInfo object contains information about a
> [PeerID](https://github.com/libp2p/js-peer-id) and its
> [multiaddrs](https://github.com/libp2p/js-multiaddr). This module is used by
> [IPFS](https://github.com/ipfs/ipfs) and
> [libp2p](https://github.com/libp2p/js-libp2p).

## Table of Contents

- [Installation](#installation)
  - [npm](#npm)
  - [Node.JS, Browserify, Webpack](#nodejs-browserify-webpack)
  - [Browser: `<script>` Tag](#browser-script-tag)
- [Usage](#usage)
- [API](#api)
  - [`PeerInfo.create([id, ] callback)`](#peerinfocreateid-callback)
  - [`new PeerInfo(id)`](#new-peerinfoid)
  - [`multiaddrs`](#multiaddrs)
  - [`multiaddr.add(addr)`](#multiaddraddaddr)
  - [`multiaddr.addSafe(addr)`](#multiaddraddsafeaddr)
  - [`multiaddr.rm(addr)`](#multiaddrrmaddr)
  - [`multiaddr.replace(existing, fresh)`](#multiaddrreplaceexisting-fresh)
- [Contribute](#contribute)
- [License](#license)

## Installation

### npm

```sh
> npm i peer-info
```

### Node.JS, Browserify, Webpack

```js
const PeerInfo = require('peer-info')
```

### Browser: `<script>` Tag

Loading this module through a script tag will make the `PeerInfo` obj available in the global namespace.

```html
<script src="https://unpkg.com/peer-info/dist/index.min.js"></script>
<!-- OR -->
<script src="https://unpkg.com/peer-info/dist/index.js"></script>
```

## Usage

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

## API

```js
const PeerInfo = require('peer-info')
```

### `PeerInfo.create([id, ] callback)`

- `id: PeerID`, optional
- `callback: Function`

Creates a new PeerInfo instance and if no `id` is passed it
generates a new underlying [PeerID](https://github.com/libp2p/js-peer-id)
for it.

### `new PeerInfo(id)`

- `id: PeerID`

Creates a new PeerInfo instance from an existing PeerID.

### `multiaddrs`

A list of multiaddresses instances that `peer` can be reached at.

### `multiaddr.add(addr)`

- `addr: Multiaddr`

Adds a new multiaddress that `peer` can be reached at. `addr` is an instance of
a [multiaddr](https://github.com/libp2p/js-multiaddr).

### `multiaddr.addSafe(addr)`

- `addr: Multiaddr`

The `addSafe` call, in comparison to `add`, will only add the multiaddr to
`multiaddrs` if the same multiaddr tries to be added twice.

This is a simple mechanism to prevent `multiaddrs` from becoming bloated with
unusable addresses, which happens when we exchange observed multiaddrs with
peers which will not provide a useful multiaddr to be shared to the rest of the
network (e.g. a multiaddr referring to a peer inside a LAN being shared to the
outside world).

### `multiaddr.rm(addr)`

- `addr: Multiaddr`

Removes a multiaddress instance `addr` from `peer`.

### `multiaddr.replace(existing, fresh)`

- `existing: Multiaddr`
- `fresh: Multiaddr`

Removes the array of multiaddresses `existing` from `peer`, and adds the array
of multiaddresses `fresh`.

## Contribute

PRs accepted.

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT © David Dias](LICENSE)
