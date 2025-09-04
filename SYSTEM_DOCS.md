# Aqua Watch システムドキュメント

## システム概要
世界の水質をみんなで監視するサービス。ユーザーが水質に関する写真と情報を投稿し、AIが解析してオープンデータとして提供。

## アーキテクチャ

### サービス構成
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Frontend   │───▶│   Backend   │───▶│ AI Service  │
│ React+Nginx │    │ Node.js+API │    │ Python+ML   │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
            ┌───────▼──┐   ┌──────▼──┐
            │PostgreSQL│   │  Redis  │
            │ Database │   │ Cache   │
            └──────────┘   └─────────┘
```

### ポート構成
- Frontend: 3000 (Nginx)
- Backend: 5001 (Express API)
- AI Service: 8000 (FastAPI)
- PostgreSQL: 5432
- Redis: 6379

## API エンドポイント

### Backend API (http://localhost:5001)
- `GET /health` - ヘルスチェック
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `GET /api/posts` - 投稿一覧取得
- `POST /api/posts` - 新規投稿作成
- `GET /api/posts/:id` - 投稿詳細取得

### AI Service API (http://localhost:8000)
- `GET /health` - ヘルスチェック
- `POST /analyze-water-quality` - 水質画像解析

## データベーススキーマ

### users テーブル
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### posts テーブル
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_path VARCHAR(500),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  quality_score INTEGER,
  pollution_level VARCHAR(50),
  ai_analysis TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 開発・運用

### 起動方法
```bash
docker-compose up -d
```

### 統合テスト実行
```bash
npm install axios form-data
node integration-test.js
```

### ログ確認
```bash
docker-compose logs -f [service-name]
```

### パフォーマンス監視
- バックエンドに組み込まれたパフォーマンス監視
- 1秒以上のリクエストは警告ログ出力
- エラーハンドリングミドルウェアによる統一エラー処理

## セキュリティ
- JWT認証
- 画像ファイルサイズ制限 (10MB)
- CORS設定
- 入力値検証

## 今後の拡張予定
- 本格的なAI水質分析モデル
- リアルタイム通知機能
- 多言語対応
- モバイルアプリ対応
