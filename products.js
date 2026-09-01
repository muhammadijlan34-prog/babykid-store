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
// ELEMENTS
// ==========================================

const productsContainer =
    document.getElementById("products-container") ||
    document.getElementById("productsList") ||
    document.querySelector(".products-grid");


// ==========================================
// LOAD PRODUCTS
// ==========================================

function loadProducts() {

    if (!productsContainer) {
        console.error(
            "Products container not found."
        );
        return;
    }


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
                                                ${badge}
                                            </span>
                                          `
                                        : ""
                                }

                                <img
                                    src="${image}"
                                    alt="${name}"
                                    class="product-image"
                                    onerror="this.src='assets/logo.png'"
                                >

                            </div>


                            <div class="product-card-content">

                                <h3>
                                    ${name}
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
                                    product.category
                                        ? `
                                            <p class="product-category">
                                                ${product.category}
                                            </p>
                                          `
                                        : ""
                                }

                            </div>

                        </a>

                    `;


                    productsContainer.appendChild(card);

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
// START
// ==========================================

loadProducts();