import express from 'express';
import bodyParser from 'body-parser';
import { WebSocketServer } from 'ws';
import events from 'events';
import cors from 'cors';
import app from '../app.mjs'; // Import the main Express app

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Increase the max listeners to prevent memory leak warning
events.EventEmitter.defaultMaxListeners = 20;

// Initialize WebSocket server
const wss = new WebSocketServer({ noServer: true });

// Store active WebSocket connections
const clients = new Map();

// Function to extract CheckoutRequestID from the URL
function getCheckoutRequestID(request) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  return url.pathname.split('/').pop();
}

// Handle WebSocket connection events
wss.on('connection', (ws, request) => {
  const checkoutRequestID = getCheckoutRequestID(request);

  // Store the WebSocket connection
  clients.set(checkoutRequestID, ws);

  // Handle messages from clients
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong' })); // Respond to pings
    }
  });

  // Handle WebSocket closure
  ws.on('close', () => {
    console.log(`WebSocket closed for ${checkoutRequestID}`);
    clients.delete(checkoutRequestID);
  });

  // Handle WebSocket errors
  ws.on('error', (error) => {
    console.error(`WebSocket error for ${checkoutRequestID}:`, error);
    clients.delete(checkoutRequestID); // Remove connection on error
  });
});

// Handle upgrade requests to upgrade HTTP requests to WebSocket
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Notify client function to send payment status updates
export function notifyClient(checkoutRequestID, status,Code) {
  if (clients.has(checkoutRequestID)) {
    const ws = clients.get(checkoutRequestID);
    ws.send(JSON.stringify({ checkoutRequestID, status,Code })); // Send the status to the client
  } else {
    console.log('Notify triggered but no client found', checkoutRequestID, "status", status,"code",Code);
  }
}
