// ==========================================
// BABY KID - ADD / EDIT PRODUCT
// File: add-product.js
// Firebase Authentication + Realtime Database
// Cloudinary Multiple Image Upload
// ==========================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    ref,
    push,
    set,
    update,
    get
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ==========================================
// CLOUDINARY CONFIG
// =================================