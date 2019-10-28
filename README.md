# js-peer-info

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://protocol.ai)
[![](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![](https://img.shields.io/badge/freenode-%23libp2p-yellow.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23libp2p)
[![Discourse posts](https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg)](https://discuss.libp2p.io)
[![](https://img.shields.io/codecov/c/github/libp2p/js-peer-info.svg?style=flat-square)](https://codecov.io/gh/libp2p/js-peer-info)
[![](https://img.shields.io/travis/libp2p/js-peer-info.svg?style=flat-square)](https://travis-ci.com/libp2p/js-peer-info)
[![Dependency Status](https://david-dm.org/libp2p/js-peer-info.svg?style=flat-square)](https://david-dm.org/libp2p/js-peer-info)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
![](https://img.shields.io/badge/npm-%3E%3D3.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/Node.js-%3E%3D6.0.0-orange.svg?style=flat-square)

## Lead Maintainer

[Vasco Santos](https://github.com/vasco-santos)

## Table of Contents

- [js-peer-info](#js-peer-info)
  - [Lead Maintainer](#lead-maintainer)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [npm](#npm)
    - [Node.JS, Browserify, Webpack](#nodejs-browserify-webpack)
    - [Browser: `<script>` Tag](#browser-script-tag)
  - [Usage](#usage)
  - [API](#api)
    - [`PeerInfo.create([id])`](#peerinfocreateid)
    - [`new PeerInfo(id)`](#new-peerinfoid)
    - [`.id`](#id)
    - [`protocols`](#protocols)
    - [`.protocols.add(protocol)`](#protocolsaddprotocol)
    - [`.protocols.delete(protocol)`](#protocolsdeleteprotocol)
    - [`.multiaddrs`](#multiaddrs)
    - [`.multiaddrs.add(addr)`](#multiaddrsaddaddr)
    - [`.multiaddrs.addSafe(addr)`](#multiaddrsaddsafeaddr)
    - [`.multiaddrs.delete(addr)`](#multiaddrsdeleteaddr)
    - [`.multiaddrs.replace(existing, fresh)`](#multiaddrsreplaceexisting-fresh)
    - [`.connect(ma)`](#connectma)
    - [`.disconnect()`](#disconnect)
    - [`.isConnected()`](#isconnected)
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
const peer = new PeerInfo()

// TCP port 5001
peer.multiaddrs.add('/ip4/1.2.3.4/tcp/5001')

// UDP port 8001
peer.multiaddrs.add('/ip4/1.2.3.4/udp/8001')

// mic/speaker soundwaves using frequencies 697 and 1209
peer.multiaddrs.add('/sonic/bfsk/697/1209')
```

## API

```js
const PeerInfo = require('peer-info')
```

### `PeerInfo.create([id])`

- `id` optional - can be a PeerId or a JSON object(will be parsed with https://github.com/libp2p/js-peer-id#createfromjsonobj)

Creates a new PeerInfo instance and if no `id` is passed it
generates a new underlying [PeerID](https://github.com/libp2p/js-peer-id)
for it.

Returns `Promise<PeerInfo>`.

### `new PeerInfo(id)`

- `id: PeerId` - instance of PeerId (optional)

Creates a new PeerInfo instance from an existing PeerId.

### `.id`

The [PeerId](https://github.com/libp2p/js-peer-id) of the peer this info relates to.

### `protocols`

A list of protocols that `peer` supports.

### `.protocols.add(protocol)`

Adds a protocol that `peer` can support. `protocol` is a string.

### `.protocols.delete(protocol)`

Removes a protocol that `peer` no longer supports. `protocol` is a string.

### `.multiaddrs`

A list of multiaddresses instances that `peer` can be reached at.

### `.multiaddrs.add(addr)`

- `addr: Multiaddr`

Adds a new multiaddress that `peer` can be reached at. `addr` is an instance of
a [multiaddr](https://github.com/multiformats/js-multiaddr).

### `.multiaddrs.addSafe(addr)`

- `addr: Multiaddr`

The `addSafe` call, in comparison to `add`, will only add the multiaddr to
`multiaddrs` if the same multiaddr tries to be added twice.

This is a simple mechanism to prevent `multiaddrs` from becoming bloated with
unusable addresses, which happens when we exchange observed multiaddrs with
peers which will not provide a useful multiaddr to be shared to the rest of the
network (e.g. a multiaddr referring to a peer inside a LAN being shared to the
outside world).

### `.multiaddrs.delete(addr)`

- `addr: Multiaddr`

Removes a multiaddress instance `addr` from `peer`.

### `.multiaddrs.replace(existing, fresh)`

- `existing: Multiaddr`
- `fresh: Multiaddr`

Removes the array of multiaddresses `existing` from `peer`, and adds the array
of multiaddresses `fresh`.

### `.connect(ma)`

Records the given multiaddr, `ma` as the active multiaddr of the peer.

- `ma: Multiaddr`

### `.disconnect()`

Removes the existing connected Multiaddr from tracking.

### `.isConnected()`

Returns `true`  if a connected Multiaddr exists, otherwise returns `false`.

## Contribute

PRs accepted.

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT © David Dias](LICENSE)
