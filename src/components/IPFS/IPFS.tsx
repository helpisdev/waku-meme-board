import { heliaNodeMap, createHeliaNode } from "@stores/helia";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { NetworkConnector } from "@components/NetworkConnector/NetworkConnector";
import { Node } from "@components/Node/Node";

export function IPFS() {
  const helia = useStore(heliaNodeMap);

  useEffect(() => {
    createHeliaNode();
  }, []);

  if (!helia || !helia.id) {
    return <NetworkConnector network="IPFS" />;
  }

  return <Node network="IPFS" id={helia.id} status={helia.status} />;
}
