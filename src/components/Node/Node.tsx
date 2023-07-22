import type { NodeStatus } from "../../types";

interface Props {
  network: string;
  status: NodeStatus;
  id: string;
}

export function Node({ id, status, network }: Props) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-high-contrast dark:text-high-contrast-dark">
        {network}
      </h3>
      <h4 className="mb-4 text-md font-bold text-high-contrast dark:text-high-contrast-dark">
        ID: {id}
      </h4>
      <h4 className="mb-4 text-md font-bold text-high-contrast dark:text-high-contrast-dark">
        Status: {status}
      </h4>
    </div>
  );
}
