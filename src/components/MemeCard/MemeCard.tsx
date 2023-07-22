import type { Aspect } from "../../types";

interface Props {
  src: string;
  aspect?: Aspect | undefined;
}

export function MemeCard({ src, aspect = "square" }: Props) {
  return (
    <img
      alt="gallery"
      className={`break-inside-avoid w-full aspect-${aspect} rounded-lg mb-6 border bg-app dark:bg-app-dark p-1 border-4 border-ui-el-borders-and-focus-rings dark:border-ui-el-borders-and-focus-rings-dark`}
      src={src}
    />
  );
}
