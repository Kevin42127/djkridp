class TwitchStatusChecker {
    constructor() {
        this.channelName = 'djkridp'; // 改回您的頻道
        this.offlineView = document.getElementById('twitch-offline-view');
        this.liveView = document.getElementById('twitch-live-view');
        this.checkInterval = null;
        this.isLive = false;
        this.init();
    }

    init() {
        if (this.offlineView && this.liveView) {
            this.checkStatus();
            this.startAutoCheck();
        }
    }

    async checkStatus() {
        try {
            // 檢查直播狀態
            const response = await fetch(`https://decapi.me/twitch/uptime/${this.channelName}`);
            const uptime = await response.text();
            
            if (uptime.includes('offline') || uptime.includes('not found')) {
                this.setView(false);
            } else {
                this.setView(true);
            }
        } catch (error) {
            console.error('Fehler beim Überprüfen des Twitch-Status:', error);
            this.setView(false);
        }
    }

    setView(isLive) {
        this.isLive = isLive;
        
        if (this.offlineView && this.liveView) {
            if (isLive) {
                // 顯示直播播放器
                this.offlineView.style.display = 'none';
                this.liveView.style.display = 'flex';
                
                // 確保播放器載入
                this.ensurePlayerLoaded();
            } else {
                // 顯示離線預覽
                this.offlineView.style.display = 'flex';
                this.liveView.style.display = 'none';
            }
        }
    }

    ensurePlayerLoaded() {
        // JavaScript 播放器會自動初始化，不需要重新載入
        console.log('Twitch JavaScript 播放器已準備');
    }

    startAutoCheck() {
        this.checkInterval = setInterval(() => {
            this.checkStatus();
        }, 30000); // 每30秒檢查一次，更快響應直播開始
    }

    stopAutoCheck() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }
}

// 當 DOM 載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    new TwitchStatusChecker();
});
