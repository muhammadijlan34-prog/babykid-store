// ==========================================
// BABY KID - ADD PRODUCT
// Firebase Authentication + Realtime Database
// ==========================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


const form =
    document.getElementById("add-product-form");

const submitButton =
    form.querySelector('button[type="submit"]');


let currentUser = null;


// ==========================================
// CHECK ADMIN LOGIN
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }

    currentUser = user;

});


// ==========================================
// ADD PRODUCT
// ==========================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();


    if (!currentUser) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }


    const name =
        document.getElementById("product-name")
        .value
        .trim();


    const category =
        document.getElementById("product-category")
        .value
        .trim();


    const price =
        Number(
            document.getElementById("product-price")
            .value
        );


    const oldPriceValue =
        document.getElementById("product-old-price")
        .value
        .trim();


    const oldPrice =
        oldPriceValue
            ? Number(oldPriceValue)
            : null;


    const badge =
        document.getElementById("product-badge")
        .value
        .trim();


    const image =
        document.getElementById("product-image")
        .value
        .trim();


    const description =
        document.getElementById("product-description")
        .value
        .trim();


    const sizes =
        document.getElementById("product-sizes")
        .value
        .split(",")
        .map(size => size.trim())
        .filter(Boolean);


    // ======================================
    // VALIDATION
    // ======================================

    if (
        !name ||
        !category ||
        !price ||
        !image ||
        !description
    ) {

        alert(
            "Please fill all required fields."
        );

        return;
    }


    if (price <= 0) {

        alert(
            "Price must be greater than 0."
        );

        return;
    }


    if (
        oldPrice !== null &&
        oldPrice <= price
    ) {

        alert(
            "Old Price should be higher than the current Price."
        );

        return;
    }


    // ======================================
    // BUTTON LOADING
    // ======================================

    submitButton.disabled = true;

    submitButton.textContent =
        "Saving Product...";


    try {

        // ==================================
        // PRODUCT DATA
        // ==================================

        const product = {

            name: name,

            category: category,

            price: price,

            oldPrice: oldPrice,

            badge: badge || null,

            image: image,

            description: description,

            sizes: sizes,

            createdBy: currentUser.uid,

            createdAt: Date.now()

        };


        // ==================================
        // SAVE TO FIREBASE
        // ==================================

        const productsRef =
            ref(db, "products");


        const newProductRef =
            push(productsRef);


        await set(
            newProductRef,
            product
        );


        // ==================================
        // SUCCESS
        // ==================================

        alert(
            "Product added successfully! ✅"
        );


        form.reset();


        const preview =
            document.getElementById(
                "image-preview"
            );


        if (preview) {

            preview.classList.remove("show");

        }


        const previewImage =
            document.getElementById(
                "preview-image"
            );


        if (previewImage) {

            previewImage.src = "";

        }


    } catch (error) {

        console.error(
            "Add product error:",
            error
        );


        alert(
            "Product could not be saved.\n\n" +
            error.message
        );

    } finally {

        submitButton.disabled = false;

        submitButton.textContent =
            "Add Product";

    }

});