# AirNS デプロイ手順書（Windows向け）

## 方法A：Cloudflare Pages（推奨・無料・最速）

### 1. GitHubアカウントの準備
- https://github.com にアクセスしてアカウント作成（すでにあればスキップ）
- 右上の「+」→「New repository」をクリック
- Repository name: `airns` と入力
- 「Private」を選択して「Create repository」

### 2. ファイルのアップロード
- 作成したリポジトリのページで「uploading an existing file」をクリック
- `AirNS` フォルダ内の以下のファイルをすべてドラッグ&ドロップ：
  - `index.html`
  - `manifest.json`
  - `sw.js`
  - `icon-192.png`
  - `icon-512.png`
- 「Commit changes」をクリック

### 3. Cloudflare Pagesでデプロイ
- https://dash.cloudflare.com にアクセスしてアカウント作成
- 左メニュー「Workers & Pages」→「Create」→「Pages」タブ
- 「Connect to Git」→ GitHubアカウントを連携
- `airns` リポジトリを選択
- 設定はそのまま（フレームワーク: None、ビルドコマンド: 空欄、出力ディレクトリ: `/`）
- 「Save and Deploy」をクリック

### 4. 完了！
- `https://airns-xxx.pages.dev` のようなURLが発行される
- このURLをスマホのブラウザで開けばすぐ使える
- 「ホーム画面に追加」すればアプリのように使える

### カスタムドメインを使いたい場合
- Cloudflare Pagesの設定 →「Custom domains」→ドメインを追加
- 例: `airns.yourdomain.com`

---

## 方法B：Vercel（代替・同じく無料）

### 1. GitHubリポジトリは方法Aと同じ手順で作成

### 2. Vercelでデプロイ
- https://vercel.com にアクセスしてGitHubアカウントでログイン
- 「Import Project」→ `airns` リポジトリを選択
- Framework Preset: 「Other」を選択
- 「Deploy」をクリック
- 完了後、`https://airns-xxx.vercel.app` でアクセス可能

---

## APIキーの設定

1. AirNSを開くと、最初にAPIキー入力画面が表示される
2. Claude APIキー（`sk-ant-...`）を入力して「保存」
3. キーはブラウザのセッション内にのみ保存される（サーバーには送信されない）

### セキュリティについて
- 現在のプロトタイプではAPIキーはクライアント側で管理
- 本番運用時はサーバーサイドプロキシを追加してキーを隠す
- Phase 1で対応予定

---

## PWAとしてインストール（スマホ）

### iPhone (Safari)
1. AirNSのURLをSafariで開く
2. 画面下の共有ボタン（□↑）をタップ
3. 「ホーム画面に追加」をタップ
4. 「追加」をタップ

### Android (Chrome)
1. AirNSのURLをChromeで開く
2. 右上の「︙」メニュー →「ホーム画面に追加」
3. 「追加」をタップ

---

## トラブルシューティング

### 「APIキーが無効です」と出る
→ APIキーが正しいか確認。`sk-ant-api03-` で始まるキーを入力

### チャットが返ってこない
→ APIの利用制限（rate limit）に達した可能性。数分待ってリトライ

### PWAが更新されない
→ ブラウザのキャッシュをクリアするか、sw.jsの `CACHE_NAME` を `airns-v2` に変更してデプロイし直す
