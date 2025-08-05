// relay.js – Sacred System MMO v2.4
// Handles incoming ChatGPT actions and syncs them to Firebase

import express from 'express';
import fetch from 'node-fetch';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import bodyParser from 'body-parser';
import cors from 'cors';

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyACQKI02JmztkNkC8sscx0wqq5Ppjn2oKs",
  authDomain: "sacredsystemmmo.firebaseapp.com",
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com",
  projectId: "sacredsystemmmo",
  storageBucket: "sacredsystemmmo.firebasestorage.app",
  messagingSenderId: "854698379558",
  appId: "1:854698379558:web:c4ec0830a05bcad854d9e7"
};

// Initialize Firebase
const appFB = initializeApp(firebaseConfig);
const db = getDatabase(appFB);

// --- Express Server ---
const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- POST Endpoint for ChatGPT Actions ---
app.post('/sync', async (req, res) => {
  try {
    const { player, action, location, npc } = req.body;

    if (!player || !action) {
      return res.status(400).json({ error: 'Missing player or action' });
    }

    // Push event to Firebase
    const logRef = ref(db, 'gameLogs');
    await push(logRef, {
      timestamp: Date.now(),
      player,
      action,
      location: location || null,
      npc: npc || null
    });

    console.log(`Synced: ${player} -> ${action}`);
    res.json({ status: 'success' });

  } catch (err) {
    console.error('Error syncing:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sacred MMO Relay v2.4 running on port ${PORT}`);
});
