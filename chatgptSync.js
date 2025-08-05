import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyACQKI02JmztkNkC8sscx0wqq5Ppjn2oKs",
  authDomain: "sacredsystemmmo.firebaseapp.com",
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com",
  projectId: "sacredsystemmmo",
  storageBucket: "sacredsystemmmo.firebasestorage.app",
  messagingSenderId: "854698379558",
  appId: "1:854698379558:web:c4ec0830a05bcad854d9e7"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 Log any ChatGPT action into Firebase in real time
export function logActionToFirebase(player, action) {
  const logsRef = ref(db, "sacredLogs");
  push(logsRef, {
    player,
    action,
    timestamp: Date.now()
  });
}

// 🔹 Listen for changes to sacredLogs and broadcast them to your server
export function startListeningForActions(onNewAction) {
  const logsRef = ref(db, "sacredLogs");
  onValue(logsRef, (snapshot) => {
    const logs = snapshot.val();
    if (!logs) return;

    const lastKey = Object.keys(logs).pop();
    const lastLog = logs[lastKey];
    onNewAction(lastLog);
  });
}

// Example usage
startListeningForActions((action) => {
  console.log("🔥 New Action Synced:", action.player, action.action);
});
