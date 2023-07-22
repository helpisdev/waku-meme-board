import { UnixFS, unixfs } from "@helia/unixfs";
import { createHelia } from "helia";
import { CID } from "multiformats"
import { IDBBlockstore } from "blockstore-idb";
import { IDBDatastore } from "datastore-idb";
import { createLibp2p } from "libp2p";
import { identifyService } from "libp2p/identify";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { mplex } from "@libp2p/mplex";
import { tcp } from "@libp2p/tcp";
import { webRTC, webRTCDirect } from "@libp2p/webrtc";
import { webSockets } from "@libp2p/websockets";
import { webTransport } from "@libp2p/webtransport";
import { kadDHT } from "@libp2p/kad-dht";
import { map } from "nanostores";
import type { Meme } from "@stores/waku";
import { formatToMimeMapping } from "@stores/waku";

const datastore = new IDBDatastore("waku-meme-board", {});
const blockstore = new IDBBlockstore("waku-meme-board", {});

export async function closeIDBStores() {
  await datastore.close();
  await blockstore.close();
}

export async function createHeliaNode() {
  await datastore.open();
  await blockstore.open();
  const libp2p = await createLibp2p({
    datastore,
    // addresses: {
    //   listen: ["/ip4/127.0.0.1/tcp/0"],
    // },
    // transports allow us to dial peers that support certain types of addresses
    transports: [
      tcp(),
      webSockets(),
      webTransport(),
      webRTC(),
      webRTCDirect(),
    ],
    connectionEncryption: [noise()],
    streamMuxers: [yamux(), mplex()],
    peerDiscovery: [
      bootstrap({
        list: [
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
        ],
      }),
    ],
    services: {
      // the identify service is used by the DHT and the circuit relay transport
      // to find peers that support the relevant protocols
      identify: identifyService(),

      // the DHT is used to find circuit relay servers we can reserve a slot on
      dht: kadDHT({
        // browser node ordinarily shouldn't be DHT servers
        clientMode: true,
      }),
    },
  });
  const helia = await createHelia({ datastore, blockstore, libp2p });
  heliaNodeMap.setKey("node", helia);
  const nodeId = helia.libp2p.peerId.toString();
  const nodeIsOnline = helia.libp2p.isStarted();

  heliaNodeMap.setKey("id", nodeId);
  heliaNodeMap.setKey("status", nodeIsOnline ? "online" : "offline");
}

export type HeliaNodeMapKey = "node" | "id" | "status" | "fs";
export const heliaNodeMap = map<Record<HeliaNodeMapKey, any>>({
  node: null,
  id: null,
  status: "offline",
  fs: null,
});

function initFs(): UnixFS | null {
  let fs: UnixFS | null = heliaNodeMap.get()["fs"];
  if (!fs) {
    const heliaNode = heliaNodeMap.get()["node"];
    if (!heliaNode) {
      return null;
    }
    heliaNodeMap.setKey("fs", unixfs(heliaNode));
    fs = heliaNodeMap.get()["fs"];
  }
  return fs
}

export async function addMemeToHelia(data: Uint8Array): Promise<CID | null> {
  const fs = initFs();
  if (!fs) {
    return null;
  }
  const cid: CID = await fs.addBytes(data, {
    onProgress: (evt) => {
      console.info("add event", evt.type, evt.detail);
    },
  });

  return cid;
}

export async function retrieveMemeFromHelia(meme: Meme): Promise<HTMLImageElement | null> {
  const cid = meme.hash;
  const format = meme.format;
  const parsedCID = CID.parse(cid);
  const fs = initFs();
  if (!fs) {
    return null;
  }
  let bytes: Uint8Array = new Uint8Array();
  for await (const chunk of fs.cat(parsedCID)) {
    bytes = new Uint8Array([...bytes, ...chunk])
  }
  const mime = formatToMimeMapping[format];
  const blob = new Blob([bytes], { type: mime });

  const imageUrl = URL.createObjectURL(blob);
  const image = new Image();
  image.src = imageUrl;

  return image;
}
