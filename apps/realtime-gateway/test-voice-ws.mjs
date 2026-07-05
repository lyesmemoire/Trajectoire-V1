import WebSocket from 'ws'

const WS_URL = 'ws://localhost:3000/api/voice'

console.log(`Connexion à ${WS_URL}...`)

const ws = new WebSocket(WS_URL)

ws.on('open', () => {
  console.log('✅ Connexion WebSocket établie')
  console.log('Envoi ping...')
  ws.send(JSON.stringify({ type: 'ping' }))
})

ws.on('message', (data) => {
  console.log('📨 Message reçu:', data.toString())
})

ws.on('error', (err) => {
  console.error('❌ Erreur WebSocket:', err.message)
})

ws.on('close', (code, reason) => {
  console.log(`🔌 Connexion fermée: ${code} - ${reason}`)
})

// Timeout 5 secondes
setTimeout(() => {
  console.log('⏱ Timeout - fermeture')
  ws.close()
  process.exit(0)
}, 5000)
