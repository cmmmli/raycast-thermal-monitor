import { LaunchType, launchCommand, showHUD } from "@raycast/api";
import { isHidden, setHidden } from "./visibility";

export default async function Command() {
  const hidden = !isHidden();
  setHidden(hidden);

  try {
    await launchCommand({ name: "thermal", type: LaunchType.Background });
  } catch {
    // Thermal State が無効化されていると起動できないので、フラグを戻して案内する
    setHidden(!hidden);
    await showHUD("⚠️ Thermal State が無効です。Raycast で一度実行してください");
    return;
  }

  await showHUD(hidden ? "🌡 Thermal Monitor を隠しました" : "🌡 Thermal Monitor を表示しました");
}
