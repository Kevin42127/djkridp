const { Groq } = require('groq-sdk');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error('錯誤: GROQ_API_KEY 環境變數未設置');
}

const WEBSITE_INFO = `DJKridP ist ein Multi-Genre DJ aus Osnabrück, Deutschland. Er ist ehemaliges Mitglied von Future Breeze. Seit Ende der 90er Jahre spielt er DJ-Sets in Deutschland, Kanada, Südafrika, Japan, Russland, Polen, Spanien, Italien und vielen weiteren Ländern. Er hat über 20 Jahre Erfahrung als DJ. Seine Werke umfassen Multi-Genre Sets, Future Breeze Projekte und Live Performances auf internationalen Bühnen. Kontakt: Twitch (https://www.twitch.tv/djkridp), Instagram (https://www.instagram.com/dj_krid_p), TikTok (https://www.tiktok.com/@krid_p), Facebook (https://www.facebook.com/djkridp/), WhatsApp (https://www.whatsapp.com/channel/0029Vb6FeSm9hXF7H6qEIk3k), Discord (https://discord.gg/3xmER2Gc3B), Spotify (https://open.spotify.com/user/eluw6nthyi6sd3wjcydx6rojx), StreamElements (https://streamelements.com/djkridp/tip).`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY 環境變數未設置' });
  }

  const groq = new Groq({
    apiKey: GROQ_API_KEY
  });

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    const { message, history = [] } = body || {};

    if (!message) {
      res.write(`data: ${JSON.stringify({ error: 'Nachricht darf nicht leer sein' })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      return res.end();
    }

    const systemPrompt = `Du bist ein hilfsbereiter Assistent für die DJKridP Website.

Antworte immer auf natürlichem, flüssigem Hochdeutsch wie in einem Gespräch.

WICHTIG: Verwende KEINE Überschriften (#, ##, ###). Organisiere Inhalte mit Absätzen und Fettdruck statt Überschriften.

Du kannst folgende Formatierungen verwenden:

**Textformatierung:**
- **Fettdruck** für wichtige Begriffe (z.B. **Future Breeze**, **DJKridP**)
- *Kursiv* für leichte Betonung
- \`Code\` für Plattformnamen oder technische Begriffe

**Listen:**
- Verwende "- " für Aufzählungslisten
- Verwende "1. " für nummerierte Listen

**Hervorhebungen:**
- Verwende "> " für wichtige Hinweise

Strukturiere deine Antworten mit klaren Absätzen, aber ohne Überschriften. Verwende **Fettdruck** anstelle von Überschriften.`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    if (history && history.length > 0) {
      const recentHistory = history.slice(-5);
      recentHistory.forEach(msg => {
        if (msg.content && msg.content.trim() && msg.role === 'assistant') {
          messages.push({
            role: 'assistant',
            content: msg.content
          });
        }
      });
    }

    const userQuestion = `Du kennst folgende Informationen über DJKridP: ${WEBSITE_INFO}

Benutzerfrage: ${message}

Antworte auf Deutsch und verwende die obigen Informationen über DJKridP, um die Frage zu beantworten. Wenn die Frage nicht über DJKridP ist, antworte: "Entschuldigung, ich kann nur Fragen zu den Informationen auf dieser Website beantworten. Bitte fragen Sie etwas über DJKridP, seine Karriere, Werke oder Kontaktinformationen."`;

    messages.push({
      role: 'user',
      content: userQuestion
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      max_completion_tokens: 1024,
      top_p: 0.8,
      stream: true,
      stop: null
    });

    let hasContent = false;
    for await (const chunk of chatCompletion) {
      let content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        hasContent = true;
        content = content.replace(/\*/g, '-');
        content = content.replace(/^\*\s+/gm, '- ');
        content = content.replace(/\*\*\*/g, '---');
        content = content.replace(/\*\*/g, '');
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    if (!hasContent) {
      res.write(`data: ${JSON.stringify({ error: 'Keine Antwort vom AI-Modell erhalten' })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Groq API Fehler:', error);
    const errorMessage = error.message || 'Ein Fehler ist im AI-Service aufgetreten';
    console.error('Fehlerdetails:', errorMessage);
    res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  }
};
