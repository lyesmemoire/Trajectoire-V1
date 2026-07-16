// @ts-nocheck
import ws from 'k6/ws';
import { check } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up to 50 concurrent interviews
    { duration: '1m', target: 50 },   // Sustain 50 concurrent interviews
    { duration: '30s', target: 0 },   // Ramp down
  ],
};

export default function () {
  const url = 'ws://localhost:3000/interview'; // Adjust port as necessary
  const candidateId = `cand-${randomString(8)}`;
  let sessionId = '';

  const res = ws.connect(url, {}, function (socket) {
    socket.on('open', function () {
      // 1. Send START command
      socket.send(JSON.stringify({
        type: 'START',
        candidateId,
        targetRole: 'Software Engineer'
      }));
    });

    socket.on('message', function (msg) {
      const data = JSON.parse(msg);

      if (data.type === 'INTERVIEW_STARTED') {
        sessionId = data.payload.sessionId;
        
        // 2. Simulate user thinking then answering
        socket.setTimeout(function () {
          socket.send(JSON.stringify({
            type: 'TURN',
            sessionId,
            turnId: `turn-${randomString(8)}`,
            transcript: 'This is a simulated answer from k6 load test.',
            intent: 'answer',
            timingMs: 2500
          }));
        }, 1000);
      }

      if (data.type === 'TEXT') {
        // AI replied. Simulate ending after 1 turn for the load test
        socket.setTimeout(function () {
          socket.close();
        }, 500);
      }
    });

    socket.on('error', function (e) {
      console.log('An unexpected error occurred: ', e.error());
    });
  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
}
