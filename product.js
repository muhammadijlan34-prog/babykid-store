// ==========================================
// BABY KID - PRODUCT DETAILS
// File: product.js
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

const FALLBACK_IMAGE = "assets/logo.png";


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
// GLOBAL STATE
// ==========================================

let currentImageIndex = 0;

let currentProductImages = [];

let currentProductName = "";


// ==========================================
// LOAD PRODUCT
// ==========================================

async function loadProduct() {

    if (!productDetail) {

        console.error(
            "Product detail container not found."
        );

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
    // NEW ARRAY FORMAT
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
    // FALLBACK
    // --------------------------------------

    if (images.length === 0) {

        images = [
            FALLBACK_IMAGE
        ];

    }


    // --------------------------------------
    // MAXIMUM 3 IMAGES
    // --------------------------------------

    return images.slice(0, 3);

}


// ==========================================
// GET PRODUCT SIZES
// ==========================================

function getProductSizes(product) {

    if (Array.isArray(product.sizes)) {

        return product.sizes
            .map(
                size =>
                    String(size).trim()
            )
            .filter(Boolean);

    }


    if (
        typeof product.sizes === "string"
    ) {

        return product.sizes
            .split(",")
            .map(
                size =>
                    size.trim()
            )
            .filter(Boolean);

    }


    return [];

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
        getProductSizes(product);


    // ======================================
    // SAVE GLOBAL DATA
    // ======================================

    currentImageIndex = 0;

    currentProductImages =
        images;

    currentProductName =
        name;


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

                        ${sizes
                            .map(
                                (size, index) => `

                                    <button
                                        type="button"
                                        class="size-btn"
                                        data-size="${escapeAttribute(size)}"
                                        ${index === 0 ? "aria-pressed=\"false\"" : ""}
                                    >
                                        ${escapeHtml(size)}
                                    </button>

                                `
                            )
                            .join("")}

                    </div>

                </div>
            `

            : "";


    // ======================================
    // MULTIPLE IMAGE CHECK
    // ======================================

    const hasMultipleImages =
        images.length > 1;


    // ======================================
    // PRODUCT HTML
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


                    <!-- MAIN IMAGE STAGE -->

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

                                    ${images
                                        .map(
                                            (_, index) => `

                                                <button
                                                    type="button"
                                                    class="product-slider-dot ${
                                                        index === 0
                                                            ? "active"
                                                            : ""
                                                    }"
                                                    data-slide="${index}"
                                                    aria-label="View photo ${index + 1}"
                                                ></button>

                                            `
                                        )
                                        .join("")}

                                </div>


                                <!-- THUMBNAILS -->

                                <div
                                    class="product-thumbnails"
                                    id="product-thumbnails"
                                >

                                    ${images
                                        .map(
                                            (image, index) => `

                                                <button
                                                    type="button"
                                                    class="product-thumbnail ${
                                                        index === 0
                                                            ? "active"
                                                            : ""
                                                    }"
                                                    data-slide="${index}"
                                                    aria-label="View photo ${index + 1}"
                                                >

                                                    <img
                                                        src="${escapeAttribute(image)}"
                                                        alt="Product photo ${index + 1}"
                                                        loading="lazy"
                                                        draggable="false"
                                                        onerror="this.src='${FALLBACK_IMAGE}'"
                                                    >

                                                </button>

                                            `
                                        )
                                        .join("")}

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
                            required
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
    // SETUP LIGHTBOX
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
    // SHOW SLIDE
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
    // PREVIOUS BUTTON
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
    // NEXT BUTTON
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
    // DOT BUTTONS
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
    // TOUCH SWIPE
    // ======================================

    let touchStartX = 0;

    let touchStartY = 0;

    let touchEndX = 0;

    let touchEndY = 0;


    slider.addEventListener(
        "touchstart",
        event => {

            if (!images.length) {
                return;
            }


            const touch =
                event.changedTouches[0];


            touchStartX =
                touch.clientX;


            touchStartY =
                touch.clientY;

        },
        {
            passive: true
        }
    );


    slider.addEventListener(
        "touchend",
        event => {

            if (!images.length) {
                return;
            }


            const touch =
                event.changedTouches[0];


            touchEndX =
                touch.clientX;


            touchEndY =
                touch.clientY;


            const deltaX =
                touchEndX - touchStartX;


            const deltaY =
                touchEndY - touchStartY;


            // Ignore mostly vertical swipes.

            if (
                Math.abs(deltaX) <
                Math.abs(deltaY)
            ) {

                return;

            }


            // Minimum swipe distance.

            if (
                Math.abs(deltaX) < 40
            ) {

                return;

            }


            if (deltaX < 0) {

                showSlide(
                    currentImageIndex + 1
                );

            } else {

                showSlide(
                    currentImageIndex - 1
                );

            }

        },
        {
            passive: true
        }
    );


    // ======================================
    // IMAGE ERROR HANDLING
    // ======================================

    mainImage.addEventListener(
        "error",
        () => {

            if (
                mainImage.src.indexOf(
                    FALLBACK_IMAGE
                ) === -1
            ) {

                mainImage.src =
                    FALLBACK_IMAGE;

            }

        }
    );


    // ======================================
    // INITIAL SLIDE
    // ======================================

    showSlide(0);

}


// ==========================================
// FULL SCREEN LIGHTBOX
// ==========================================

function setupLightbox(
    images,
    name
) {

    const mainImage =
        document.getElementById(
            "product-main-photo"
        );


    const lightbox =
        document.getElementById(
            "product-lightbox"
        );


    const lightboxImage =
        document.getElementById(
            "product-lightbox-image"
        );


    const closeButton =
        document.getElementById(
            "product-lightbox-close"
        );


    const previousButton =
        document.getElementById(
            "product-lightbox-prev"
        );


    const nextButton =
        document.getElementById(
            "product-lightbox-next"
        );


    const counter =
        document.getElementById(
            "product-lightbox-counter"
        );


    if (
        !mainImage ||
        !lightbox ||
        !lightboxImage
    ) {

        return;
    }


    // ======================================
    // UPDATE LIGHTBOX
    // ======================================

    function updateLightbox() {

        lightboxImage.src =
            images[currentImageIndex];


        lightboxImage.alt =
            `${name} - Photo ${currentImageIndex + 1}`;


        if (counter) {

            counter.textContent =
                `${currentImageIndex + 1} / ${images.length}`;

        }

    }


    // ======================================
    // OPEN
    // ======================================

    function openLightbox() {

        updateLightbox();


        lightbox.classList.add(
            "active"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "lightbox-open"
        );

    }


    // ======================================
    // CLOSE
    // ======================================

    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "lightbox-open"
        );

    }


    // ======================================
    // MAIN IMAGE CLICK
    // ======================================

    mainImage.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openLightbox();

        }
    );


    // ======================================
    // CLOSE BUTTON
    // ======================================

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                closeLightbox();

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


                if (!images.length) {
                    return;
                }


                currentImageIndex--;

                if (
                    currentImageIndex < 0
                ) {

                    currentImageIndex =
                        images.length - 1;

                }


                updateLightbox();

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


                if (!images.length) {
                    return;
                }


                currentImageIndex++;


                if (
                    currentImageIndex >=
                    images.length
                ) {

                    currentImageIndex = 0;

                }


                updateLightbox();

            }
        );

    }


    // ======================================
    // CLICK OUTSIDE IMAGE
    // ======================================

    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );


    // ======================================
    // KEYBOARD
    // ======================================

    document.addEventListener(
        "keydown",
        event => {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {

                return;

            }


            if (
                event.key === "Escape"
            ) {

                closeLightbox();

            }


            if (
                event.key === "ArrowLeft" &&
                images.length > 1
            ) {

                currentImageIndex--;


                if (
                    currentImageIndex < 0
                ) {

                    currentImageIndex =
                        images.length - 1;

                }


                updateLightbox();

            }


            if (
                event.key === "ArrowRight" &&
                images.length > 1
            ) {

                currentImageIndex++;


                if (
                    currentImageIndex >=
                    images.length
                ) {

                    currentImageIndex = 0;

                }


                updateLightbox();

            }

        }
    );


    // ======================================
    // LIGHTBOX SWIPE
    // ======================================

    let lightboxTouchStartX = 0;

    let lightboxTouchStartY = 0;


    lightbox.addEventListener(
        "touchstart",
        event => {

            const touch =
                event.changedTouches[0];


            lightboxTouchStartX =
                touch.clientX;


            lightboxTouchStartY =
                touch.clientY;

        },
        {
            passive: true
        }
    );


    lightbox.addEventListener(
        "touchend",
        event => {

            if (images.length <= 1) {
                return;
            }


            const touch =
                event.changedTouches[0];


            const deltaX =
                touch.clientX -
                lightboxTouchStartX;


            const deltaY =
                touch.clientY -
                lightboxTouchStartY;


            if (
                Math.abs(deltaX) <
                Math.abs(deltaY)
            ) {

                return;

            }


            if (
                Math.abs(deltaX) < 40
            ) {

                return;

            }


            if (deltaX < 0) {

                currentImageIndex++;


                if (
                    currentImageIndex >=
                    images.length
                ) {

                    currentImageIndex = 0;

                }

            } else {

                currentImageIndex--;


                if (
                    currentImageIndex < 0
                ) {

                    currentImageIndex =
                        images.length - 1;

                }

            }


            updateLightbox();

        },
        {
            passive: true
        }
    );

}


// ==========================================
// PRODUCT INTERACTIONS
// ==========================================

function setupProductInteractions(
    product,
    productUrl,
    images
) {

    // ======================================
    // SIZE SELECTION
    // ======================================

    const sizeButtons =
        document.querySelectorAll(
            ".size-btn"
        );


    let selectedSize = "";


    sizeButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    sizeButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );


                            item.setAttribute(
                                "aria-pressed",
                                "false"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    button.setAttribute(
                        "aria-pressed",
                        "true"
                    );


                    selectedSize =
                        button.dataset.size ||
                        button.textContent.trim();

                }
            );

        }
    );


    // ======================================
    // ORDER FORM
    // ======================================

    const orderForm =
        document.getElementById(
            "product-order-form"
        );


    if (!orderForm) {
        return;
    }


    orderForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const customerName =
                document
                    .getElementById(
                        "customer-name"
                    )
                    ?.value
                    .trim() || "";


            const customerPhone =
                document
                    .getElementById(
                        "customer-phone"
                    )
                    ?.value
                    .trim() || "";


            const customerAddress =
                document
                    .getElementById(
                        "customer-address"
                    )
                    ?.value
                    .trim() || "";


            const quantityInput =
                document
                    .getElementById(
                        "product-quantity"
                    );


            let quantity =
                Number(
                    quantityInput?.value
                ) || 1;


            if (quantity < 1) {
                quantity = 1;
            }


            if (quantity > 20) {
                quantity = 20;
            }


            // ==================================
            // BASIC VALIDATION
            // ==================================

            if (!customerName) {

                alert(
                    "Please enter your name."
                );

                return;
            }


            if (!customerPhone) {

                alert(
                    "Please enter your phone number."
                );

                return;
            }


            if (!customerAddress) {

                alert(
                    "Please enter your delivery address."
                );

                return;
            }


            // ==================================
            // PRODUCT DATA
            // ==================================

            const productName =
                currentProductName ||
                product.name ||
                "Baby Kid Product";


            const productPrice =
                Number(product.price) || 0;


            const currentImage =
                images[
                    currentImageIndex
                ] ||
                images[0] ||
                FALLBACK_IMAGE;


            // ==================================
            // WHATSAPP MESSAGE
            // ==================================

            let message =
                `Hello Baby Kid,%0A%0A`;


            message +=
                `I would like to order this product.%0A%0A`;


            message +=
                `*Product:* ${encodeURIComponent(productName)}%0A`;


            message +=
                `*Product ID:* ${encodeURIComponent(productId)}%0A`;


            message +=
                `*Price:* ₹${encodeURIComponent(productPrice)}%0A`;


            message +=
                `*Quantity:* ${encodeURIComponent(quantity)}%0A`;


            if (selectedSize) {

                message +=
                    `*Size:* ${encodeURIComponent(selectedSize)}%0A`;

            }


            message +=
                `%0A*Customer Name:* ${encodeURIComponent(customerName)}%0A`;


            message +=
                `*Phone:* ${encodeURIComponent(customerPhone)}%0A`;


            message +=
                `*Address:* ${encodeURIComponent(customerAddress)}%0A`;


            message +=
                `%0A*Product Link:*%0A${encodeURIComponent(productUrl)}%0A`;


            message +=
                `%0A*Product Photo:*%0A${encodeURIComponent(currentImage)}`;


            // ==================================
            // OPEN WHATSAPP
            // ==================================

            const whatsappUrl =
                `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


            window.open(
                whatsappUrl,
                "_blank"
            );

        }
    );

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