// ==========================================
// BABY KID - CUSTOMER PRODUCTS
// File: products.js
// Firebase Realtime Database
// ==========================================

import { db } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ==========================================
// PRODUCTS CONTAINER
// ==========================================

const productsContainer =
    document.getElementById("product-grid");


// ==========================================
// CHECK CONTAINER
// ==========================================

if (!productsContainer) {

    console.error(
        "Product grid not found: #product-grid"
    );

} else {

    loadProducts();

}


// ==========================================
// CATEGORY NORMALIZER
// ==========================================

function normalizeCategory(category) {

    const value =
        String(category || "")
            .trim()
            .toLowerCase();

    if (
        value === "boys" ||
        value === "boy" ||
        value === "boys wear" ||
        value === "boyswear"
    ) {
        return "boys";
    }

    if (
        value === "girls" ||
        value === "girl" ||
        value === "girls wear" ||
        value === "girlswear"
    ) {
        return "girls";
    }

    if (
        value === "newborn" ||
        value === "new born" ||
        value === "new-born" ||
        value === "new borns"
    ) {
        return "newborn";
    }

    if (
        value === "accessories" ||
        value === "accessory"
    ) {
        return "accessories";
    }

    return value;
}


// ==========================================
// LOAD PRODUCTS
// ==========================================

function loadProducts() {

    productsContainer.innerHTML = `
        <p class="loading-message">
            Loading products...
        </p>
    `;


    const productsRef =
        ref(db, "products");


    onValue(
        productsRef,

        (snapshot) => {

            productsContainer.innerHTML = "";


            // ==================================
            // NO PRODUCTS
            // ==================================

            if (!snapshot.exists()) {

                productsContainer.innerHTML = `
                    <p class="empty-message">
                        No products available right now.
                    </p>
                `;

                return;
            }


            const products =
                snapshot.val();


            // ==================================
            // PRODUCT CARDS
            // ==================================

            Object.entries(products)
                .forEach(([id, product]) => {

                    const card =
                        document.createElement("article");


                    card.className =
                        "product-card";


                    // ----------------------------------
                    // PRODUCT DATA
                    // ----------------------------------

                    const image =
                        product.image ||
                        "assets/logo.png";


                    const name =
                        product.name ||
                        "Baby Kid Product";


                    const price =
                        Number(product.price) || 0;


                    const oldPrice =
                        Number(product.oldPrice) || 0;


                    const badge =
                        product.badge || "";


                    const category =
                        normalizeCategory(
                            product.category
                        );


                    // ----------------------------------
                    // DATA ATTRIBUTES
                    // ----------------------------------

                    card.dataset.productId =
                        id;

                    card.dataset.productName =
                        name;

                    card.dataset.category =
                        category;

                    card.dataset.price =
                        price;


                    // ----------------------------------
                    // PRODUCT CARD HTML
                    // ----------------------------------

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
                                    onerror="this.src='assets/logo.png'"
                                >

                            </div>


                            <div class="product-card-content">

                                <h3>
                                    ${escapeHtml(name)}
                                </h3>


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


                                ${
                                    category
                                        ? `
                                            <p class="product-category">
                                                ${escapeHtml(category)}
                                            </p>
                                        `
                                        : ""
                                }

                            </div>

                        </a>

                    `;


                    productsContainer.appendChild(
                        card
                    );

                });


            // ==================================
            // HIDE "COMING SOON" MESSAGE
            // WHEN PRODUCTS EXIST
            // ==================================

            const noProducts =
                document.getElementById("no-products");

            if (noProducts) {
                noProducts.hidden = true;
            }


            // ==================================
            // APPLY CURRENT FILTER
            // ==================================

            document.dispatchEvent(
                new CustomEvent("productsLoaded")
            );

        },

        (error) => {

            console.error(
                "Products loading error:",
                error
            );


            productsContainer.innerHTML = `
                <p class="error-message">
                    Unable to load products.
                    Please try again later.
                </p>
            `;

        }
    );

}


// ==========================================
// SECURITY HELPERS
// ==========================================

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