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
                        product.category || "";


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