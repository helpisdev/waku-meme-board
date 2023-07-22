interface Props {
  network: string;
}

export function NetworkConnector({ network }: Props) {
  return (
    <div className="px-6 pb-20 text-center w-1/2">
      <h4 className="mb-6 text-lg font-bold text-high-contrast dark:text-high-contrast-dark">
        Connecting to {network}...
      </h4>
    </div>
  );
}
