class TwitchStatusChecker {
    constructor() {
        this.channelName = 'djkridp'; // Ändern Sie zu Ihrem Kanal
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
            // Live-Status prüfen
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
                // Live-Player anzeigen
                this.offlineView.style.display = 'none';
                this.liveView.style.display = 'flex';
                
                // Sicherstellen, dass Player geladen ist
                this.ensurePlayerLoaded();
            } else {
                // Offline-Vorschau anzeigen
                this.offlineView.style.display = 'flex';
                this.liveView.style.display = 'none';
            }
        }
    }

    ensurePlayerLoaded() {
        // iframe-Player wird automatisch geladen, keine zusätzliche Initialisierung erforderlich
        console.log('Twitch iframe-Player ist bereit');
        
        // Sicherstellen, dass der iframe korrekt geladen ist
        const iframe = this.liveView.querySelector('iframe[src*="player.twitch.tv"]');
        if (iframe) {
            console.log('Twitch Player iframe gefunden und bereit');
        } else {
            console.log('Twitch Player iframe nicht gefunden');
        }
    }

    startAutoCheck() {
        this.checkInterval = setInterval(() => {
            this.checkStatus();
        }, 30000); // Alle 30 Sekunden prüfen für schnellere Reaktion auf Livestart
    }

    stopAutoCheck() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }
}

// Initialisierung nach DOM-Laden
document.addEventListener('DOMContentLoaded', () => {
    new TwitchStatusChecker();
});
