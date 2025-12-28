const WebSocket = require('ws');

const SOLANA_WS_URL = 'wss://api.solanastreaming.com/';
const API_KEY = 'xxxxxxxxxxxxxxxx'; // Replace with your real API key

let ws;

function connect() {
    ws = new WebSocket(SOLANA_WS_URL, undefined, {
        headers: {
            'X-API-KEY': API_KEY
        }
    });

    ws.on('open', () => {
        console.log('✅ Connected to SolanaStreaming');

        // Subscribe to new pairs
        ws.send(JSON.stringify({
            id: 1,
            method: 'newPairSubscribe',
            include_pumpfun: true
        }));
    });

    ws.on('message', (data) => {
        console.log('🪙 Received:', data.toString());
    });

    ws.on('error', (err) => {
        console.error('❌ WebSocket Error:', err.message || err);
    });

    ws.on('close', (code) => {
        console.warn(`⚠️ WS closed (code: ${code}) — reconnecting in 10s`);
        setTimeout(connect, 10000);
    });
}

// Export function to start streaming
function startSolanaStreaming() {
    connect();

    // Heartbeat every 15s for Railway logs
    setInterval(() => console.log('🫀 heartbeat'), 15000);
}

module.exports = { startSolanaStreaming };
