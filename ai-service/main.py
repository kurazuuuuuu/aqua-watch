from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
from PIL import Image
import io
from sklearn.cluster import KMeans

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "OK", "service": "AI Processing"}

@app.post("/analyze-water-quality")
async def analyze_water_quality(file: UploadFile = File(...)):
    try:
        # 画像読み込み
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        img_array = np.array(image)
        
        # BGR変換
        if len(img_array.shape) == 3:
            img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        else:
            img_bgr = img_array
        
        # 水質分析
        quality_score = analyze_image_quality(img_bgr)
        pollution_level = get_pollution_level(quality_score)
        
        return {
            "quality_score": quality_score,
            "pollution_level": pollution_level,
            "analysis": get_analysis_text(quality_score)
        }
    
    except Exception as e:
        return {"error": str(e)}

def analyze_image_quality(image):
    """画像から水質スコアを算出 (1-5, 5が最良)"""
    
    # 色相分析
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # 青色系の割合を計算
    blue_mask = cv2.inRange(hsv, (100, 50, 50), (130, 255, 255))
    blue_ratio = np.sum(blue_mask > 0) / (image.shape[0] * image.shape[1])
    
    # 緑色系の割合を計算（藻類等）
    green_mask = cv2.inRange(hsv, (40, 50, 50), (80, 255, 255))
    green_ratio = np.sum(green_mask > 0) / (image.shape[0] * image.shape[1])
    
    # 茶色系の割合を計算（汚染）
    brown_mask = cv2.inRange(hsv, (10, 50, 20), (20, 255, 200))
    brown_ratio = np.sum(brown_mask > 0) / (image.shape[0] * image.shape[1])
    
    # 透明度分析（明度の標準偏差）
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    clarity = np.std(gray) / 255.0
    
    # スコア計算
    score = 5.0
    score -= green_ratio * 2  # 藻類で減点
    score -= brown_ratio * 3  # 汚染で大幅減点
    score += blue_ratio * 1   # 青色で加点
    score += clarity * 0.5    # 透明度で加点
    
    return max(1, min(5, int(score)))

def get_pollution_level(score):
    """スコアから汚染レベルを判定"""
    if score >= 4:
        return "clean"
    elif score >= 3:
        return "moderate"
    elif score >= 2:
        return "polluted"
    else:
        return "heavily_polluted"

def get_analysis_text(score):
    """スコアから分析テキストを生成"""
    if score >= 4:
        return "水質は良好です。透明度が高く、汚染物質は検出されませんでした。"
    elif score >= 3:
        return "水質は普通です。軽微な濁りが見られますが、大きな問題はありません。"
    elif score >= 2:
        return "水質に問題があります。汚染物質や藻類の存在が疑われます。"
    else:
        return "水質が深刻に汚染されています。immediate attention が必要です。"
