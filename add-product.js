/* =========================================================
   BABY KID
   FILE: add-product.js
   Add Product → Firebase
   ========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

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


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


/* =========================================================
   FORM
   ========================================================= */

const form =
    document.getElementById("add-product-form");


if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const submitButton =
            form.querySelector(
                'button[type="submit"]'
            );


        const name =
            document
                .getElementById("product-name")
                .value
                .trim();


        const category =
            document
                .getElementById("product-category")
                .value
                .trim();


        const price =
            document
                .getElementById("product-price")
                .value
                .trim();


        const oldPrice =
            document
                .getElementById("product-old-price")
                .value
                .trim();


        const badge =
            document
                .getElementById("product-badge")
                .value
                .trim();


        const image =
            document
                .getElementById("product-image")
                .value
                .trim();


        const description =
            document
                .getElementById("product-description")
                .value
                .trim();


        const sizes =
            document
                .getElementById("product-sizes")
                .value
                .trim();


        /* =================================================
           VALIDATION
        ================================================= */

        if (!name || !category || !price || !image || !description) {

            alert(
                "Please fill all required fields."
            );

            return;

        }


        /* =================================================
           BUTTON STATE
        ================================================= */

        submitButton.disabled = true;

        submitButton.textContent =
            "Saving Product...";


        try {

            /* =============================================
               PRODUCT DATA
            ============================================= */

            const product = {

                name: name,

                category: category,

                price: Number(price),

                oldPrice:
                    oldPrice ?
                    Number(oldPrice) :
                    null,

                badge:
                    badge || null,

                image: image,

                description: description,

                sizes:
                    sizes
                        ?
                        sizes
                            .split(",")
                            .map(size => size.trim())
                            .filter(Boolean)
                        :
                        [],

                createdAt:
                    serverTimestamp()

            };


            /* =============================================
               SAVE TO FIREBASE
            ============================================= */

            const productsRef =
                ref(database, "products");


            const newProductRef =
                push(productsRef);


            await set(
                newProductRef,
                product
            );


            /* =============================================
               SUCCESS
            ============================================= */

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
                "Firebase error:",
                error
            );


            alert(
                "Product could not be saved. Please check Firebase settings and try again."
            );


        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                "Add Product";

        }

    });

}