# テーマ「よりよい世界になるためのグローバルな問題解決」
## 解決手段「世界の水質をみんなで監視するサービス」

### 概要
- SDGs 6「安全な水とトイレを世界中に」
- SDGs 14 「海の豊かさを守ろう」

- 世界中のユーザーが各地の水質に関して写真と共に投稿できる。
- 収集した写真や文章などのデータをAIが解析して誰でも閲覧ができるオープンデータとする。
    - 公的機関やNGOなどがデータを活用し、政策や支援に役立てられる。
- GoogleMapのような地図形式かつ、ヒートマップを使用して汚染状況を確認できるようにする。
- 汚染状況の振れ幅も記録してユーザーが確認できる
    - 投稿に応じてユーザー数も分析できるため、ボランティア活動の企画にも役立てることができる。

## 🚧 デモ版の起動

**福岡市博多区を中心とした水質監視デモンストレーション**

```bash
# デモ版を起動
./start-demo.sh

# または直接docker-composeで起動
docker-compose -f docker-compose.demo.yml up --build
```

デモ版では以下の機能を確認できます：
- 📍 博多区周辺の水質調査地点をマップ表示
- 💧 水質スコア（0-100点）による色分け表示
- 📊 調査レポートのタイムライン表示
- 🗺️ インタラクティブな地図操作

**アクセス**: http://localhost:11110

## 技術選定

### アーキテクチャ
```
Docker Compose環境:
├── Frontend (React + Nginx)
├── Backend API (Node.js/Express)
├── PostgreSQL Database
├── Redis (キャッシュ)
├── AI Processing Service (Python)
└── File Storage (ローカルボリューム)
```

### 技術スタック

**フロントエンド**
- React + TypeScript: UI構築
- Leaflet: 地図表示・ヒートマップ
- Nginx: 静的ファイル配信

**バックエンド**
- Node.js + Express: REST API
- Multer + Sharp: 画像アップロード・処理
- JWT: 認証

**データベース**
- PostgreSQL: メインデータベース
- Redis: セッション・キャッシュ

**AI処理**
- Python + FastAPI: AI処理マイクロサービス
- OpenCV: 画像前処理
- scikit-learn: 水質分析モデル

**インフラ**
- Docker Compose: オーケストレーション
- Docker Volume: 画像データ永続化

### 画像保存
- ローカルボリューム: `/app/uploads/images/`
- 命名規則: `{timestamp}_{uuid}.{extension}`
- サイズ制限: 10MB