
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
// CLOUDINARY SETTINGS
// ==========================================

const CLOUDINARY_CLOUD_NAME = "yfid2on4";
const CLOUDINARY_UPLOAD_PRESET = "babykid";

const CLOUDINARY_UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


// ==========================================
// FORM ELEMENTS
// ==========================================

const form = document.getElementById("add-product-form");

const submitButton =
    form?.querySelector('button[type="submit"]');

const nameInput = document.getElementById("product-name");
const categoryInput = document.getElementById("product-category");
const subcategoryInput = document.getElementById("product-subcategory");
const subcategoryGroup =
    document.getElementById("newborn-subcategory-group");

const priceInput = document.getElementById("product-price");
const oldPriceInput = document.getElementById("product-old-price");
const badgeInput = document.getElementById("product-badge");
const imageInput = document.getElementById("product-image");
const descriptionInput = document.getElementById("product-description");
const sizesInput = document.getElementById("product-sizes");

const imagePreview = document.getElementById("image-preview");
const previewImage = document.getElementById("preview-image");


// ==========================================
// EDIT MODE
// ==========================================

const productId =
    new URLSearchParams(window.location.search).get("id");

const editMode = Boolean(productId);

let currentUser = null;
let existingImages = [];


// ==========================================
// CATEGORY HELPERS
// ==========================================

function normalizeCategory(category) {
    const value = String(category || "")
        .trim()
        .toLowerCase()
        .replace(/[_\s]+/g, "-");

    if (
        ["newborn", "new-born", "newborn-boys",
         "newborn-girls", "new-born-boys",
         "new-born-girls"].includes(value)
    ) {
        return "newborn";
    }

    if (["boy", "boys", "boyswear", "boys-wear"].includes(value)) {
        return "boys";
    }

    if (["girl", "girls", "girlswear", "girls-wear"].includes(value)) {
        return "girls";
    }

    if (["accessory", "accessories"].includes(value)) {
        return "accessories";
    }

    if (["baby", "baby-collection"].includes(value)) {
        return "newborn";
    }

    return value;
}


function getLegacyNewbornSubcategory(category) {
    const value = String(category || "")
        .trim()
        .toLowerCase()
        .replace(/[_\s]+/g, "-");

    if (["newborn-boys", "new-born-boys"].includes(value)) {
        return "newborn-boys";
    }

    if (["newborn-girls", "new-born-girls"].includes(value)) {
        return "newborn-girls";
    }

    return "";
}


// ==========================================
// NEW BORN SUBCATEGORY VISIBILITY
// ==========================================

function updateNewbornSubcategory() {
    if (!categoryInput || !subcategoryInput || !subcategoryGroup) {
        return;
    }

    const isNewborn =
        normalizeCategory(categoryInput.value) === "newborn";

    subcategoryGroup.classList.toggle("visible", isNewborn);
    subcategoryInput.required = isNewborn;

    if (!isNewborn) {
        subcategoryInput.value = "";
    }
}


categoryInput?.addEventListener(
    "change",
    updateNewbornSubcategory
);


// ==========================================
// IMAGE PREVIEW
// ==========================================

function showImagePreview(url) {
    if (!imagePreview || !previewImage) {
        return;
    }

    if (!url) {
        imagePreview.classList.remove("show");
        previewImage.src = "";
        return;
    }

    previewImage.onload = () => {
        imagePreview.classList.add("show");
    };

    previewImage.onerror = () => {
        imagePreview.classList.remove("show");
    };

    previewImage.src = url;
}


imageInput?.addEventListener("change", () => {
    const file = imageInput.files?.[0];

    if (!file) {
        showImagePreview(existingImages[0] || "");
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        imageInput.value = "";
        showImagePreview(existingImages[0] || "");
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert("Each image must be 10MB or smaller.");
        imageInput.value = "";
        showImagePreview(existingImages[0] || "");
        return;
    }

    showImagePreview(URL.createObjectURL(file));
});


// ==========================================
// CLOUDINARY IMAGE UPLOAD
// ==========================================

async function uploadImageToCloudinary(file) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
        throw new Error(
            data.error?.message || "Image upload failed."
        );
    }

    return data.secure_url;
}


// ==========================================
// LOAD EXISTING PRODUCT FOR EDITING
// ==========================================

async function loadProduct() {
    try {
        const snapshot = await get(
            ref(db, `products/${productId}`)
        );

        if (!snapshot.exists()) {
            alert("Product not found.");
            window.location.href = "dashboard.html";
            return;
        }

        const product = snapshot.val();

        nameInput.value = product.name || "";

        // Convert legacy category values to the new main category.
        const originalCategory = product.category || "";
        categoryInput.value = normalizeCategory(originalCategory);

        updateNewbornSubcategory();

        if (categoryInput.value === "newborn") {
            subcategoryInput.value =
                product.subcategory ||
                getLegacyNewbornSubcategory(originalCategory);
        }

        priceInput.value = product.price ?? "";
        oldPriceInput.value = product.oldPrice ?? "";
        badgeInput.value = product.badge || "";
        descriptionInput.value = product.description || "";

        sizesInput.value = Array.isArray(product.sizes)
            ? product.sizes.join(", ")
            : (product.sizes || "");

        if (Array.isArray(product.images) && product.images.length) {
            existingImages = product.images.filter(Boolean);
        } else if (product.image) {
            existingImages = [product.image];
        } else {
            existingImages = [];
        }

        showImagePreview(existingImages[0] || "");

        if (imageInput) {
            imageInput.required = false;
        }

        const heading = document.querySelector(
            ".add-product-heading h1"
        );

        const subtitle = document.querySelector(
            ".add-product-heading p"
        );

        if (heading) heading.textContent = "Edit Product";

        if (subtitle) {
            subtitle.textContent =
                "Update your Baby Kid product details.";
        }

        if (submitButton) {
            submitButton.textContent = "Update Product";
        }

    } catch (error) {
        console.error("Load product error:", error);
        alert("Unable to load product. Please try again.");
    }
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

    if (editMode) {
        await loadProduct();
    } else if (imageInput) {
        imageInput.required = true;
    }
});


// ==========================================
// ADD / UPDATE PRODUCT
// ==========================================

form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!currentUser) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const name = nameInput.value.trim();

    const category = normalizeCategory(categoryInput.value);

    const subcategory =
        category === "newborn"
            ? subcategoryInput.value
            : "";

    const price = Number(priceInput.value);

    const oldPriceValue = oldPriceInput.value.trim();

    const oldPrice = oldPriceValue
        ? Number(oldPriceValue)
        : null;

    const badge = badgeInput.value.trim();
    const description = descriptionInput.value.trim();

    const sizes = sizesInput.value
        .split(",")
        .map(size => size.trim())
        .filter(Boolean);

    const selectedFiles = imageInput?.files
        ? Array.from(imageInput.files)
        : [];

    // --------------------------------------
    // VALIDATION
    // --------------------------------------

    if (!name || !category || !description) {
        alert("Please fill all required fields.");
        return;
    }

    if (!Number.isFinite(price) || price <= 0) {
        alert("Enter a valid price greater than zero.");
        return;
    }

    if (
        oldPrice !== null &&
        (!Number.isFinite(oldPrice) || oldPrice <= price)
    ) {
        alert("Old Price should be higher than Selling Price.");
        return;
    }

    if (
        category === "newborn" &&
        !["newborn-boys", "newborn-girls"].includes(subcategory)
    ) {
        alert("Please select Newborn Boys or Newborn Girls.");
        return;
    }

    if (!editMode && selectedFiles.length === 0) {
        alert("Please select at least one product photo.");
        return;
    }

    if (selectedFiles.length > 3) {
        alert("You can select up to 3 photos.");
        return;
    }

    if (submitButton) {
        submitButton.disabled = true;
    }

    try {
        let imageUrls = [...existingImages];

        // ----------------------------------
        // UPLOAD NEW PHOTOS
        // ----------------------------------

        if (selectedFiles.length > 0) {
            imageUrls = [];

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];

                if (!file.type.startsWith("image/")) {
                    throw new Error(`Photo ${i + 1} is not a valid image.`);
                }

                if (file.size > 10 * 1024 * 1024) {
                    throw new Error(`Photo ${i + 1} exceeds 10MB.`);
                }

                if (submitButton) {
                    submitButton.textContent =
                        `Uploading Photo ${i + 1}/${selectedFiles.length}...`;
                }

                const url = await uploadImageToCloudinary(file);
                imageUrls.push(url);
            }
        }

        if (imageUrls.length === 0) {
            throw new Error("At least one product photo is required.");
        }

        // ----------------------------------
        // PRODUCT DATA
        // ----------------------------------

        const productData = {
            name,
            category,
            subcategory: subcategory || null,
            price,
            oldPrice,
            badge: badge || null,
            images: imageUrls,
            image: imageUrls[0],
            description,
            sizes
        };

        // ----------------------------------
        // UPDATE EXISTING PRODUCT
        // ----------------------------------

        if (editMode) {
            if (submitButton) {
                submitButton.textContent = "Saving Changes...";
            }

            await update(
                ref(db, `products/${productId}`),
                {
                    ...productData,
                    updatedBy: currentUser.uid,
                    updatedAt: Date.now()
                }
            );

            alert("Product updated successfully! ✅");
            window.location.href = "dashboard.html";
            return;
        }

        // ----------------------------------
        // ADD NEW PRODUCT
        // ----------------------------------

        if (submitButton) {
            submitButton.textContent = "Saving Product...";
        }

        const newProductRef = push(ref(db, "products"));

        await set(newProductRef, {
            ...productData,
            createdBy: currentUser.uid,
            createdAt: Date.now()
        });

        alert("Product added successfully! ✅");

        form.reset();
        existingImages = [];
        showImagePreview("");

        updateNewbornSubcategory();

    } catch (error) {
        console.error("Product save error:", error);

        alert(
            "Product could not be saved.\n\n" +
            (error.message || "Please try again.")
        );

    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = editMode
                ? "Update Product"
                : "Add Product";
        }
    }
});
