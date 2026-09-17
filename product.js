// ==========================================
// BABY KID - PRODUCT DETAILS
// File: product.js
// Firebase Product Details
// Multiple Product Images
// WhatsApp Order
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
    new URLSearchParams(
        window.location.search
    );

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


        renderProduct(
            product
        );

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

    if (!productDetail) {
        return;
    }


    productDetail.innerHTML = `

        <div class="product-loading">

            <p>
                ${escapeHtml(message)}
            </p>

            <a
                href="index.html#products"
            >
                ← Back to Products
            </a>

        </div>

    `;

}


// ==========================================
// GET PRODUCT IMAGES
// ==========================================

function getProductImages(product) {

    let images = [];


    // --------------------------------------
    // NEW MULTIPLE IMAGE FORMAT
    // --------------------------------------

    if (Array.isArray(product.images)) {

        images =
            product.images
                .filter(Boolean)
                .map(
                    image =>
                        String(image).trim()
                )
                .filter(Boolean);

    }


    // --------------------------------------
    // SUPPORT OBJECT FORMAT
    // --------------------------------------

    else if (
        product.images &&
        typeof product.images === "object"
    ) {

        images =
            Object.values(product.images)
                .filter(Boolean)
                .map(
                    image =>
                        String(image).trim()
                )
                .filter(Boolean);

    }


    // --------------------------------------
    // OLD SINGLE IMAGE FORMAT
    // --------------------------------------

    if (
        images.length === 0 &&
        product.image
    ) {

        images = [
            String(product.image).trim()
        ];

    }


    // --------------------------------------
    // FALLBACK
    // --------------------------------------

    if (images.length === 0) {

        images = [
            "assets/logo.png"
        ];

    }


    // --------------------------------------
    // MAXIMUM 3 IMAGES
    // --------------------------------------

    return images.slice(0, 3);

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


    const badge =
        product.badge || "";


    const images =
        getProductImages(product);


    const sizes =
        Array.isArray(product.sizes)

            ? product.sizes

            : typeof product.sizes === "string"

                ? product.sizes
                    .split(",")
                    .map(
                        size =>
                            size.trim()
                    )
                    .filter(Boolean)

                : [];


    // ======================================
    // PRODUCT URL
    // ======================================

    const productUrl =
        `${window.location.origin}` +
        `${window.location.pathname}` +
        `?id=${encodeURIComponent(productId)}`;


    // ======================================
    // MAIN PRODUCT HTML
    // ======================================

    productDetail.innerHTML = `

        <div class="product-details">


            <!-- ==================================
                 PRODUCT IMAGE AREA
                 ================================== -->

            <div class="product-main-image">


                ${
                    badge
                        ? `
                            <span
                                class="product-detail-badge"
                            >
                                ${escapeHtml(badge)}
                            </span>
                          `
                        : ""
                }


                <div
                    class="product-image-slider"
                    id="product-image-slider"
                >

                    <div
                        class="product-image-track"
                        id="product-image-track"
                    >

                        ${images.map(
                            (image, index) => `

                            <div
                                class="product-slide"
                                data-slide="${index}"
                            >

                                <img
                                    src="${escapeAttribute(image)}"
                                    alt="${escapeAttribute(name)} - Photo ${index + 1}"
                                    class="product-main-photo"
                                    loading="${index === 0 ? "eager" : "lazy"}"
                                    onerror="this.src='assets/logo.png'"
                                >

                            </div>

                        `
                        ).join("")}

                    </div>


                    ${
                        images.length > 1
                            ? `

                                <button
                                    type="button"
                                    class="product-slider-btn product-slider-prev"
                                    id="product-slider-prev"
                                    aria-label="Previous photo"
                                >
                                    ‹
                                </button>


                                <button
                                    type="button"
                                    class="product-slider-btn product-slider-next"
                                    id="product-slider-next"
                                    aria-label="Next photo"
                                >
                                    ›
                                </button>


                                <div
                                    class="product-slider-dots"
                                    id="product-slider-dots"
                                >

                                    ${images.map(
                                        (_, index) => `

                                            <button
                                                type="button"
                                                class="product-slider-dot ${index === 0 ? "active" : ""}"
                                                data-slide="${index}"
                                                aria-label="View photo ${index + 1}"
                                            ></button>

                                        `
                                    ).join("")}

                                </div>

                              `
                            : ""
                    }

                </div>


                ${
                    images.length > 1
                        ? `

                            <div
                                class="product-thumbnails"
                                id="product-thumbnails"
                            >

                                ${images.map(
                                    (image, index) => `

                                        <button
                                            type="button"
                                            class="product-thumbnail ${index === 0 ? "active" : ""}"
                                            data-slide="${index}"
                                        >

                                            <img
                                                src="${escapeAttribute(image)}"
                                                alt="Product photo ${index + 1}"
                                                onerror="this.src='assets/logo.png'"
                                            >

                                        </button>

                                    `
                                ).join("")}

                            </div>

                          `
                        : ""
                }

            </div>


            <!-- ==================================
                 PRODUCT INFORMATION
                 ================================== -->

            <div class="product-details-info">


                <p
                    class="product-category"
                >
                    ${escapeHtml(category)}
                </p>


                <h1>
                    ${escapeHtml(name)}
                </h1>


                <div class="product-detail-price">

                    <span>
                        ₹${price}
                    </span>


                    ${
                        oldPrice > price
                            ? `

                                <span
                                    class="product-detail-old-price"
                                >
                                    ₹${oldPrice}
                                </span>

                              `
                            : ""
                    }

                </div>


                <p
                    class="product-detail-description"
                >
                    ${escapeHtml(description)}
                </p>


                <!-- ==================================
                     SIZE
                     ================================== -->

                ${
                    sizes.length
                        ? `

                            <div
                                class="product-size-section"
                            >

                                <h3>
                                    Select Size
                                </h3>


                                <div
                                    class="product-sizes"
                                >

                                    ${sizes.map(
                                        size => `

                                            <button
                                                type="button"
                                                class="size-btn"
                                                data-size="${escapeAttribute(size)}"
                                            >
                                                ${escapeHtml(size)}
                                            </button>

                                        `
                                    ).join("")}

                                </div>

                            </div>

                          `
                        : ""
                }


                <!-- ==================================
                     QUANTITY
                     ================================== -->

                <div
                    class="product-quantity-row"
                >

                    <label
                        for="product-quantity"
                    >
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


                <!-- ==================================
                     ORDER BOX
                     ================================== -->

                <div
                    class="product-order-box"
                >

                    <h3>
                        Order this product
                    </h3>


                    <p>
                        Enter your details and send
                        your order directly on WhatsApp.
                    </p>


                    <form
                        id="product-order-form"
                        class="product-order-form"
                    >


                        <input
                            type="text"
                            id="customer-name"
                            placeholder="Your Name"
                            autocomplete="name"
                            required
                        >


                        <input
                            type="tel"
                            id="customer-phone"
                            placeholder="Phone Number"
                            autocomplete="tel"
                            required
                        >


                        <textarea
                            id="customer-address"
                            placeholder="Delivery Address"
                            autocomplete="street-address"
                            required
                        ></textarea>


                        <button
                            type="submit"
                            class="product-whatsapp-btn"
                        >
                            Order on WhatsApp
                        </button>


                    </form>

                </div>


            </div>

        </div>

    `;


    setupImageSlider(
        images
    );


    setupProductInteractions(
        {
            name,
            category,
            price,
            images,
            productUrl
        }
    );

}


// ==========================================
// IMAGE SLIDER
// ==========================================

function setupImageSlider(images) {

    if (images.length <= 1) {
        return;
    }


    const slider =
        document.getElementById(
            "product-image-slider"
        );


    const track =
        document.getElementById(
            "product-image-track"
        );


    const dots =
        document.querySelectorAll(
            ".product-slider-dot"
        );


    const thumbnails =
        document.querySelectorAll(
            ".product-thumbnail"
        );


    const previousButton =
        document.getElementById(
            "product-slider-prev"
        );


    const nextButton =
        document.getElementById(
            "product-slider-next"
        );


    if (!slider || !track) {
        return;
    }


    let currentIndex = 0;


    function showSlide(index) {

        if (index < 0) {

            index =
                images.length - 1;

        }


        if (
            index >= images.length
        ) {

            index = 0;

        }


        currentIndex =
            index;


        track.style.transform =
            `translateX(-${index * 100}%)`;


        dots.forEach(
            (dot, dotIndex) => {

                dot.classList.toggle(
                    "active",
                    dotIndex === index
                );

            }
        );


        thumbnails.forEach(
            (thumbnail, thumbnailIndex) => {

                thumbnail.classList.toggle(
                    "active",
                    thumbnailIndex === index
                );

            }
        );

    }


    // ======================================
    // PREVIOUS
    // ======================================

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            () => {

                showSlide(
                    currentIndex - 1
                );

            }
        );

    }


    // ======================================
    // NEXT
    // ======================================

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                showSlide(
                    currentIndex + 1
                );

            }
        );

    }


    // ======================================
    // DOTS
    // ======================================

    dots.forEach(
        (dot, index) => {

            dot.addEventListener(
                "click",
                () => {

                    showSlide(index);

                }
            );

        }
    );


    // ======================================
    // THUMBNAILS
    // ======================================

    thumbnails.forEach(
        (thumbnail, index) => {

            thumbnail.addEventListener(
                "click",
                () => {

                    showSlide(index);

                }
            );

        }
    );


    // ======================================
    // TOUCH SWIPE
    // ======================================

    let touchStartX = 0;
    let touchEndX = 0;


    slider.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        {
            passive: true
        }
    );


    slider.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[0].screenX;


            const difference =
                touchStartX - touchEndX;


            if (
                Math.abs(difference) < 40
            ) {

                return;

            }


            if (difference > 0) {

                showSlide(
                    currentIndex + 1
                );

            } else {

                showSlide(
                    currentIndex - 1
                );

            }

        },
        {
            passive: true
        }
    );


    // ======================================
    // INITIAL SLIDE
    // ======================================

    showSlide(0);

}


// ==========================================
// PRODUCT INTERACTIONS
// ==========================================

function setupProductInteractions(
    product
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

    sizeButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    sizeButtons.forEach(
                        item => {

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

        }
    );


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
            event => {

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


                // ------------------------------
                // SIZE REQUIRED
                // ------------------------------

                if (
                    sizeButtons.length &&
                    !selectedSize
                ) {

                    alert(
                        "Please select a size."
                    );

                    return;

                }


                // ------------------------------
                // NAME
                // ------------------------------

                if (!name) {

                    alert(
                        "Please enter your name."
                    );

                    customerName.focus();

                    return;

                }


                // ------------------------------
                // PHONE
                // ------------------------------

                if (!phone) {

                    alert(
                        "Please enter your phone number."
                    );

                    customerPhone.focus();

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


                // ------------------------------
                // ADDRESS
                // ------------------------------

                if (!address) {

                    alert(
                        "Please enter your delivery address."
                    );

                    customerAddress.focus();

                    return;

                }


                // ==================================
                // IMAGE LINK
                // ==================================

                const mainImage =
                    product.images?.[0] ||
                    "";


                // ==================================
                // WHATSAPP MESSAGE
                // ==================================

                const message =
`Hello Baby Kid 👋

I would like to order this product.

👕 Product: ${product.name}
🆔 Product ID: ${productId}
📂 Category: ${product.category}
📏 Size: ${selectedSize || "Not specified"}
🔢 Quantity: ${quantity}
💰 Price: ₹${product.price}

👤 Customer Name: ${name}
📞 Phone: ${phone}

📍 Delivery Address:
${address}

🔗 Product Link:
${product.productUrl}

🖼️ Product Photo:
${mainImage}

Please confirm availability and delivery details.

Thank you ❤️`;


                // ==================================
                // WHATSAPP URL
                // ==================================

                const whatsappURL =
                    `https://wa.me/${WHATSAPP_NUMBER}` +
                    `?text=` +
                    encodeURIComponent(
                        message
                    );


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
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value) {

    return escapeHtml(value);

}


// ==========================================
// START
// ==========================================

loadProduct();