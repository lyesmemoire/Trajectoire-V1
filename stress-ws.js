import WebSocket from 'ws';

const TOTAL_CLIENTS = 50;
const RESPONSES_PER_CLIENT = 10;
const SERVER_URL = "ws://localhost:3000/api/voice?token=anything";

let activeClients = 0;
let finishedClients = 0;
let totalMessages = 0;
let errors = 0;

function createClient(id) {
  return new Promise((resolve) => {
    const ws = new WebSocket(SERVER_URL);

    let responsesSent = 0;
    let finished = false;
    const timeout = setTimeout(() => {
      if (!finished) {
        console.log(`⏱️ Client ${id} timeout after 60s`);
        ws.close();
        resolve();
      }
    }, 60000);

    ws.on("open", () => {
      activeClients++;
      console.log(`✅ Client ${id} connected`);
    });

    ws.on("message", (data) => {
      totalMessages++;

      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "ready") {
          // Send first response
          setTimeout(() => {
            if (responsesSent < RESPONSES_PER_CLIENT) {
              responsesSent++;
              ws.send(JSON.stringify({
                type: "transcript",
                text: "J'ai mené un projet qui a augmenté la performance de 15% avec une équipe de 3 personnes.",
                isFinal: true,
                confidence: 0.95
              }));
            }
          }, 100);
        }

        if (msg.type === "feedback_text") {
          if (msg.finished) {
            finished = true;
            finishedClients++;
            clearTimeout(timeout);
            ws.close();
            resolve();
          } else {
            if (responsesSent < RESPONSES_PER_CLIENT) {
              responsesSent++;
              setTimeout(() => {
                ws.send(JSON.stringify({
                  type: "transcript",
                  text: "J'ai mené un projet qui a augmenté la performance de 15% avec une équipe de 3 personnes.",
                  isFinal: true,
                  confidence: 0.95
                }));
              }, 100);
            }
          }
        }

      } catch (e) {
        // ignore binary audio
      }
    });

    ws.on("error", (err) => {
      errors++;
      console.error(`❌ Client ${id} error`, err.message);
      clearTimeout(timeout);
      resolve();
    });

    ws.on("close", () => {
      activeClients--;
      clearTimeout(timeout);
    });
  });
}

async function runTest() {
  console.log(`🚀 Starting ${TOTAL_CLIENTS} concurrent clients`);

  const start = Date.now();

  const clients = [];
  for (let i = 0; i < TOTAL_CLIENTS; i++) {
    clients.push(createClient(i));
  }

  await Promise.all(clients);

  const duration = Date.now() - start;

  console.log("\n📊 TEST RESULTS");
  console.log("Duration:", duration, "ms");
  console.log("Finished clients:", finishedClients);
  console.log("Errors:", errors);
  console.log("Total messages:", totalMessages);
  console.log("Active clients:", activeClients);
}

runTest();
