/* =========================================================
   BABY KID
   FILE: script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. SPLASH SCREEN
    ===================================================== */

    const splashScreen = document.getElementById("splash-screen");

    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add("hidden");
        }, 1800);
    }


    /* =====================================================
       2. MOBILE MENU
    ===================================================== */

    const menuBtn = document.getElementById("menu-btn");
    const mobileNav = document.getElementById("mobile-nav");

    if (menuBtn && mobileNav) {

        menuBtn.addEventListener("click", () => {

            const isOpen = mobileNav.classList.toggle("open");

            menuBtn.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

            menuBtn.innerHTML = isOpen ? "✕" : "☰";

        });


        mobileNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                mobileNav.classList.remove("open");

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

                document.body.classList.remove(
                    "menu-open"
                );

                menuBtn.innerHTML = "☰";

            });

        });

    }


    /* =====================================================
       3. BACK TO TOP
    ===================================================== */

    const topBtn = document.getElementById("top-btn");

    if (topBtn) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 450) {
                topBtn.classList.add("show");
            } else {
                topBtn.classList.remove("show");
            }

        });


        topBtn.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =====================================================
       4. GOOGLE MAPS
       ===================================================== */

    const mapBtn = document.getElementById("map-btn");

    if (mapBtn) {

        mapBtn.addEventListener("click", () => {

            const mapsUrl =
                "https://www.google.com/maps/search/?api=1&query=Baby+Kid+Airport+Road+Aikkarappady+Kondotty+Malappuram+Kerala";

            window.open(
                mapsUrl,
                "_blank",
                "noopener,noreferrer"
            );

        });

    }


    /* =====================================================
       5. PRODUCT FILTER
    ===================================================== */

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const productGrid =
        document.getElementById("product-grid");

    const searchInput =
        document.getElementById("product-search-input");

    let currentCategory = "all";


    function getProductCards() {

        if (!productGrid) {
            return [];
        }

        return Array.from(
            productGrid.querySelectorAll(".product-card")
        );

    }


    function filterProducts() {

        const products = getProductCards();

        const searchText =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        let visibleCount = 0;


        products.forEach(product => {

            const category =
                (
                    product.dataset.category || ""
                ).toLowerCase();


            const searchableText =
                product.textContent.toLowerCase();


            const categoryMatch =
                currentCategory === "all" ||
                category === currentCategory;


            const searchMatch =
                !searchText ||
                searchableText.includes(searchText);


            if (categoryMatch && searchMatch) {

                product.style.display = "";

                visibleCount++;

            } else {

                product.style.display = "none";

            }

        });


        const noProducts =
            document.getElementById("no-products");


        if (noProducts) {

            if (visibleCount === 0 && products.length > 0) {
                noProducts.hidden = false;
            } else {
                noProducts.hidden = true;
            }

        }

    }


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentCategory =
                (
                    button.dataset.filter || "all"
                ).toLowerCase();

            filterProducts();

        });

    });


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterProducts
        );

    }


    /* =====================================================
       6. CATEGORY BUTTONS
    ===================================================== */

    document.querySelectorAll(
        "[data-category]"
    ).forEach(button => {

        button.addEventListener("click", () => {

            const category =
                (
                    button.dataset.category || ""
                ).toLowerCase();


            if (!category) {
                return;
            }


            currentCategory = category;


            filterButtons.forEach(btn => {

                btn.classList.toggle(
                    "active",
                    (
                        btn.dataset.filter || ""
                    ).toLowerCase() === category
                );

            });


            setTimeout(() => {
                filterProducts();
            }, 50);

        });

    });


    /* =====================================================
       7. WHATSAPP PRODUCT ORDER
    ===================================================== */

    document.addEventListener("click", event => {

        const orderButton =
            event.target.closest(".product-order-btn");


        if (!orderButton) {
            return;
        }


        const productCard =
            orderButton.closest(".product-card");


        if (!productCard) {
            return;
        }


        const productName =
            productCard.dataset.productName ||
            productCard.querySelector("h3")?.textContent ||
            "Product";


        const productCategory =
            productCard.dataset.category ||
            productCard.querySelector(".product-category")?.textContent ||
            "";


        const productPrice =
            productCard.dataset.price ||
            productCard.querySelector(".product-price")?.textContent ||
            "";


        const message =
`Hello Baby Kid 👋

I would like to order this product.

👕 Product: ${productName}
📂 Category: ${productCategory}
💰 Price: ${productPrice}

📏 Size: 
🔢 Quantity: 1

Please confirm availability and ordering details.

Thank you.`;


        const whatsappUrl =
            "https://wa.me/919995953131?text=" +
            encodeURIComponent(message);


        window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
        );

    });


    /* =====================================================
       8. PRODUCT VIEW BUTTON
    ===================================================== */

    document.addEventListener("click", event => {

        const viewButton =
            event.target.closest(".product-view-btn");


        if (!viewButton) {
            return;
        }


        const productCard =
            viewButton.closest(".product-card");


        if (!productCard) {
            return;
        }


        const image =
            productCard.querySelector(
                ".product-image img"
            );


        if (image) {

            const imageUrl =
                image.getAttribute("src");


            if (imageUrl) {

                window.open(
                    imageUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

            }

        }

    });


    /* =====================================================
       9. GALLERY IMAGE LIGHTBOX
    ===================================================== */

    const galleryGrid =
        document.getElementById("gallery-grid");


    if (galleryGrid) {

        galleryGrid.addEventListener(
            "click",
            event => {

                const image =
                    event.target.closest(
                        ".gallery-item img"
                    );


                if (!image) {
                    return;
                }


                const overlay =
                    document.createElement("div");


                overlay.className =
                    "gallery-lightbox";


                const fullImage =
                    document.createElement("img");


                fullImage.src =
                    image.src;


                fullImage.alt =
                    image.alt || "Baby Kid Gallery";


                overlay.appendChild(fullImage);


                document.body.appendChild(
                    overlay
                );


                requestAnimationFrame(() => {
                    overlay.classList.add("active");
                });


                overlay.addEventListener(
                    "click",
                    () => {

                        overlay.classList.remove(
                            "active"
                        );

                        setTimeout(() => {
                            overlay.remove();
                        }, 250);

                    }
                );

            }
        );

    }


    /* =====================================================
       10. ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (mobileNav) {

                mobileNav.classList.remove(
                    "open"
                );

            }


            if (menuBtn) {

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuBtn.innerHTML = "☰";

            }


            document.body.classList.remove(
                "menu-open"
            );


            const lightbox =
                document.querySelector(
                    ".gallery-lightbox"
                );


            if (lightbox) {
                lightbox.remove();
            }

        }
    );


    /* =====================================================
       11. INITIAL PRODUCT FILTER
    ===================================================== */

    filterProducts();


});