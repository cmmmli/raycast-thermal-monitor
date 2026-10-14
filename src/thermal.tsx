import { Icon, LocalStorage, MenuBarExtra, open } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { execFile } from "child_process";
import { useState } from "react";
import { promisify } from "util";
import { isHidden, setHidden } from "./visibility";

const run = promisify(execFile);

const STATES = [
  { icon: "🟢", name: "Nominal" },
  { icon: "🟡", name: "Fair" },
  { icon: "🟠", name: "Serious" },
  { icon: "🔴", name: "Critical" },
];

const KEY_STATE = "lastState";
const KEY_CHANGED_AT = "changedAt";

async function readThermalState(): Promise<number> {
  const { stdout } = await run("/usr/bin/osascript", [
    "-l",
    "JavaScript",
    "-e",
    'ObjC.import("Foundation"); $.NSProcessInfo.processInfo.thermalState',
  ]);
  return Number(stdout.trim());
}

async function notify(title: string, message: string) {
  const script = `display notification ${JSON.stringify(message)} with title ${JSON.stringify(title)} sound name "Funk"`;
  await run("/usr/bin/osascript", ["-e", script]);
}

// 現在の状態を取得し、前回より悪化していたら通知する
async function check() {
  const state = await readThermalState();
  const prev = await LocalStorage.getItem<number>(KEY_STATE);
  let changedAt = await LocalStorage.getItem<number>(KEY_CHANGED_AT);

  if (prev !== state) {
    if (prev !== undefined && state > prev) {
      await notify("🌡 Thermal", `${STATES[prev].name} → ${STATES[state].name} に悪化しました`);
    }
    changedAt = Date.now();
    await LocalStorage.setItem(KEY_STATE, state);
    await LocalStorage.setItem(KEY_CHANGED_AT, changedAt);
  }

  return { state, changedAt };
}

function formatSince(ms: number | undefined) {
  if (ms === undefined) return "-";
  const t = new Date(ms).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
  const min = Math.floor((Date.now() - ms) / 60000);
  return `${t} から (${min}分)`;
}

export default function Command() {
  const [hidden, setHiddenState] = useState(isHidden);
  if (hidden) return null;

  const hide = () => {
    setHidden(true);
    setHiddenState(true);
  };
  return <ThermalMenu onHide={hide} />;
}

function ThermalMenu({ onHide }: { onHide: () => void }) {
  const { data, isLoading, revalidate } = usePromise(check);
  const st = data ? (STATES[data.state] ?? { icon: "❔", name: "Unknown" }) : undefined;

  return (
    <MenuBarExtra title={st?.icon ?? "…"} tooltip={st ? `Thermal: ${st.name}` : undefined} isLoading={isLoading}>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item title={`Thermal: ${st?.name ?? "-"}`} />
        <MenuBarExtra.Item title={formatSince(data?.changedAt)} />
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="Activity Monitor を開く"
          icon={Icon.Gauge}
          onAction={() => open("/System/Applications/Utilities/Activity Monitor.app")}
        />
        <MenuBarExtra.Item title="今すぐ更新" icon={Icon.ArrowClockwise} onAction={revalidate} />
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item title="メニューバーから隠す" icon={Icon.EyeDisabled} onAction={onHide} />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}
