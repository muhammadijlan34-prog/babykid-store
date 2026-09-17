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
// CLOUDINARY
// ==========================================

const CLOUDINARY_CLOUD_NAME = "yfid2on4";
const CLOUDINARY_UPLOAD_PRESET = "babykid";

const CLOUDINARY_UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


// ==========================================
// FORM
// ==========================================

const form =
    document.getElementById("add-product-form");

const submitButton =
    form?.querySelector('button[type="submit"]');


// ==========================================
// EDIT MODE
// ==========================================

const productId =
    new URLSearchParams(window.location.search).get("id");

const editMode =
    Boolean(productId);


// ==========================================
// CURRENT USER
// ==========================================

let currentUser = null;


// ==========================================
// EXISTING IMAGES
// ==========================================

let existingImages = [];


// ==========================================
// INPUTS
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
// PREVIEW
// ==========================================

const imagePreview =
    document.getElementById("image-preview");

const previewImage =
    document.getElementById("preview-image");


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

    if (!previewImage) {
        return;
    }

    previewImage.src = url;

    previewImage.onload = () => {
        imagePreview?.classList.add("show");
    };

    previewImage.onerror = () => {
        imagePreview?.classList.remove("show");
    };
}


// ==========================================
// SELECTED IMAGE PREVIEW
// ==========================================

if (imageInput) {

    imageInput.addEventListener("change", () => {

        const file =
            imageInput.files?.[0] || null;

        if (!file) {
            showImagePreview(
                existingImages[0] || ""
            );
            return;
        }

        if (!file.type.startsWith("image/")) {

            alert(
                "Please select an image file."
            );

            imageInput.value = "";

            showImagePreview(
                existingImages[0] || ""
            );

            return;
        }

        if (file.size > 10 * 1024 * 1024) {

            alert(
                "Image must be 10MB or smaller."
            );

            imageInput.value = "";

            showImagePreview(
                existingImages[0] || ""
            );

            return;
        }

        const previewUrl =
            URL.createObjectURL(file);

        showImagePreview(previewUrl);
    });
}


// ==========================================
// CLOUDINARY UPLOAD
// ==========================================

async function uploadImageToCloudinary(file) {

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
    );

    const response =
        await fetch(
            CLOUDINARY_UPLOAD_URL,
            {
                method: "POST",
                body: formData
            }
        );

    const data =
        await response.json();

    if (
        !response.ok ||
        !data.secure_url
    ) {
        throw new Error(
            data.error?.message ||
            "Image upload failed."
        );
    }

    return data.secure_url;
}


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

            alert(
                "Product not found."
            );

            window.location.href =
                "dashboard.html";

            return;
        }

        const product =
            snapshot.val();


        // --------------------------------------
        // BASIC DETAILS
        // --------------------------------------

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

        descriptionInput.value =
            product.description || "";


        // --------------------------------------
        // SIZES
        // --------------------------------------

        sizesInput.value =
            Array.isArray(product.sizes)
                ? product.sizes.join(", ")
                : (
                    product.sizes ||
                    ""
                );


        // --------------------------------------
        // IMAGES
        // --------------------------------------

        if (
            Array.isArray(product.images) &&
            product.images.length
        ) {

            existingImages =
                product.images.filter(Boolean);

        } else if (product.image) {

            // Old product compatibility
            existingImages = [
                product.image
            ];

        } else {

            existingImages = [];
        }


        // Show first existing image

        showImagePreview(
            existingImages[0] || ""
        );


        // --------------------------------------
        // EDIT PAGE TEXT
        // --------------------------------------

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
// AUTHENTICATION
// ==========================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }

        currentUser =
            user;


        // Photo 1 required only when adding
        // During edit, old image can remain.

        if (imageInput) {

            imageInput.required =
                !editMode;
        }


        if (editMode) {

            await loadProduct();
        }
    }
);


// ==========================================
// FORM SUBMIT
// ==========================================

form?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        // --------------------------------------
        // LOGIN CHECK
        // --------------------------------------

        if (!currentUser) {

            alert(
                "Please login first."
            );

            window.location.href =
                "login.html";

            return;
        }


        // --------------------------------------
        // GET VALUES
        // --------------------------------------

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

        const description =
            descriptionInput.value.trim();


        // --------------------------------------
        // SIZES
        // --------------------------------------

        const sizes =
            sizesInput.value
                .split(",")
                .map(
                    size => size.trim()
                )
                .filter(Boolean);


        // --------------------------------------
        // SELECTED PHOTOS
        // --------------------------------------

        const selectedFiles =
            imageInput?.files
                ? Array.from(
                    imageInput.files
                )
                : [];


        // --------------------------------------
        // VALIDATION
        // --------------------------------------

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
            selectedFiles.length === 0
        ) {

            alert(
                "Please select Product Photo 1."
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


        if (selectedFiles.length > 3) {

            alert(
                "You can select maximum 3 photos."
            );

            return;
        }


        // --------------------------------------
        // DISABLE BUTTON
        // --------------------------------------

        if (submitButton) {

            submitButton.disabled =
                true;
        }


        try {

            // ==================================
            // IMAGE ARRAY
            // ==================================

            let imageUrls = [
                ...existingImages
            ];


            // ==================================
            // NEW IMAGE UPLOADS
            // ==================================

            if (
                selectedFiles.length > 0
            ) {

                imageUrls = [];


                for (
                    let i = 0;
                    i < selectedFiles.length;
                    i++
                ) {

                    if (submitButton) {

                        submitButton.textContent =
                            `Uploading Image ${i + 1}/${selectedFiles.length}...`;
                    }


                    const file =
                        selectedFiles[i];


                    // File type check

                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        throw new Error(
                            `Photo ${i + 1} is not a valid image.`
                        );
                    }


                    // File size check

                    if (
                        file.size >
                        10 * 1024 * 1024
                    ) {

                        throw new Error(
                            `Photo ${i + 1} must be 10MB or smaller.`
                        );
                    }


                    const uploadedUrl =
                        await uploadImageToCloudinary(
                            file
                        );


                    imageUrls.push(
                        uploadedUrl
                    );
                }
            }


            // ==================================
            // FINAL IMAGE CHECK
            // ==================================

            if (
                imageUrls.length === 0
            ) {

                throw new Error(
                    "At least one product photo is required."
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

                badge:
                    badge || null,

                // New multi-image field
                images:
                    imageUrls,

                // Old compatibility field
                image:
                    imageUrls[0],

                description,

                sizes
            };


            // ==================================
            // EDIT PRODUCT
            // ==================================

            if (editMode) {

                if (submitButton) {

                    submitButton.textContent =
                        "Saving Changes...";
                }


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

            if (submitButton) {

                submitButton.textContent =
                    "Saving Product...";
            }


            const productsRef =
                ref(
                    db,
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
                        Date.now()
                }
            );


            // ==================================
            // SUCCESS
            // ==================================

            alert(
                "Product added successfully! ✅"
            );


            form.reset();


            existingImages = [];


            imagePreview?.classList.remove(
                "show"
            );


            if (previewImage) {

                previewImage.src =
                    "";
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

            if (submitButton) {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    editMode
                        ? "Update Product"
                        : "Add Product";
            }
        }
    }
);