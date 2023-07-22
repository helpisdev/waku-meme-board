import type { CardType, ObjectType } from "./types";

export const conf = {
  baseURL: "https://waku-meme-board.helpis.dev/",
  description: "Explore and post decentralized memes!",
  image: {
    url: "https://picsum.photos/1200/630",
    alt: "OpenGraph thumbnail description.",
    width: 1200,
    height: 630,
  },
  theme: {
    light: "#fdfdfc",
    dark: "#161615",
  },
  siteName: "Waku Meme Board",
  facebook: {
    type: "website" as ObjectType,
  },
  twitter: {
    card: "summary_large_image" as CardType,
  },
};
