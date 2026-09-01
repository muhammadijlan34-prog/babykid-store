// ==========================================
// BABY KID - PRODUCT DETAILS
// File: product.js
// Firebase Product Details + WhatsApp Order
// ==========================================

import { db } from "./firebase.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ==========================================
// SETTINGS
// ==========================================

const WHATSAPP_NUMBER = "919995953131";


// ==========================================
// ELEMENTS
// ==========================================

const productDetail =
    document.getElementById("product-detail");


// ==========================================
// GET PRODUCT ID
// ==========================================

const params =
    new URLSearchParams(window.location.search);

const productId =
    params.get("id");


// ==========================================
// LOAD PRODUCT
// ==========================================

async function loadProduct() {

    if (!productDetail) {
        return;
    }


    if (!productId) {

        showError(
            "Product information is missing."
        );

        return;
    }


    try {

        const productRef =
            ref(
                db,
                `products/${productId}`
            );


        const snapshot =
            await get(productRef);


        if (!snapshot.exists()) {

            showError(
                "Product not found."
            );

            return;
        }


        const product =
            snapshot.val();


        renderProduct(product);

    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );


        showError(
            "Unable to load product. Please try again."
        );

    }

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

    productDetail.innerHTML = `
        <div class="product-loading">
            <p>${escapeHtml(message)}</p>
            <a href="products.html">
                ← Back to Products
            </a>
        </div>
    `;

}


// ==========================================
// RENDER PRODUCT
// ==========================================

function renderProduct(product) {

    const name =
        product.name ||
        "Baby Kid Product";

    const category =
        product.category ||
        "Kidswear";

    const description =
        product.description ||
        "Beautiful and comfortable kidswear from Baby Kid.";

    const price =
        Number(product.price) || 0;

    const oldPrice =
        Number(product.oldPrice) || 0;

    const image =
        product.image ||
        "assets/logo.png";

    const badge =
        product.badge || "";

    const sizes =
        Array.isArray(product.sizes)
            ? product.sizes
            : typeof product.sizes === "string"
                ? product.sizes
                    .split(",")
                    .map(size => size.trim())
                    .filter(Boolean)
                : [];


    productDetail.innerHTML = `

        <div class="product-detail-image">

            ${
                badge
                    ? `
                        <span
                            id="product-badge"
                            class="product-badge"
                        >
                            ${escapeHtml(badge)}
                        </span>
                    `
                    : ""
            }

            <img
                id="product-image"
                src="${escapeAttribute(image)}"
                alt="${escapeAttribute(name)}"
                onerror="this.src='assets/logo.png'"
            >

        </div>


        <div class="product-detail-info">

            <p
                id="product-category"
                class="product-category"
            >
                ${escapeHtml(category)}
            </p>


            <h1 id="product-name">
                ${escapeHtml(name)}
            </h1>


            <div class="product-price">

                <span
                    id="product-price"
                    class="current-price"
                >
                    ₹${price}
                </span>

                ${
                    oldPrice > price
                        ? `
                            <span
                                id="product-old-price"
                                class="old-price"
                            >
                                ₹${oldPrice}
                            </span>
                          `
                        : ""
                }

            </div>


            <p
                id="product-description"
                class="product-description"
            >
                ${escapeHtml(description)}
            </p>


            ${
                sizes.length
                    ? `
                        <div class="product-sizes">

                            <h3>
                                Select Size
                            </h3>

                            <div class="size-options">

                                ${sizes.map(size => `
                                    <button
                                        type="button"
                                        class="size-btn"
                                        data-size="${escapeAttribute(size)}"
                                    >
                                        ${escapeHtml(size)}
                                    </button>
                                `).join("")}

                            </div>

                        </div>
                      `
                    : ""
            }


            <div class="product-quantity">

                <label for="product-quantity">
                    Quantity
                </label>

                <input
                    type="number"
                    id="product-quantity"
                    value="1"
                    min="1"
                    max="20"
                >

            </div>


            <form
                id="product-order-form"
                class="product-order-form"
            >

                <input
                    type="text"
                    id="customer-name"
                    placeholder="Your Name"
                    required
                >


                <input
                    type="tel"
                    id="customer-phone"
                    placeholder="Phone Number"
                    required
                >


                <textarea
                    id="customer-address"
                    placeholder="Delivery Address"
                    required
                ></textarea>


                <button
                    type="submit"
                    class="whatsapp-order-btn"
                >
                    Order on WhatsApp
                </button>

            </form>

        </div>

    `;


    setupProductInteractions(
        name,
        category,
        price
    );

}


// ==========================================
// PRODUCT INTERACTIONS
// ==========================================

function setupProductInteractions(
    productName,
    productCategory,
    productPrice
) {

    let selectedSize = "";


    const sizeButtons =
        document.querySelectorAll(
            ".size-btn"
        );


    const quantityInput =
        document.getElementById(
            "product-quantity"
        );


    const orderForm =
        document.getElementById(
            "product-order-form"
        );


    const customerName =
        document.getElementById(
            "customer-name"
        );


    const customerPhone =
        document.getElementById(
            "customer-phone"
        );


    const customerAddress =
        document.getElementById(
            "customer-address"
        );


    // ======================================
    // SIZE
    // ======================================

    sizeButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                sizeButtons.forEach(
                    (item) => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                selectedSize =
                    button.dataset.size ||
                    button.textContent.trim();

            }
        );

    });


    // ======================================
    // QUANTITY
    // ======================================

    if (quantityInput) {

        quantityInput.addEventListener(
            "input",
            () => {

                let value =
                    parseInt(
                        quantityInput.value,
                        10
                    );


                if (
                    Number.isNaN(value) ||
                    value < 1
                ) {
                    value = 1;
                }


                if (value > 20) {
                    value = 20;
                }


                quantityInput.value =
                    value;

            }
        );

    }


    // ======================================
    // WHATSAPP ORDER
    // ======================================

    if (orderForm) {

        orderForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const name =
                    customerName.value.trim();


                const phone =
                    customerPhone.value.trim();


                const address =
                    customerAddress.value.trim();


                const quantity =
                    quantityInput
                        ? quantityInput.value
                        : "1";


                if (
                    sizeButtons.length &&
                    !selectedSize
                ) {

                    alert(
                        "Please select a size."
                    );

                    return;
                }


                if (!name) {

                    alert(
                        "Please enter your name."
                    );

                    customerName.focus();

                    return;
                }


                if (!phone) {

                    alert(
                        "Please enter your phone number."
                    );

                    customerPhone.focus();

                    return;
                }


                if (!address) {

                    alert(
                        "Please enter your delivery address."
                    );

                    customerAddress.focus();

                    return;
                }


                const cleanPhone =
                    phone.replace(
                        /\D/g,
                        ""
                    );


                if (
                    cleanPhone.length < 10
                ) {

                    alert(
                        "Please enter a valid phone number."
                    );

                    customerPhone.focus();

                    return;
                }


                const message =
`Hello Baby Kid 👋

I would like to order this product.

👗 Product: ${productName}
📂 Category: ${productCategory}
📏 Size: ${selectedSize || "Not specified"}
🔢 Quantity: ${quantity}
💰 Price: ₹${productPrice}

👤 Customer Name: ${name}
📞 Phone: ${phone}
📍 Delivery Address:
${address}

Please confirm availability and delivery details.

Thank you ❤️`;


                const whatsappURL =
                    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
                    encodeURIComponent(message);


                window.open(
                    whatsappURL,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }

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


// ==========================================
// START
// ==========================================

loadProduct();