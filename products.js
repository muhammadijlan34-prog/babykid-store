
/* ==========================================
   BABY KID - CUSTOMER PRODUCTS
   File: products.js
   Firebase Realtime Database
   ========================================== */

import { db } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


/* ==========================================
   PRODUCTS CONTAINER
   ========================================== */

const productsContainer =
    document.getElementById("product-grid");

if (productsContainer) {
    loadProducts();
} else {
    console.error("Product grid not found: #product-grid");
}


/* ==========================================
   NORMALIZE MAIN CATEGORY
   Supports new and older product records.
   ========================================== */

function normalizeCategory(category) {
    const value = String(category || "")
        .trim()
        .toLowerCase()
        .replace(/[_\s]+/g, "-");

    if (
        ["boys", "boy", "boyswear", "boys-wear"].includes(value)
    ) {
        return "boys";
    }

    if (
        ["girls", "girl", "girlswear", "girls-wear"].includes(value)
    ) {
        return "girls";
    }

    if (
        [
            "newborn",
            "new-born",
            "newborn-boys",
            "newborn-girls",
            "new-born-boys",
            "new-born-girls",
            "baby",
            "baby-collection"
        ].includes(value)
    ) {
        return "newborn";
    }

    if (
        ["accessories", "accessory"].includes(value)
    ) {
        return "accessories";
    }

    return value;
}


/* ==========================================
   NEWBORN SUBCATEGORY
   Supports older records too.
   ========================================== */

function getNewbornSubcategory(product) {
    const savedSubcategory = String(
        product.subcategory || ""
    )
        .trim()
        .toLowerCase()
        .replace(/[_\s]+/g, "-");

    const oldCategory = String(
        product.category || ""
    )
        .trim()
        .toLowerCase()
        .replace(/[_\s]+/g, "-");

    const value = savedSubcategory || oldCategory;

    if (
        ["newborn-boys", "new-born-boys"].includes(value)
    ) {
        return "newborn-boys";
    }

    if (
        ["newborn-girls", "new-born-girls"].includes(value)
    ) {
        return "newborn-girls";
    }

    return "";
}


function getCategoryLabel(category, subcategory) {
    if (category === "newborn") {
        if (subcategory === "newborn-boys") {
            return "New Born • Boys";
        }

        if (subcategory === "newborn-girls") {
            return "New Born • Girls";
        }

        return "New Born";
    }

    const labels = {
        boys: "Boys",
        girls: "Girls",
        accessories: "Accessories"
    };

    return labels[category] || category;
}


/* ==========================================
   LOAD PRODUCTS FROM FIREBASE
   ========================================== */

function loadProducts() {
    productsContainer.innerHTML = `
        <p class="loading-message">Loading products...</p>
    `;

    onValue(
        ref(db, "products"),

        (snapshot) => {
            productsContainer.innerHTML = "";

            if (!snapshot.exists()) {
                productsContainer.innerHTML = `
                    <p class="empty-message">
                        No products available right now.
                    </p>
                `;

                document.dispatchEvent(
                    new CustomEvent("productsLoaded")
                );

                return;
            }

            const products = snapshot.val();

            Object.entries(products).forEach(([id, product]) => {
                if (!product || typeof product !== "object") {
                    return;
                }

                const card = document.createElement("article");
                card.className = "product-card";

                const category = normalizeCategory(
                    product.category
                );

                const subcategory = getNewbornSubcategory(
                    product
                );

                const categoryLabel = getCategoryLabel(
                    category,
                    subcategory
                );

                const name = String(
                    product.name || "Baby Kid Product"
                );

                const price = Number(product.price) || 0;
                const oldPrice = Number(product.oldPrice) || 0;
                const badge = String(product.badge || "");

                let images = [];

                if (
                    Array.isArray(product.images) &&
                    product.images.length
                ) {
                    images = product.images.filter(
                        image => typeof image === "string" && image
                    );
                }

                if (images.length === 0 && product.image) {
                    images = [product.image];
                }

                const image = images[0] || "assets/logo.png";

                /* Data attributes used by script.js filters */
                card.dataset.productId = id;
                card.dataset.productName = name;
                card.dataset.category = category;
                card.dataset.subcategory = subcategory;
                card.dataset.price = String(price);

                card.innerHTML = `
                    <a
                        href="product.html?id=${encodeURIComponent(id)}"
                        class="product-card-link"
                    >
                        <div class="product-image-wrap">
                            ${
                                badge
                                    ? `
                                        <span class="product-badge">
                                            ${escapeHtml(badge)}
                                        </span>
                                    `
                                    : ""
                            }

                            <img
                                src="${escapeAttribute(image)}"
                                alt="${escapeAttribute(name)}"
                                class="product-image"
                                loading="lazy"
                            >
                        </div>

                        <div class="product-card-content">
                            <h3>${escapeHtml(name)}</h3>

                            <div class="product-price">
                                <span class="current-price">
                                    ₹${price}
                                </span>

                                ${
                                    oldPrice > price
                                        ? `
                                            <span class="old-price">
                                                ₹${oldPrice}
                                            </span>
                                        `
                                        : ""
                                }
                            </div>

                            <p class="product-category">
                                ${escapeHtml(categoryLabel)}
                            </p>
                        </div>
                    </a>
                `;

                const productImage =
                    card.querySelector(".product-image");

                productImage.addEventListener("error", () => {
                    productImage.src = "assets/logo.png";
                }, { once: true });

                productsContainer.appendChild(card);
            });

            const noProducts =
                document.getElementById("no-products");

            if (noProducts) {
                noProducts.hidden =
                    productsContainer.querySelectorAll(".product-card").length > 0;
            }

            /* Notify script.js to reapply the selected filter */
            document.dispatchEvent(
                new CustomEvent("productsLoaded")
            );
        },

        (error) => {
            console.error("Products loading error:", error);

            productsContainer.innerHTML = `
                <p class="error-message">
                    Unable to load products.
                    Please try again later.
                </p>
            `;
        }
    );
}


/* ==========================================
   HTML ESCAPING
   ========================================== */

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
}
