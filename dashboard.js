 // ==========================================
// BABY KID DASHBOARD
// Version 4.0
// ==========================================

// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase Config

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_AUTH_DOMAIN",

    projectId: "YOUR_PROJECT_ID",

    storageBucket: "YOUR_STORAGE_BUCKET",

    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

    appId: "YOUR_APP_ID"

};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Check Login

onAuthStateChanged(auth, (user)=>{

    if(!user){

        window.location.href="admin.html";

    }

});

// Logout

document
.getElementById("logoutBtn")
.addEventListener("click",()=>{

    signOut(auth)
    .then(()=>{

        alert("Logged Out");

        window.location.href="admin.html";

    });

});

// Add Product Button

document
.getElementById("addProductBtn")
.addEventListener("click",()=>{

    window.location.href="add-product.html";

});