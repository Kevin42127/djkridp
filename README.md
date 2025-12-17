# DJKridP 個人網站

DJKridP 的個人作品集網站，展示其作為多流派 DJ 的職業生涯。

## 技術棧

- HTML5
- CSS3 (原生 CSS，使用 CSS 變數)
- JavaScript (原生 JavaScript)

## 功能

- 多語言支援（德文/英文）
- 響應式設計
- 平滑過渡效果
- 語言選擇器
- 社交媒體連結整合

## 頁面結構

單頁應用（SPA），所有內容都在 `index.html` 中：
- 首頁 (Home)
- 關於我 (About)
- 演出歷程 (Tours)
- 作品集 (Works)
- 聯絡方式 (Contact)

## 設計規範

- 品牌主色：紫色
- 非極簡風格設計
- 單色圖標設計
- 不使用漸層設計
- 不使用懸停效果
- 僅使用平滑過渡效果

## 社交媒體連結

- Twitch: https://www.twitch.tv/djkridp
- Instagram: https://www.instagram.com/dj_krid_p
- Facebook: https://www.facebook.com/djkridp/
- StreamElements: https://streamelements.com/djkridp/tip

## 本地開發

直接在瀏覽器中開啟 `index.html` 即可查看網站。

## 部署

### Vercel 部署（推薦）

1. 將代碼推送到 GitHub 倉庫
2. 在 Vercel 中導入專案
3. 設置環境變數：
   - 進入專案設置 (Project Settings)
   - 選擇 Environment Variables
   - 添加環境變數：
     - **Name**: `GROQ_API_KEY`
     - **Value**: 您的 Groq API 金鑰
     - **Environment**: Production, Preview, Development（全部勾選）
4. 重新部署專案

### 其他平台

這是一個靜態網站，可以直接部署到任何靜態主機服務（如 GitHub Pages、Netlify 等）。

**注意**：AI 聊天功能需要後端支持，目前僅在 Vercel 上可用（使用 serverless functions）。

