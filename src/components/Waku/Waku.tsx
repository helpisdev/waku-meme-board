import { wakuNodeMap, createWakuNode } from "@stores/waku";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { NetworkConnector } from "@components/NetworkConnector/NetworkConnector";
import { Node } from "@components/Node/Node";

export function Waku() {
  const waku = useStore(wakuNodeMap);

  useEffect(() => {
    createWakuNode();
  }, []);

  if (!waku || !waku.id) {
    return <NetworkConnector network="Waku" />;
  }

  return <Node network="Waku" id={waku.id} status={waku.status} />;
}
