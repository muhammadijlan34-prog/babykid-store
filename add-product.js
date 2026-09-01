// ==========================================
// BABY KID - ADD / EDIT PRODUCT
// Firebase Authentication + Realtime Database
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


const form =
    document.getElementById("add-product-form");

const submitButton =
    form?.querySelector('button[type="submit"]');

const productId =
    new URLSearchParams(window.location.search).get("id");

const editMode =
    Boolean(productId);

let currentUser = null;


// ==========================================
// FORM ELEMENTS
// ==========================================

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


// ==========================================
// IMAGE PREVIEW
// ==========================================

const imagePreview =
    document.getElementById("image-preview");

const previewImage =
    document.getElementById("preview-image");


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


if (imageInput) {

    imageInput.addEventListener("input", () => {

        showImagePreview(
            imageInput.value.trim()
        );

    });

}


// ==========================================
// AUTHENTICATION
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }

    currentUser = user;


    // ======================================
    // EDIT MODE
    // ======================================

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
            ref(
                db,
                `products/${productId}`
            );


        const snapshot =
            await get(productRef);


        if (!snapshot.exists()) {

            alert("Product not found.");

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


        sizesInput.value =
            Array.isArray(product.sizes)
                ? product.sizes.join(", ")
                : (product.sizes || "");


        showImagePreview(
            product.image || ""
        );


        // ==================================
        // CHANGE PAGE TEXT
        // ==================================

        const heading =
            document.querySelector(
                ".add-product-heading h1"
            );

        if (heading) {

            heading.textContent =
                "Edit Product";

        }


        const subtitle =
            document.querySelector(
                ".add-product-heading p"
            );

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

        alert(
            "Unable to load product."
        );

    }

}


// ==========================================
// SUBMIT FORM
// ==========================================

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


        // ==================================
        // GET VALUES
        // ==================================

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

        const oldPrice =
            oldPriceValue
                ? Number(oldPriceValue)
                : null;

        const badge =
            badgeInput.value.trim();

        const image =
            imageInput.value.trim();

        const description =
            descriptionInput.value.trim();

        const sizes =
            sizesInput.value
                .split(",")
                .map(size => size.trim())
                .filter(Boolean);


        // ==================================
        // VALIDATION
        // ==================================

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


        // ==================================
        // BUTTON
        // ==================================

        submitButton.disabled = true;

        submitButton.textContent =
            editMode
                ? "Updating Product..."
                : "Saving Product...";


        try {

            const productData = {

                name,
                category,
                price,
                oldPrice,
                badge: badge || null,
                image,
                description,
                sizes

            };


            // ==================================
            // EDIT PRODUCT
            // ==================================

            if (editMode) {

                await update(
                    ref(
                        db,
                        `products/${productId}`
                    ),
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

            const productsRef =
                ref(
                    db,
                    "products"
                );


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


            imagePreview?.classList.remove(
                "show"
            );


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

    }
);