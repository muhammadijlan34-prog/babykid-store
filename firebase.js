// =========================================================
// BABY KID
// FILE 9: firebase.js
// =========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC6nT8HiXDargNR02jkYXJVOFaeYsX1ats",
    authDomain: "baby-kid-4107e.firebaseapp.com",
    databaseURL: "https://baby-kid-4107e-default-rtdb.firebaseio.com",
    projectId: "baby-kid-4107e",
    storageBucket: "baby-kid-4107e.firebasestorage.app",
    messagingSenderId: "45906293564",
    appId: "1:45906293564:web:f4b76b01899e736189a439",
    measurementId: "G-DTFHKQ1M3S"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

export {
    app,
    db,
    storage,
    auth
};