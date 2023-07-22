export type NodeStatus = "online" | "offline";

export type Music = "song" | "album" | "playlist" | "radio_station";
export type Video = "movie" | "episode" | "tv_show" | "other";
export type OtherType = "article" | "book" | "profile" | "website";
export type ObjectType = OtherType | `music.${Music}` | `video.${Video}`;

export type CardType = "summary" | "summary_large_image" | "app" | "player";

export type Aspect = "video" | "square";
