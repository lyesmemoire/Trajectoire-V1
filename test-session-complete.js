/**
 * Script de test pour valider une session complète jusqu'à finished: true
 * Utilise le bypass transcript DEV pour simuler des réponses utilisateur
 */

import WebSocket from 'ws';

const WS_URL = 'ws://localhost:3000/api/voice?token=test-session-complete';

const responses = [
  "J'ai 5 ans d'expérience en développement logiciel, principalement en JavaScript et TypeScript.",
  "J'ai travaillé sur plusieurs projets e-commerce qui ont généré plus de 2M€ de revenus.",
  "J'ai dirigé une équipe de 4 développeurs et livré un projet qui a augmenté les ventes de 18%.",
  "Je suis spécialisé en architecture backend et optimisation de performance.",
  "J'ai contribué à l'open source et maintiens plusieurs projets sur GitHub.",
  "Je cherche un poste de senior développeur dans une entreprise innovante.",
  "Je suis disponible immédiatement et prêt à m'investir pleinement.",
  "Mon salaire attendu est entre 60k€ et 70k€ selon les responsabilités.",
  "Je suis passionné par les nouvelles technologies et l'apprentissage continu.",
  "Je suis convaincu que mon profil correspond parfaitement à vos attentes."
];

let responseIndex = 0;
let sessionId = null;
let finished = false;
let turnCount = 0;

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ Connected to WebSocket');
  // Attendre le message ready avant d'envoyer
});

ws.on('message', (data) => {
  // Essayer de parser comme JSON, ignorer si échec (probablement audio)
  try {
    const message = JSON.parse(data.toString());
    console.log('📨 Received:', JSON.stringify(message, null, 2));

    if (message.type === 'ready') {
      sessionId = message.sessionId;
      console.log(`🆔 Session ID: ${sessionId}`);
      // Envoyer la première réponse immédiatement
      sendNextResponse();
    }

    if (message.type === 'feedback_text') {
      turnCount++;
      console.log(`📊 Turn ${turnCount} - Score: ${message.score}, Signal: ${message.signal}, Finished: ${message.finished}`);
      
      if (message.finished) {
        finished = true;
        console.log('🏁 Session finished!');
        setTimeout(() => {
          ws.close();
          console.log('🔌 Connection closed');
          console.log('\n� Check server logs for detailed metrics (voice_pipeline_metrics, voice_total_pipeline_ms)');
          process.exit(0);
        }, 2000);
      } else {
        // Envoyer la réponse suivante après un court délai
        setTimeout(() => sendNextResponse(), 1000);
      }
    }

    if (message.type === 'error') {
      console.error('❌ Error:', message.message);
    }
  } catch (error) {
    // Ignorer les messages non-JSON (audio)
    console.log('🔊 Non-JSON message (audio) ignored');
  }
});

ws.on('close', (code, reason) => {
  console.log(`🔌 Connection closed: ${code} - ${reason}`);
  if (!finished) {
    console.error('⚠️ Session ended without finished flag');
  }
  process.exit(0);
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
  process.exit(1);
});

function sendNextResponse() {
  if (responseIndex >= responses.length) {
    console.log('⚠️ No more responses to send');
    return;
  }

  const response = responses[responseIndex];
  responseIndex++;

  const message = {
    type: 'transcript',
    text: response,
    isFinal: true,
    confidence: 0.95
  };

  console.log(`📤 Sending response ${responseIndex}:`, response);
  ws.send(JSON.stringify(message));
}

// Timeout après 30 secondes
setTimeout(() => {
  console.error('⏱️ Timeout after 30 seconds');
  ws.close();
  process.exit(1);
}, 30000);
