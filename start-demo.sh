#!/bin/bash

echo "🚧 Aqua Watch デモ版を起動しています..."
echo "📍 福岡市博多区の水質監視デモンストレーション"
echo ""

# デモ用のdocker-composeを起動
docker-compose -f docker-compose.demo.yml up --build

echo ""
echo "✅ デモ版が起動しました！"
echo "🌐 ブラウザで http://localhost:11110 にアクセスしてください"
echo "📊 博多区周辺の水質データが表示されます"
