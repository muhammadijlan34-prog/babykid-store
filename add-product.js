// ==========================================
// BABY KID - ADD PRODUCT
// Part 11A
// ==========================================

// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase Config

const firebaseConfig = {

    apiKey: "const firebaseConfig = {
  apiKey: "AIzaSyC6nT8HiXDargNR02jkYXJVOFaeYsX1ats",
  authDomain: "baby-kid-4107e.firebaseapp.com",
  projectId: "baby-kid-4107e",
  storageBucket: "baby-kid-4107e.firebasestorage.app",
  messagingSenderId: "45906293564",
  appId: "1:45906293564:web:f4b76b01899e736189a439",
  measurementId: "G-DTFHKQ1M3S"
};",

    authDomain: "YOUR_AUTH_DOMAIN",

    projectId: "YOUR_PROJECT_ID",

    storageBucket: "YOUR_STORAGE_BUCKET",

    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

    appId: "YOUR_APP_ID"

};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// Cloudinary Details

const CLOUD_NAME = "yfid2on4";

const UPLOAD_PRESET = "babykid";

// Form Elements

const productName = document.getElementById("productName");

const productPrice = document.getElementById("productPrice");

const productCategory = document.getElementById("productCategory");

const productDescription = document.getElementById("productDescription");

const productImage = document.getElementById("productImage");

const saveButton = document.getElementById("saveProduct");
// ==========================================
// Upload Image to Cloudinary
// ==========================================

async function uploadImage(file) {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(

        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

        {

            method: "POST",

            body: formData

        }

    );

    const data = await response.json();

    return data.secure_url;

}
saveButton.addEventListener("click", async () => {

    if (productImage.files.length === 0) {

        alert("Please select an image.");

        return;

    }

    saveButton.innerText = "Uploading...";

    const imageUrl = await uploadImage(productImage.files[0]);

    console.log(imageUrl);

    saveButton.innerText = "Save Product";

});