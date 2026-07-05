import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3000/api/voice?token=anything');

ws.on('open', () => {
  console.log('Connected');
});

let transcriptSent = false;

ws.on('message', (data) => {
  const message = data.toString();
  console.log('Received:', message);
  
  // Send transcript after receiving ready message
  if (message.includes('ready') && !transcriptSent) {
    transcriptSent = true;
    setTimeout(() => {
      console.log('Sending transcript...');
      ws.send(JSON.stringify({
        type: 'transcript',
        text: "J'ai travaillé 5 ans en tant que développeur full stack.",
        isFinal: true,
        confidence: 0.95
      }));
    }, 2000);
  }
});

ws.on('close', (code, reason) => {
  console.log('Disconnected - Code:', code, 'Reason:', reason.toString());
});

ws.on('error', (error) => {
  console.error('Error:', error);
});
