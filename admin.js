 // Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Firebase Config

const firebaseConfig = {

    apiKey: "AIzaSyC6nT8HiXDargNR02jkYXJVOFaeYsX1ats",

    authDomain: "baby-kid-4107e.firebaseapp.com",

    projectId: "baby-kid-4107e",

    storageBucket: "baby-kid-4107e.firebasestorage.app",

    messagingSenderId: "45906293564",

    appId: "1:45906293564:web:f4b76b01899e736189a439"

};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Login Button

document.getElementById("loginBtn").addEventListener("click", () => {

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)

    .then(() => {

        alert("Login Successful ✅");

        window.location.href = "dashboard.html";

    })

    .catch((error) => {

        alert(error.message);

    });

});