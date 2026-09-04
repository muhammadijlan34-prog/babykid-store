// ==========================================
// BABY KID - ADD / EDIT PRODUCT
// Firebase Authentication + Realtime Database
// Cloudinary Image Upload
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
// ==========================================

const CLOUDINARY_CLOUD_NAME = "yfid2on4";
const CLOUDINARY_UPLOAD_PRESET = "babykid";

const CLOUDINARY_UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


// ==========================================
// FORM ELEMENTS
// ==========================================

const form = document.getElementById("add-product-form");
const submitButton = form?.querySelector('button[type="submit"]');

const productId =
    new URLSearchParams(window.location.search).get("id");

const editMode = Boolean(productId);

let currentUser = null;
let existingImageUrl = "";


// ==========================================
// INPUTS
// ==========================================

const nameInput = document.getElementById("product-name");
const categoryInput = document.getElementById("product-category");
const priceInput = document.getElementById("product-price");
const oldPriceInput = document.getElementById("product-old-price");
const badgeInput = document.getElementById("product-badge");
const imageInput = document.getElementById("product-image");
const descriptionInput = document.getElementById("product-description");
const sizesInput = document.getElementById("product-sizes");

const imagePreview = document.getElementById("image-preview");
const previewImage = document.getElementById("preview-image");


// ==========================================
// IMAGE PREVIEW
// ==========================================

function showImagePreview(url) {

    if (!url) {
        imagePreview?.classList.remove("show");

        if (previewImage) {
            previewImage.src = "";
        }

        return;
    }

    if (previewImage) {

        previewImage.src = url;

        previewImage.onload = () => {
            imagePreview?.classList.add("show");
        };

        previewImage.onerror = () => {
            imagePreview?.classList.remove("show");
        };
    }
}


// ==========================================
// LOCAL IMAGE PREVIEW
// ==========================================

if (imageInput) {

    imageInput.addEventListener("change", () => {

        const file = imageInput.files[0];

        if (!file) {
            showImagePreview(existingImageUrl);
            return;
        }

        if (!file.type.startsWith("image/")) {

            alert("Please select an image file.");

            imageInput.value = "";

            showImagePreview(existingImageUrl);

            return;
        }

        if (file.size > 10 * 1024 * 1024) {

            alert("Image must be 10MB or smaller.");

            imageInput.value = "";

            showImagePreview(existingImageUrl);

            return;
        }

        const imageUrl = URL.createObjectURL(file);

        showImagePreview(imageUrl);
    });
}


// ==========================================
// CLOUDINARY IMAGE UPLOAD
// ==========================================

async function uploadImageToCloudinary(file) {

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
    );

    const response = await fetch(
        CLOUDINARY_UPLOAD_URL,
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();

    if (!response.ok || !data.secure_url) {

        throw new Error(
            data.error?.message ||
            "Image upload failed."
        );
    }

    return data.secure_url;
}


// ==========================================
// AUTH CHECK
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }

    currentUser = user;

    // Existing image is enough during edit mode.
    // New image is optional while editing.
    if (imageInput) {
        imageInput.required = !editMode;
    }

    if (editMode) {

        await loadProduct();
    }
});


// ==========================================
// LOAD PRODUCT FOR EDIT
// ==========================================

async function loadProduct() {

    try {

        const productRef =
            ref(db, `products/${productId}`);

        const snapshot = await get(productRef);

        if (!snapshot.exists()) {

            alert("Product not found.");

            window.location.href = "dashboard.html";

            return;
        }

        const product = snapshot.val();

        nameInput.value = product.name || "";

        categoryInput.value =
            product.category || "";

        priceInput.value =
            product.price ?? "";

        oldPriceInput.value =
            product.oldPrice ?? "";

        badgeInput.value =
            product.badge || "";

        descriptionInput.value =
            product.description || "";

        sizesInput.value =
            Array.isArray(product.sizes)
                ? product.sizes.join(", ")
                : (product.sizes || "");


        // IMPORTANT:
        // File input cannot be filled with an old URL.
        existingImageUrl =
            product.image || "";

        showImagePreview(existingImageUrl);


        const heading =
            document.querySelector(".add-product-heading h1");

        if (heading) {
            heading.textContent = "Edit Product";
        }


        const subtitle =
            document.querySelector(".add-product-heading p");

        if (subtitle) {
            subtitle.textContent =
                "Update your Baby Kid product details.";
        }


        if (submitButton) {
            submitButton.textContent =
                "Update Product";
        }

    } catch (error) {

        console.error(
            "Load product error:",
            error
        );

        alert("Unable to load product.");
    }
}


// ==========================================
// FORM SUBMIT
// ==========================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();


    if (!currentUser) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }


    // ======================================
    // GET FORM VALUES
    // ======================================

    const name =
        nameInput.value.trim();

    const category =
        categoryInput.value.trim();

    const price =
        Number(priceInput.value);

    const oldPriceValue =
        oldPriceInput.value.trim();

    const oldPrice =
        oldPriceValue
            ? Number(oldPriceValue)
            : null;

    const badge =
        badgeInput.value.trim();

    const description =
        descriptionInput.value.trim();

    const sizes =
        sizesInput.value
            .split(",")
            .map(size => size.trim())
            .filter(Boolean);


    const selectedFile =
        imageInput?.files?.[0] || null;


    // ======================================
    // VALIDATION
    // ======================================

    if (
        !name ||
        !category ||
        !price ||
        !description
    ) {

        alert(
            "Please fill all required fields."
        );

        return;
    }


    if (
        !editMode &&
        !selectedFile
    ) {

        alert(
            "Please select a product image."
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
    // DISABLE BUTTON
    // ======================================

    submitButton.disabled = true;


    try {

        let imageUrl = existingImageUrl;


        // ==================================
        // UPLOAD NEW IMAGE
        // ==================================

        if (selectedFile) {

            submitButton.textContent =
                "Uploading Image...";


            imageUrl =
                await uploadImageToCloudinary(
                    selectedFile
                );
        }


        if (!imageUrl) {

            throw new Error(
                "Product image is required."
            );
        }


        // ==================================
        // PRODUCT DATA
        // ==================================

        const productData = {

            name,

            category,

            price,

            oldPrice,

            badge: badge || null,

            image: imageUrl,

            description,

            sizes
        };


        // ==================================
        // EDIT PRODUCT
        // ==================================

        if (editMode) {

            submitButton.textContent =
                "Saving Changes...";


            await update(
                ref(db, `products/${productId}`),
                {
                    ...productData,

                    updatedBy:
                        currentUser.uid,

                    updatedAt:
                        Date.now()
                }
            );


            alert(
                "Product updated successfully! ✅"
            );


            window.location.href =
                "dashboard.html";

            return;
        }


        // ==================================
        // ADD NEW PRODUCT
        // ==================================

        submitButton.textContent =
            "Saving Product...";


        const productsRef =
            ref(db, "products");

        const newProductRef =
            push(productsRef);


        await set(
            newProductRef,
            {
                ...productData,

                createdBy:
                    currentUser.uid,

                createdAt:
                    Date.now()
            }
        );


        alert(
            "Product added successfully! ✅"
        );


        form.reset();

        existingImageUrl = "";

        imagePreview?.classList.remove("show");

        if (previewImage) {
            previewImage.src = "";
        }


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

        submitButton.disabled = false;

        submitButton.textContent =
            editMode
                ? "Update Product"
                : "Add Product";
    }

});