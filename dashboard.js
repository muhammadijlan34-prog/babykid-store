// ==========================================
// BABY KID DASHBOARD
// File: dashboard.js
// Firebase Realtime Database + Authentication
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

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


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);


// ==========================================
// LOGIN CHECK
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }

    loadProducts();

});


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href = "login.html";

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

            alert(
                "Logout failed. Please try again."
            );

        }

    });

}


// ==========================================
// ADD PRODUCT BUTTON
// ==========================================

const addProductBtn =
    document.getElementById("addProductBtn");

if (addProductBtn) {

    addProductBtn.addEventListener("click", () => {

        window.location.href =
            "add-product.html";

    });

}


// ==========================================
// LOAD PRODUCTS
// ==========================================

function loadProducts() {

    const productsList =
        document.getElementById("productsList");

    if (!productsList) return;


    productsList.innerHTML = `
        <p class="loading-message">
            Loading products...
        </p>
    `;


    const productsRef =
        ref(database, "products");


    onValue(
        productsRef,
        (snapshot) => {

            productsList.innerHTML = "";


            if (!snapshot.exists()) {

                productsList.innerHTML = `
                    <p class="empty-message">
                        No products available.
                    </p>
                `;

                return;
            }


            const products =
                snapshot.val();


            Object.entries(products)
                .forEach(
                    ([id, product]) => {

                        const item =
                            document.createElement(
                                "div"
                            );


                        item.className =
                            "product-item";


                        item.innerHTML = `

                            <img
                                src="${
                                    product.image ||
                                    "assets/logo.png"
                                }"
                                alt="${
                                    product.name ||
                                    "Baby Kid Product"
                                }"
                            >

                            <h3>
                                ${
                                    product.name ||
                                    "Unnamed Product"
                                }
                            </h3>

                            <p>
                                ₹${
                                    product.price || 0
                                }
                            </p>

                            <p>
                                ${
                                    product.category ||
                                    ""
                                }
                            </p>

                            <div class="action-buttons">

                                <button
                                    type="button"
                                    class="edit-btn"
                                    data-id="${id}"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    class="delete-btn"
                                    data-id="${id}"
                                >
                                    Delete
                                </button>

                            </div>
                        `;


                        productsList.appendChild(
                            item
                        );

                    }
                );


            // ======================================
            // DELETE BUTTONS
            // ======================================

            productsList
                .querySelectorAll(".delete-btn")
                .forEach((button) => {

                    button.addEventListener(
                        "click",
                        async () => {

                            const id =
                                button.dataset.id;


                            const confirmed =
                                confirm(
                                    "Are you sure you want to delete this product?"
                                );


                            if (!confirmed) {
                                return;
                            }


                            try {

                                await remove(
                                    ref(
                                        database,
                                        `products/${id}`
                                    )
                                );


                                alert(
                                    "Product deleted successfully."
                                );


                            } catch (error) {

                                console.error(
                                    "Delete error:",
                                    error
                                );


                                alert(
                                    "Unable to delete product."
                                );

                            }

                        }
                    );

                });


            // ======================================
            // EDIT BUTTONS
            // ======================================

            productsList
                .querySelectorAll(".edit-btn")
                .forEach((button) => {

                    button.addEventListener(
                        "click",
                        () => {

                            const id =
                                button.dataset.id;


                            window.location.href =
                                `add-product.html?id=${encodeURIComponent(id)}`;

                        }
                    );

                });

        },
        (error) => {

            console.error(
                "Product loading error:",
                error
            );


            productsList.innerHTML = `
                <p class="error-message">
                    Unable to load products.
                    Please try again.
                </p>
            `;

        }
    );

}