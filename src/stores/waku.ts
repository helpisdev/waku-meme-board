import { Type, Field } from "protobufjs";
import { map } from "nanostores";
import {
  createLightNode,
  createDecoder,
  createEncoder,
  waitForRemotePeer,
} from "@waku/sdk";
import type { Waku, LightNode, IDecodedMessage, Unsubscribe } from "@waku/interfaces";
import { Protocols } from "@waku/interfaces";

export interface Meme {
  timestamp: Date,
  hash: string,
  format: MemeFormat,
}

export const enum MemeFormat {
  JPG = 0,
  JPEG = 1,
  PNG = 2,
  GIF = 3,
}

export type AcceptedMemeFormatMime = "image/png" | "image/jpg" | "image/gif" | "image/jpeg";

export function isAcceptedMemeFormatMime(mime: any): mime is AcceptedMemeFormatMime {
  return (mime as AcceptedMemeFormatMime) !== undefined;
}

// No builtin way to iterate enum values in TypeScript unfortunately
export const mimeToFormatMapping: Record<AcceptedMemeFormatMime, MemeFormat> = {
  "image/png": MemeFormat.PNG,
  "image/jpg": MemeFormat.JPG,
  "image/gif": MemeFormat.GIF,
  "image/jpeg": MemeFormat.JPEG,
}

export const formatToMimeMapping: Record<MemeFormat, AcceptedMemeFormatMime> = {
  [MemeFormat.PNG]: "image/png",
  [MemeFormat.JPG]: "image/jpg",
  [MemeFormat.GIF]: "image/gif",
  [MemeFormat.JPEG]: "image/jpeg",
}

export const MemeMessage = new Type("Meme")
  .add(new Field("timestamp", 1, "uint64"))
  .add(new Field("hash", 2, "string"))
  .add(new Field("format", 3, "enum"));

export const contentTopic = "/waku-meme-board/1/meme/proto";

export type WakuNodeMapKey = "node" | "id" | "status" | "encoder" | "decoder";
export const wakuNodeMap = map<Record<WakuNodeMapKey, any>>({
  node: null,
  id: null,
  status: "offline",
  encoder: null,
  decoder: null,
});

export async function createWakuNode() {
  const node = await createLightNode({ defaultBootstrap: true });
  wakuNodeMap.setKey("node", node);

  const encoder = createEncoder({ contentTopic: contentTopic, ephemeral: false })
  wakuNodeMap.setKey("encoder", encoder);

  const decoder = createDecoder(contentTopic)
  wakuNodeMap.setKey("decoder", decoder);


  const id = node.libp2p.peerId.toString();
  wakuNodeMap.setKey("id", id);

  await node.start();
  wakuNodeMap.setKey("status", "online");

  await waitForRemotePeer(node as unknown as Waku, [
    Protocols.Store,
    Protocols.LightPush,
    Protocols.Filter,
  ]);
}

export async function uploadMeme(hash: string, format: MemeFormat) {
  const waku = wakuNodeMap.get()["node"];
  if (waku) {
    const proto = MemeMessage.create({
      timestamp: Date.now(),
      hash: hash,
      format: format.valueOf()
    });
    const memeData = MemeMessage.encode(proto).finish();
    const encoder = wakuNodeMap.get()["encoder"];
    await (waku as LightNode).lightPush.send(encoder, {
      payload: memeData,
    });
  }
}

export async function getStoredMemes(): Promise<Meme[]> {
  const waku = await initWaku();
  const decoder = wakuNodeMap.get()["decoder"];
  const storeQuery = waku!.store.queryGenerator(
    [decoder],
    {},
  );

  const results: Array<Meme> = [];
  for await (const futureMemes of storeQuery) {
    const memes = await Promise.all(futureMemes);
    for (const meme of memes) {
      if (meme) {
        const { hash, timestamp, format }: Meme = MemeMessage.decode(meme.payload) as unknown as Meme;
        results.push({ hash, timestamp, format });
      }
    }
  }

  return results;
}

async function initWaku(): Promise<LightNode> {
  let waku: LightNode | null = wakuNodeMap.get()["node"];
  if (!waku) {
    await createWakuNode();
    waku = wakuNodeMap.get()["node"];
  }
  return waku!
}

function decodeMeme(encodedMeme?: IDecodedMessage | undefined): Meme | null {
  if (!encodedMeme?.payload) {
    return null;
  }
  return MemeMessage.decode(encodedMeme.payload) as unknown as Meme;
}

export type ReceivedMemeHandler = (meme: Meme) => void;

export async function filterMemes(callback?: ReceivedMemeHandler | undefined): Promise<Unsubscribe> {
  const waku = await initWaku();
  const decoder = wakuNodeMap.get()["decoder"];
  return await waku.filter.subscribe([decoder], (msg: IDecodedMessage) => {
    const meme = decodeMeme(msg);
    if (meme && callback) {
      callback(meme);
    }
  });
}
