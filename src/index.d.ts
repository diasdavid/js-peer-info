import PeerId = require('peer-id');
import Multiaddr = require('multiaddr');
import { Mafmt } from 'mafmt';

declare class MultiaddrSet {
  readonly size: number;

  constructor(multiaddrs: Multiaddr[]);

  add(ma: Multiaddr): void;

  addSafe(ma: Multiaddr): true | void;

  toArray(): Multiaddr[];

  forEach(fn: (ma: Multiaddr, index: number, array: Multiaddr[]) => void): void;

  filterBy(maFmt: Mafmt): Multiaddr[];

  has(ma: Multiaddr): boolean;

  delete(ma: Multiaddr): true | void;

  replace(existing: Multiaddr, fresh: Multiaddr): void;

  clear(): void;

  distinct(): Multiaddr[];
}

declare class PeerInfo {
  id: PeerId;
  multiaddrs: MultiaddrSet;

  constructor(peerId: PeerId);

  connect(ma: Multiaddr): void;

  disconnect(): void;

  isConnected(): boolean;

  static create(peerId?: PeerId): Promise<PeerInfo>;

  static isPeerInfo(peerInfo: unknown): peerInfo is PeerInfo;
}

export = PeerInfo;
