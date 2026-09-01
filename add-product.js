// ==========================================
// BABY KID - ADD / EDIT PRODUCT
// File: add-product.js
// Firebase Realtime Database + Storage
// ==========================================

import { db, storage, auth } from "./firebase.js";

import {
    ref,
    push,
    set,
    get
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


// ==========================================
// ELEMENTS
// ==========================================

const form =
    document.getElementById("add-product-form");

const imageInput =
    document.getElementById("product-image");

const imagePreview =
    document.getElementById("image-preview");

const previewImage =
    document.getElementById("preview-image");


// ==========================================
// GET EDIT PRODUCT ID
// ==========================================

const params =
    new URLSearchParams(window.location.search);

const productId =
    params.get("id");


// ==========================================
// SELECTED / EXISTING IMAGE
// ==========================================

let selectedImageFile = null;

let existingImageURL = "";


// ==========================================
// LOGIN CHECK
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href =
            "login.html";

        return;
    }


    if (productId) {

        await loadProductForEdit();

    }

});


// ==========================================
// IMAGE SELECT
// ==========================================

if (imageInput) {

    imageInput.addEventListener(
        "change",
        () => {

            const file =
                imageInput.files[0];


            if (!file) {
                return;
            }


            // Only images
            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select an image file."
                );

                imageInput.value = "";

                return;
            }


            // Maximum 5 MB
            if (file.size > 5 * 1024 * 1024) {

                alert(
                    "Image size must be less than 5 MB."
                );

                imageInput.value = "";

                return;
            }


            selectedImageFile =
                file;


            // Preview
            const imageURL =
                URL.createObjectURL(file);


            previewImage.src =
                imageURL;


            imagePreview.classList.add(
                "show"
            );

        }
    );

}


// ==========================================
// LOAD PRODUCT FOR EDIT
// ==========================================

async function loadProductForEdit() {

    try {

        const productRef =
            ref(
                db,
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


        document.getElementById(
            "product-name"
        ).value =
            product.name || "";


        document.getElementById(
            "product-category"
        ).value =
            product.category || "";


        document.getElementById(
            "product-price"
        ).value =
            product.price || "";


        document.getElementById(
            "product-old-price"
        ).value =
            product.oldPrice || "";


        document.getElementById(
            "product-badge"
        ).value =
            product.badge || "";


        document.getElementById(
            "product-description"
        ).value =
            product.description || "";


        document.getElementById(
            "product-sizes"
        ).value =
            Array.isArray(product.sizes)
                ? product.sizes.join(", ")
                : product.sizes || "";


        existingImageURL =
            product.image || "";


        // Show existing image
        if (existingImageURL) {

            previewImage.src =
                existingImageURL;

            imagePreview.classList.add(
                "show"
            );

        }


        // Edit mode
        const submitButton =
            form.querySelector(
                ".add-product-submit"
            );


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
// FORM SUBMIT
// ==========================================

if (form) {

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const submitButton =
                form.querySelector(
                    ".add-product-submit"
                );


            try {

                // Disable button
                submitButton.disabled =
                    true;


                submitButton.textContent =
                    productId
                        ? "Updating..."
                        : "Adding...";


                // ==================================
                // FORM VALUES
                // ==================================

                const name =
                    document.getElementById(
                        "product-name"
                    ).value.trim();


                const category =
                    document.getElementById(
                        "product-category"
                    ).value;


                const price =
                    Number(
                        document.getElementById(
                            "product-price"
                        ).value
                    );


                const oldPriceValue =
                    document.getElementById(
                        "product-old-price"
                    ).value;


                const oldPrice =
                    oldPriceValue
                        ? Number(oldPriceValue)
                        : 0;


                const badge =
                    document.getElementById(
                        "product-badge"
                    ).value;


                const description =
                    document.getElementById(
                        "product-description"
                    ).value.trim();


                const sizesText =
                    document.getElementById(
                        "product-sizes"
                    ).value.trim();


                const sizes =
                    sizesText
                        ? sizesText
                            .split(",")
                            .map(
                                size =>
                                    size.trim()
                            )
                            .filter(Boolean)
                        : [];


                // ==================================
                // VALIDATION
                // ==================================

                if (!name) {
                    throw new Error(
                        "Please enter product name."
                    );
                }


                if (!category) {
                    throw new Error(
                        "Please select a category."
                    );
                }


                if (
                    !Number.isFinite(price) ||
                    price < 0
                ) {
                    throw new Error(
                        "Please enter a valid price."
                    );
                }


                if (!description) {
                    throw new Error(
                        "Please enter product description."
                    );
                }


                // ==================================
                // IMAGE
                // ==================================

                let imageURL =
                    existingImageURL;


                // New image selected
                if (selectedImageFile) {

                    submitButton.textContent =
                        "Uploading Image...";


                    const fileExtension =
                        selectedImageFile.name
                            .split(".")
                            .pop();


                    const fileName =
                        `${Date.now()}-${Math.random()
                            .toString(36)
                            .substring(2)}.${fileExtension}`;


                    const imageRef =
                        storageRef(
                            storage,
                            `products/${fileName}`
                        );


                    const uploadResult =
                        await uploadBytes(
                            imageRef,
                            selectedImageFile
                        );


                    imageURL =
                        await getDownloadURL(
                            uploadResult.ref
                        );

                }


                // New product needs image
                if (
                    !imageURL &&
                    !productId
                ) {

                    throw new Error(
                        "Please select a product image."
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

                    badge,

                    image:
                        imageURL || "",

                    description,

                    sizes,

                    updatedAt:
                        new Date().toISOString()

                };


                // ==================================
                // SAVE / UPDATE
                // ==================================

                submitButton.textContent =
                    productId
                        ? "Updating Product..."
                        : "Saving Product...";


                if (productId) {

                    await set(
                        ref(
                            db,
                            `products/${productId}`
                        ),
                        productData
                    );


                    alert(
                        "Product updated successfully."
                    );

                } else {

                    const newProductRef =
                        push(
                            ref(
                                db,
                                "products"
                            )
                        );


                    productData.createdAt =
                        new Date().toISOString();


                    await set(
                        newProductRef,
                        productData
                    );


                    alert(
                        "Product added successfully."
                    );

                }


                // ==================================
                // GO DASHBOARD
                // ==================================

                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.error(
                    "Product save error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to save product."
                );


                submitButton.disabled =
                    false;


                submitButton.textContent =
                    productId
                        ? "Update Product"
                        : "Add Product";

            }

        }
    );

}