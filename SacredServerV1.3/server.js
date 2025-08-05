import express from "express";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, onValue } from "firebase/database";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const firebaseConfig = {
  apiKey: "AIzaSyACQKI02JmztkNkC8sscx0wqq5Ppjn2oKs",
  authDomain: "sacredsystemmmo.firebaseapp.com",
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com",
  projectId: "sacredsystemmmo",
  storageBucket: "sacredsystemmmo.firebasestorage.app",
  messagingSenderId: "854698379558",
  appId: "1:854698379558:web:c4ec0830a05bcad854d9e7"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const PORT = process.env.PORT || 3000;

// --- NPC SYSTEM v2.3.1 ---
const npcPool = [
  "Spider-Man", "Morty", "Rick Sanchez", "Hulk", "Iron Man",
  "Captain Marvel", "Thor", "Loki", "Black Panther", "Penny Proud",
  "Oscar Proud", "Trudy Proud", "Cloud 9 - Jonah", "Cloud 9 - Amy",
  "Cloud 9 - Glenn", "Cloud 9 - Dina", "Cloud 9 - Cheyenne",
  "Goku", "Naruto", "Sasuke", "Tanjiro", "Deku",
  "Mickey Mouse", "SpongeBob"
];

let activeNPCs = {}; // Track NPCs so no duplicates

function spawnRandomNPC() {
  const available = npcPool.filter(npc => !activeNPCs[npc]);
  if (available.length === 0) return null;

  const npc = available[Math.floor(Math.random() * available.length)];
  activeNPCs[npc] = true;

  const npcData = {
    name: npc,
    world: "RandomWorld",
    spawnedAt: Date.now()
  };

  set(ref(db, "npcs/" + npc), npcData);
  return npcData;
}

// Spawn NPCs every 15 seconds (max one of each)
setInterval(() => {
  const npc = spawnRandomNPC();
  if (npc) console.log("Spawned NPC:", npc.name);
}, 15000);

// --- API ---
app.get("/npcs", async (req, res) => {
  const snapshot = await get(ref(db, "npcs"));
  res.json(snapshot.exists() ? snapshot.val() : {});
});

app.listen(PORT, () => console.log(`Sacred Server v2.3.1 running on port ${PORT}`));