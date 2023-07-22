import { useState, useEffect } from "react";
import { MemeCard } from "@components/MemeCard/MemeCard";
import { retrieveMemeFromHelia } from "@stores/helia";
import { filterMemes, getStoredMemes } from "@stores/waku";
import type { Unsubscribe } from "@waku/interfaces";

export function MemeGallery() {
  const [memes, setMemes] = useState<string[]>([]);
  let unsubscribe: Unsubscribe | undefined;

  useEffect(() => {
    getStoredMemes()
      .then(async (m) => {
        if (m) {
          const sources = [];
          for (const meme of m) {
            const src = await retrieveMemeFromHelia(meme);
            if (src) {
              sources.push(src.src);
            }
          }
          setMemes(sources);
        }
      })
      .then(async () => {
        unsubscribe = await filterMemes(async (meme) => {
          const src = await retrieveMemeFromHelia(meme);
          if (src) {
            setMemes([...memes, src.src]);
          }
        });
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [memes]);

  if (memes.length == 0) {
    return <p>No memes to show</p>;
  }

  return (
    <div className="columns-1 gap-[1.5em] sm:columns-2 md:columns-3 mx-4">
      {memes.map((meme, i) => {
        const aspect = i % 3 == 0 || i % 4 == 0 ? "video" : "square";
        return <MemeCard src={meme} aspect={aspect} />;
      })}
    </div>
  );
}
