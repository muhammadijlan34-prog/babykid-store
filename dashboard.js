// ==========================================
// BABY KID DASHBOARD
// File: dashboard.js
// Firebase Realtime Database + Authentication
// ==========================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    ref,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ==========================================
// ELEMENTS
// ==========================================

const productsList =
    document.getElementById("productsList");

const addProductBtn =
    document.getElementById("addProductBtn");

const logoutBtn =
    document.getElementById("logoutBtn") ||
    document.getElementById("logout-btn");


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
// ADD PRODUCT
// ==========================================

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

    if (!productsList) {
        return;
    }


    productsList.innerHTML = `
        <p class="loading-message">
            Loading products...
        </p>
    `;


    const productsRef =
        ref(db, "products");


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
const totalProducts =
    document.getElementById("totalProducts");

if (totalProducts) {
    totalProducts.textContent =
        Object.keys(products).length;
}


            Object.entries(products)
                .forEach(([id, product]) => {

                    const item =
                        document.createElement("div");


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
                            onerror="this.src='assets/logo.png'"
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


                    productsList.appendChild(item);

                });


            // ==================================
            // EDIT BUTTONS
            // ==================================

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


            // ==================================
            // DELETE BUTTONS
            // ==================================

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


                            button.disabled = true;

                            button.textContent =
                                "Deleting...";


                            try {

                                await remove(
                                    ref(
                                        db,
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
                                    "Unable to delete product.\n\n" +
                                    error.message
                                );


                                button.disabled = false;

                                button.textContent =
                                    "Delete";

                            }

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