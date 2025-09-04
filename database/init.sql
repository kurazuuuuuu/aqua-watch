-- 水質投稿テーブル
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(100) DEFAULT 'Anonymous',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    image_path VARCHAR(500),
    water_quality_score INTEGER CHECK (water_quality_score >= 1 AND water_quality_score <= 5),
    pollution_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 地域別水質統計テーブル
CREATE TABLE region_stats (
    id SERIAL PRIMARY KEY,
    region_name VARCHAR(255) NOT NULL,
    avg_quality_score DECIMAL(3, 2),
    post_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX idx_posts_location ON posts(latitude, longitude);
CREATE INDEX idx_posts_created_at ON posts(created_at);
