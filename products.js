/* =========================================================
   BABY KID
   FILE: products.js
   Firebase Products Listing
   ========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyC6nT8HiXDargNR02jkYXJVOFaeYsX1ats",
    authDomain: "baby-kid-4107e.firebaseapp.com",
    databaseURL: "https://baby-kid-4107e-default-rtdb.firebaseio.com",
    projectId: "baby-kid-4107e",
    storageBucket: "baby-kid-4107e.firebasestorage.app",
    messagingSenderId: "45906293564",
    appId: "1:45906293564:web:f4b76b01899e736189a439",
    measurementId: "G-DTFHKQ1M3S"
};


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


/* =========================================================
   ELEMENTS
   ========================================================= */

const productGrid =
    document.getElementById("product-grid");

const searchInput =
    document.getElementById("product-search");

const filterButtons =
    document.querySelectorAll(".filter-btn");


/* =========================================================
   PRODUCTS
   ========================================================= */

let allProducts = [];


/* =========================================================
   LOAD PRODUCTS
   ========================================================= */

function loadProducts() {

    if (!productGrid) return;


    productGrid.innerHTML = `
        <div class="product-loading">
            Loading products...
        </div>
    `;


    const productsRef =
        ref(database, "products");


    onValue(
        productsRef,
        (snapshot) => {

            const data =
                snapshot.val();


            if (!data) {

                allProducts = [];

                showNoProducts();

                return;

            }


            allProducts =
                Object.entries(data).map(
                    ([id, product]) => ({
                        id,
                        ...product
                    })
                );


            renderProducts(allProducts);

        },
        (error) => {

            console.error(
                "Firebase products error:",
                error
            );


            productGrid.innerHTML = `
                <div class="no-products">
                    <h3>Unable to load products</h3>
                    <p>
                        Please check your internet connection
                        and try again.
                    </p>
                </div>
            `;

        }
    );

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts(products) {

    if (!productGrid) return;


    if (!products.length) {

        showNoProducts();

        return;

    }


    productGrid.innerHTML =
        products
            .map(createProductCard)
            .join("");


    addProductEvents();

}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(product) {

    const name =
        escapeHTML(
            product.name || "Baby Kid Product"
        );


    const category =
        escapeHTML(
            product.category || "Kidswear"
        );


    const description =
        escapeHTML(
            product.description || ""
        );


    const image =
        escapeHTML(
            product.image || ""
        );


    const price =
        Number(product.price || 0);


    const oldPrice =
        Number(product.oldPrice || 0);


    const badge =
        product.badge
            ?
            `
            <span class="product-badge">
                ${escapeHTML(product.badge)}
            </span>
            `
            :
            "";


    const sizes =
        Array.isArray(product.sizes)
            ?
            product.sizes.join(",")
            :
            "";


    const productURL =
        createProductURL(product);


    return `

        <article
            class="product-card"
            data-product-id="${escapeHTML(product.id)}"
            data-category="${escapeHTML(category)}"
        >

            <div class="product-image">

                ${badge}

                <img
                    src="${image}"
                    alt="${name}"
                    loading="lazy"
                    onerror="this.style.objectFit='contain';"
                >

            </div>


            <div class="product-info">

                <h3>
                    ${name}
                </h3>


                <div class="product-category">
                    ${category}
                </div>


                <p
                    class="product-description"
                    style="margin-top:6px;color:#777080;font-size:12px;"
                >
                    ${description}
                </p>


                <div class="product-price">

                    ₹${formatPrice(price)}

                    ${
                        oldPrice > price
                            ?
                            `
                            <span class="product-old-price">
                                ₹${formatPrice(oldPrice)}
                            </span>
                            `
                            :
                            ""
                    }

                </div>


                <div class="product-actions">

                    <a
                        href="${productURL}"
                        class="product-view-btn"
                    >
                        View
                    </a>


                    <button
                        type="button"
                        class="product-order-btn"
                        data-order-id="${escapeHTML(product.id)}"
                    >
                        Order
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   PRODUCT URL
   ========================================================= */

function createProductURL(product) {

    const params =
        new URLSearchParams();


    params.set(
        "id",
        product.id || ""
    );


    params.set(
        "name",
        product.name || ""
    );


    params.set(
        "category",
        product.category || ""
    );


    params.set(
        "price",
        product.price || ""
    );


    params.set(
        "oldPrice",
        product.oldPrice || ""
    );


    params.set(
        "image",
        product.image || ""
    );


    params.set(
        "description",
        product.description || ""
    );


    params.set(
        "badge",
        product.badge || ""
    );


    return `product.html?${params.toString()}`;

}


/* =========================================================
   ADD PRODUCT EVENTS
   ========================================================= */

function addProductEvents() {

    const orderButtons =
        document.querySelectorAll(
            ".product-order-btn"
        );


    orderButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const productId =
                    button.dataset.orderId;


                const product =
                    allProducts.find(
                        item =>
                            item.id === productId
                    );


                if (!product) return;


                orderOnWhatsApp(product);

            }
        );

    });

}


/* =========================================================
   WHATSAPP ORDER
   ========================================================= */

function orderOnWhatsApp(product) {

    const WHATSAPP_NUMBER =
        "919995953131";


    const message =
`Hello Baby Kid 👋

I would like to order this product.

👗 Product: ${product.name || "Product"}
📂 Category: ${product.category || "Kidswear"}
💰 Price: ${product.price ? "₹" + product.price : "Please confirm"}

Please confirm availability and order details.

Thank you ❤️`;


    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=` +
        encodeURIComponent(message);


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   SEARCH
   ========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const filtered =
                allProducts.filter(
                    product => {

                        const name =
                            String(
                                product.name || ""
                            ).toLowerCase();


                        const category =
                            String(
                                product.category || ""
                            ).toLowerCase();


                        const description =
                            String(
                                product.description || ""
                            ).toLowerCase();


                        return (
                            name.includes(query) ||
                            category.includes(query) ||
                            description.includes(query)
                        );

                    }
                );


            renderProducts(filtered);

        }
    );

}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

filterButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(
                item =>
                    item.classList.remove("active")
            );


            button.classList.add("active");


            const category =
                button.dataset.category ||
                button.textContent
                    .trim()
                    .toLowerCase();


            if (
                category === "all" ||
                category === "all products"
            ) {

                renderProducts(allProducts);

                return;

            }


            const filtered =
                allProducts.filter(
                    product =>
                        String(
                            product.category || ""
                        ).toLowerCase() ===
                        category.toLowerCase()
                );


            renderProducts(filtered);

        }
    );

});


/* =========================================================
   NO PRODUCTS
   ========================================================= */

function showNoProducts() {

    if (!productGrid) return;


    productGrid.innerHTML = `
        <div class="no-products">

            <h3>
                No products found
            </h3>

            <p>
                Products will appear here
                when they are added.
            </p>

        </div>
    `;

}


/* =========================================================
   PRICE FORMAT
   ========================================================= */

function formatPrice(price) {

    return Number(price || 0)
        .toLocaleString("en-IN");

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   START
   ========================================================= */

loadProducts();