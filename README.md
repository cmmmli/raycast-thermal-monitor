# Thermal Monitor

macOS の熱状態(`NSProcessInfo.thermalState`)をメニューバーに表示する Raycast 拡張機能。状態が悪化したときは通知する。

| 表示 | 状態 |
|---|---|
| 🟢 | Nominal |
| 🟡 | Fair |
| 🟠 | Serious |
| 🔴 | Critical |

## セットアップ

```sh
git clone https://github.com/cmmmli/raycast-thermal-monitor.git
cd raycast-thermal-monitor
npm install
npm run build
```

`npm run build` がビルド結果を Raycast の拡張機能フォルダ(`~/.config/raycast/extensions/thermal-monitor/`)にコピーする。Raycast はそのコピーを実行するので、clone する場所はどこでもよく、ビルド後に移動・削除しても動き続ける。

Raycast で「Thermal State」を一度実行すると、メニューバーに表示される。以降は Raycast が起動していれば、Mac を再起動しても自動で表示される(Raycast の「Launch Raycast at Login」がオンであること)。

## 普段の使い方

何もしなくてよい。30 秒ごとに状態を確認し、状態が悪化したときだけ音付きで通知する。

アイコンをクリックすると、次のメニューが出る。

- 今の状態と、その状態になった時刻・経過時間
- Activity Monitor を開く
- 今すぐ更新
- メニューバーから隠す

### 隠す・戻す

- 隠す:メニューの「メニューバーから隠す」、または Raycast の「Toggle Thermal Monitor」
- 戻す:「Toggle Thermal Monitor」

隠している間は、温度の確認も通知も止まる。Toggle にホットキーを割り当てておくと便利。

コマンド自体を完全に止めたい場合は、Raycast で「Thermal State」を選び、`⌘K` →「Deactivate Command」を実行する。

## 開発

| 場面 | コマンド |
|---|---|
| コードを直したあとに反映する | `npm run build` |
| 保存のたびに自動で反映しながら開発する | `npm run dev` |
| `package.json` でコマンドを追加・削除した | 念のため `npm run dev` を一度実行 |

`npm run build` は、Raycast が実際に読み込む `~/.config/raycast/extensions/thermal-monitor/` に出力する。

### 構成

| ファイル | 内容 |
|---|---|
| `src/thermal.tsx` | メニューバー表示と、悪化時の通知(`menu-bar` モード、30 秒間隔) |
| `src/toggle.ts` | 表示・非表示の切り替え(`no-view` モード) |
| `src/visibility.ts` | 非表示フラグ(コマンド間で共有する `Cache`) |

## 困ったとき

| 症状 | 対処 |
|---|---|
| アイコンが出ない | Raycast で「Thermal State」を一度実行する。それでも出なければ「Toggle Thermal Monitor」を実行する |
| 「Thermal State が無効です」と出る | Raycast の設定 → Extensions →「Thermal State」にチェックを入れ、一度実行する |
| 通知が来ない | システム設定 →「通知」→「スクリプトエディタ」を許可する(通知は `osascript` から送っているため) |
| メニューバーが混んでいて見えない | ノッチの裏に隠れている可能性がある。Ice などのメニューバー整理ツールで表示側に固定する |
