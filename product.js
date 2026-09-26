// ==========================================
// BABY KID - PRODUCT DETAILS
// File: product.js
// Single Image Slider + Full Screen Gallery
// Multiple Product Images + WhatsApp Order
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
// GLOBAL SLIDER STATE
// ==========================================

let currentImageIndex = 0;

let currentProductImages = [];

let currentProductName = "";


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
    // ARRAY FORMAT
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
    // OBJECT FORMAT
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
    // FALLBACK IMAGE
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
    // SAVE GLOBAL IMAGE DATA
    // ======================================

    currentImageIndex = 0;

    currentProductImages = images;

    currentProductName = name;


    // ======================================
    // PRODUCT URL
    // ======================================

    const productUrl =
        `${window.location.origin}` +
        `${window.location.pathname}` +
        `?id=${encodeURIComponent(productId)}`;


    // ======================================
    // PRICE HTML
    // ======================================

    const priceHTML =
        oldPrice > price

            ? `
                <div class="product-price-row">

                    <span class="product-price">
                        ₹${price}
                    </span>

                    <span class="product-old-price">
                        ₹${oldPrice}
                    </span>

                </div>
              `

            : `
                <div class="product-price-row">

                    <span class="product-price">
                        ₹${price}
                    </span>

                </div>
              `;


    // ======================================
    // SIZE HTML
    // ======================================

    const sizeHTML =
        sizes.length

            ? `
                <div class="product-size-section">

                    <h3>
                        Select Size
                    </h3>

                    <div
                        class="product-size-options"
                    >

                        ${sizes.map(
                            (size, index) => `

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

            : "";


    // ======================================
    // IMAGE CONTROLS
    // ======================================

    const hasMultipleImages =
        images.length > 1;


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


                    <!-- MAIN IMAGE -->

                    <div
                        class="product-image-stage"
                        id="product-image-stage"
                    >

                        <img
                            id="product-main-photo"
                            class="product-main-photo"
                            src="${escapeAttribute(images[0])}"
                            alt="${escapeAttribute(name)}"
                            loading="eager"
                            draggable="false"
                        >


                        ${
                            hasMultipleImages
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

                                  `
                                : ""
                        }


                    </div>


                    ${
                        hasMultipleImages
                            ? `

                                <!-- DOTS -->

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


                                <!-- THUMBNAILS -->

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
                                                aria-label="View photo ${index + 1}"
                                            >

                                                <img
                                                    src="${escapeAttribute(image)}"
                                                    alt="Product photo ${index + 1}"
                                                    loading="lazy"
                                                    draggable="false"
                                                >

                                            </button>

                                        `
                                    ).join("")}

                                </div>

                              `
                            : ""
                    }


                </div>

            </div>


            <!-- ==================================
                 PRODUCT INFORMATION
                 ================================== -->

            <div class="product-info">


                <p class="product-category">
                    ${escapeHtml(category)}
                </p>


                <h1 class="product-title">
                    ${escapeHtml(name)}
                </h1>


                ${priceHTML}


                <p class="product-description">
                    ${escapeHtml(description)}
                </p>


                ${sizeHTML}


                <!-- ==================================
                     ORDER FORM
                     ================================== -->

                <form
                    id="product-order-form"
                    class="product-order-form"
                >


                    <div class="form-group">

                        <input
                            type="text"
                            id="customer-name"
                            name="customerName"
                            placeholder="Your Name"
                            autocomplete="name"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <input
                            type="tel"
                            id="customer-phone"
                            name="customerPhone"
                            placeholder="Phone Number"
                            autocomplete="tel"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <textarea
                            id="customer-address"
                            name="customerAddress"
                            placeholder="Delivery Address"
                            rows="4"
                            autocomplete="street-address"
                            required
                        ></textarea>

                    </div>


                    <div class="product-quantity-section">

                        <label
                            for="product-quantity"
                        >
                            Quantity
                        </label>


                        <input
                            type="number"
                            id="product-quantity"
                            name="quantity"
                            value="1"
                            min="1"
                            max="20"
                            inputmode="numeric"
                        >

                    </div>


                    <button
                        type="submit"
                        class="order-whatsapp-btn"
                    >
                        Order on WhatsApp
                    </button>


                </form>


            </div>


        </div>


        <!-- ======================================
             FULL SCREEN IMAGE GALLERY
             ====================================== -->

        <div
            class="product-lightbox"
            id="product-lightbox"
            aria-hidden="true"
        >

            <button
                type="button"
                class="product-lightbox-close"
                id="product-lightbox-close"
                aria-label="Close full screen gallery"
            >
                ×
            </button>


            ${
                hasMultipleImages
                    ? `

                        <button
                            type="button"
                            class="product-lightbox-prev"
                            id="product-lightbox-prev"
                            aria-label="Previous photo"
                        >
                            ‹
                        </button>

                      `
                    : ""
            }


            <div
                class="product-lightbox-content"
                id="product-lightbox-content"
            >

                <img
                    id="product-lightbox-image"
                    src="${escapeAttribute(images[0])}"
                    alt="${escapeAttribute(name)}"
                    draggable="false"
                >

            </div>


            ${
                hasMultipleImages
                    ? `

                        <button
                            type="button"
                            class="product-lightbox-next"
                            id="product-lightbox-next"
                            aria-label="Next photo"
                        >
                            ›
                        </button>


                        <div
                            class="product-lightbox-counter"
                            id="product-lightbox-counter"
                        >
                            1 / ${images.length}
                        </div>

                      `
                    : ""
            }


        </div>

    `;


    // ======================================
    // SETUP IMAGE SLIDER
    // ======================================

    setupImageSlider(
        images,
        name
    );


    // ======================================
    // SETUP FULL SCREEN
    // ======================================

    setupLightbox(
        images,
        name
    );


    // ======================================
    // SETUP PRODUCT INTERACTIONS
    // ======================================

    setupProductInteractions(
        product,
        productUrl,
        images
    );

}


// ==========================================
// IMAGE SLIDER
// ==========================================

function setupImageSlider(
    images,
    name
) {

    const slider =
        document.getElementById(
            "product-image-slider"
        );


    const mainImage =
        document.getElementById(
            "product-main-photo"
        );


    if (!slider || !mainImage) {
        return;
    }


    const previousButton =
        document.getElementById(
            "product-slider-prev"
        );


    const nextButton =
        document.getElementById(
            "product-slider-next"
        );


    const dots =
        document.querySelectorAll(
            ".product-slider-dot"
        );


    const thumbnails =
        document.querySelectorAll(
            ".product-thumbnail"
        );


    // ======================================
    // SHOW IMAGE
    // ======================================

    function showSlide(index) {

        if (!images.length) {
            return;
        }


        if (index < 0) {

            index =
                images.length - 1;

        }


        if (index >= images.length) {

            index = 0;

        }


        currentImageIndex =
            index;


        mainImage.src =
            images[index];


        mainImage.alt =
            `${name} - Photo ${index + 1}`;


        // ----------------------------------
        // DOTS
        // ----------------------------------

        dots.forEach(
            (dot, dotIndex) => {

                dot.classList.toggle(
                    "active",
                    dotIndex === index
                );

            }
        );


        // ----------------------------------
        // THUMBNAILS
        // ----------------------------------

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
            event => {

                event.stopPropagation();

                showSlide(
                    currentImageIndex - 1
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
            event => {

                event.stopPropagation();

                showSlide(
                    currentImageIndex + 1
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
                event => {

                    event.stopPropagation();

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
                event => {

                    event.stopPropagation();

                    showSlide(index);

                }
            );

        }
    );


    // ======================================
    // SWIPE
    // ======================================

    let touchStartX = 0;

    let touchStartY = 0;


    slider.addEventListener(
        "touchstart",
        event => {

            if (!