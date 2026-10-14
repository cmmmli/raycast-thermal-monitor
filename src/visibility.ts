import { Cache } from "@raycast/api";

// 表示/非表示フラグは拡張機能内のコマンド間で共有される Cache に置く
const cache = new Cache();
const KEY_HIDDEN = "hidden";

export const isHidden = () => cache.get(KEY_HIDDEN) === "1";
export const setHidden = (hidden: boolean) => cache.set(KEY_HIDDEN, hidden ? "1" : "0");
