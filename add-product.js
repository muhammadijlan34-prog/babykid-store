// ==========================================
// BABY KID - ADD / EDIT PRODUCT
// Firebase Authentication + Realtime Database
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    push,
    set,
    update,
    get,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

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


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);


// ==========================================
// ELEMENTS
// ==========================================

const form =
    document.getElementById("add-product-form");

const submitButton =
    form?.querySelector(
        'button[type="submit"]'
    );

const nameInput =
    document.getElementById("product-name");

const categoryInput =
    document.getElementById("product-category");

const priceInput =
    document.getElementById("product-price");

const oldPriceInput =
    document.getElementById("product-old-price");

const badgeInput =
    document.getElementById("product-badge");

const imageInput =
    document.getElementById("product-image");

const descriptionInput =
    document.getElementById("product-description");

const sizesInput =
    document.getElementById("product-sizes");

const imagePreview =
    document.getElementById("image-preview");

const previewImage =
    document.getElementById("preview-image");


// ==========================================
// EDIT MODE
// ==========================================

const urlParams =
    new URLSearchParams(window.location.search);

const productId =
    urlParams.get("id");

const isEditMode =
    Boolean(productId);


// ==========================================
// AUTH CHECK
// ==========================================

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href =
            "login.html";

        return;
    }

    currentUser = user;

    if (isEditMode) {

        await loadProductForEdit();

    }

});


// ==========================================
// LOAD PRODUCT FOR EDIT
// ==========================================

async function loadProductForEdit() {

    try {

        const productRef =
            ref(
                database,
                `products/${productId}`
            );

        const snapshot =
            await get(productRef);


        if (!snapshot.exists()) {

            alert(
                "Product not found."
            );

            window.location.href =
                "dashboard.html";

            return;
        }


        const product =
            snapshot.val();


        nameInput.value =
            product.name || "";

        categoryInput.value =
            product.category || "";

        priceInput.value =
            product.price ?? "";

        oldPriceInput.value =
            product.oldPrice ?? "";

        badgeInput.value =
            product.badge || "";

        imageInput.value =
            product.image || "";

        descriptionInput.value =
            product.description || "";


        if (Array.isArray(product.sizes)) {

            sizesInput.value =
                product.sizes.join(", ");

        } else {

            sizesInput.value =
                product.sizes || "";

        }


        // Update page heading
        const heading =
            document.querySelector(
                ".add-product-heading h1"
            );

        if (heading) {

            heading.textContent =
                "Edit Product";

        }


        // Update description
        const headingText =
            document.querySelector(
                ".add-product-heading p"
            );

        if (headingText) {

            headingText.textContent =
                "Update your Baby Kid product details.";

        }


        // Update button
        if (submitButton) {

            submitButton.textContent =
                "Update Product";

        }


        // Show image preview
        showImagePreview(
            product.image || ""
        );


    } catch (error) {

        console.error(
            "Load product error:",
            error
        );

        alert(
            "Unable to load product."
        );

    }

}


// ==========================================
// IMAGE PREVIEW
// ==========================================

function showImagePreview(url) {

    if (!url) {

        imagePreview?.classList.remove(
            "show"
        );

        if (previewImage) {
            previewImage.src = "";
        }

        return;
    }


    previewImage.src = url;

    previewImage.onload = () => {

        imagePreview.classList.add(
            "show"
        );

    };

    previewImage.onerror = () => {

        imagePreview.classList.remove(
            "show"
        );

    };

}


if (imageInput) {

    imageInput.addEventListener(
        "input",
        () => {

            showImagePreview(
                imageInput.value.trim()
            );

        }
    );

}


// ==========================================
// FORM SUBMIT
// ==========================================

if (form) {

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (!currentUser) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;

            }


            const name =
                nameInput.value.trim();

            const category =
                categoryInput.value.trim();

            const price =
                Number(
                    priceInput.value
                );

            const oldPriceValue =
                oldPriceInput.value.trim();

            const badge =
                badgeInput.value.trim();

            const image =
                imageInput.value.trim();

            const description =
                descriptionInput.value.trim();

            const sizes =
                sizesInput.value
                    .split(",")
                    .map(
                        size =>
                            size.trim()
                    )
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


            if (
                oldPriceValue &&
                Number(oldPriceValue) < price
            ) {

                alert(
                    "Old Price should normally be higher than the current Price."
                );

                return;

            }


            submitButton.disabled =
                true;


            submitButton.textContent =
                isEditMode
                    ? "Updating Product..."
                    : "Saving Product...";


            try {

                const productData = {

                    name,

                    category,

                    price,

                    oldPrice:
                        oldPriceValue
                            ? Number(
                                oldPriceValue
                            )
                            : null,

                    badge:
                        badge || null,

                    image,

                    description,

                    sizes

                };


                // ==================================
                // EDIT PRODUCT
                // ==================================

                if (isEditMode) {

                    await update(
                        ref(
                            database,
                            `products/${productId}`
                        ),
                        {
                            ...productData,

                            updatedBy:
                                currentUser.uid,

                            updatedAt:
                                serverTimestamp()
                        }
                    );


                    alert(
                        "Product updated successfully! ✅"
                    );


                }

                // ==================================
                // ADD PRODUCT
                // ==================================

                else {

                    const productsRef =
                        ref(
                            database,
                            "products"
                        );

                    const newProductRef =
                        push(
                            productsRef
                        );


                    await set(
                        newProductRef,
                        {
                            ...productData,

                            createdBy:
                                currentUser.uid,

                            createdAt:
                                serverTimestamp()
                        }
                    );


                    alert(
                        "Product added successfully! ✅"
                    );

                }


                // ==================================
                // AFTER SUCCESS
                // ==================================

                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.error(
                    "Product save error:",
                    error
                );


                alert(
                    "Product could not be saved.\n\n" +
                    error.message
                );


            } finally {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    isEditMode
                        ? "Update Product"
                        : "Add Product";

            }

        }
    );

}