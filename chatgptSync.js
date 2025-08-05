import fetch from "node-fetch";

const FIREBASE_URL = "https://sacredsystemmmo-default-rtdb.firebaseio.com";

// Log Magic Moment
export async function logMagicMoment(player, action) {
  const log = { player, action, timestamp: Date.now() };
  await fetch(`${FIREBASE_URL}/logs.json`, {
    method: "POST",
    body: JSON.stringify(log),
  });
  return `✨ Logged: ${player} - ${action}`;
}

// Spawn NPC with unique type limit
export async function spawnNPC(name, world) {
  // Fetch current NPCs
  const response = await fetch(`${FIREBASE_URL}/npcs.json`);
  const data = await response.json();

  // Prevent duplicates
  if (data) {
    for (const key in data) {
      if (data[key].name === name) {
        return `⚠️ NPC ${name} already exists`;
      }
    }
  }

  const npc = { name, world, spawnedAt: Date.now() };
  await fetch(`${FIREBASE_URL}/npcs.json`, {
    method: "POST",
    body: JSON.stringify(npc),
  });

  return `👾 NPC ${name} spawned in ${world}`;
}