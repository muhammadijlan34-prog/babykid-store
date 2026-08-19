/* =========================================================
   BABY KID — MAIN JAVASCRIPT
   FILE 3 — script.js
   ========================================================= */


/* =========================================================
   01. DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initMobileMenu();

    initProductFilters();

    initProductSearch();

    initCurrentYear();

    initGoogleMapLink();

    initImageFallbacks();

});


/* =========================================================
   02. MOBILE MENU
   ========================================================= */

function initMobileMenu() {

    const menuButton =
        document.querySelector(".menu-btn");

    const mobileNav =
        document.querySelector(".mobile-nav");


    if (!menuButton || !mobileNav) {
        return;
    }


    menuButton.addEventListener("click", () => {

        const isOpen =
            mobileNav.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close menu"
                : "Open menu"
        );

        menuButton.textContent =
            isOpen ? "✕" : "☰";

    });


    /* Close menu after clicking a link */

    const mobileLinks =
        mobileNav.querySelectorAll("a");


    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileNav.classList.remove("open");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.setAttribute(
                "aria-label",
                "Open menu"
            );

            menuButton.textContent = "☰";

        });

    });

}


/* =========================================================
   03. PRODUCT FILTERS
   ========================================================= */

function initProductFilters() {

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const products =
        document.querySelectorAll(".product-card");


    if (!filterButtons.length || !products.length) {
        return;
    }


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedCategory =
                button.dataset.category;


            /* Remove active state */

            filterButtons.forEach(item => {

                item.classList.remove("active");

            });


            /* Add active state */

            button.classList.add("active");


            /* Filter products */

            products.forEach(product => {

                const productCategory =
                    product.dataset.category;


                if (
                    selectedCategory === "all" ||
                    productCategory === selectedCategory
                ) {

                    product.style.display = "";

                } else {

                    product.style.display = "none";

                }

            });


            /* Reset search */

            const searchInput =
                document.querySelector("#productSearch");


            if (searchInput) {

                searchInput.value = "";

            }

        });

    });

}


/* =========================================================
   04. PRODUCT SEARCH
   ========================================================= */

function initProductSearch() {

    const searchInput =
        document.querySelector("#productSearch");

    const products =
        document.querySelectorAll(".product-card");


    if (!searchInput || !products.length) {
        return;
    }


    searchInput.addEventListener(
        "input",
        () => {

            const searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();


            products.forEach(product => {

                const productName =
                    product.querySelector(
                        ".product-name"
                    )?.textContent
                    .toLowerCase() || "";


                const productCategory =
                    product.dataset.category
                    ?.toLowerCase() || "";


                const matches =
                    productName.includes(searchTerm) ||
                    productCategory.includes(searchTerm);


                product.style.display =
                    matches ? "" : "none";

            });


            /* Reset filter buttons */

            const filterButtons =
                document.querySelectorAll(".filter-btn");


            filterButtons.forEach(button => {

                button.classList.remove("active");

            });


            const allButton =
                document.querySelector(
                    '.filter-btn[data-category="all"]'
                );


            if (allButton) {

                allButton.classList.add("active");

            }

        }
    );

}


/* =========================================================
   05. CURRENT YEAR
   ========================================================= */

function initCurrentYear() {

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    if (!yearElements.length) {
        return;
    }


    const currentYear =
        new Date().getFullYear();


    yearElements.forEach(element => {

        element.textContent =
            currentYear;

    });

}


/* =========================================================
   06. GOOGLE MAPS
   ========================================================= */

function initGoogleMapLink() {

    const mapButtons =
        document.querySelectorAll(
            "[data-google-map]"
        );


    if (!mapButtons.length) {
        return;
    }


    /*
     * Actual Google Maps URL can be inserted here later.
     *
     * Current search location:
     * Baby Kid, Airport Road, Aikarappadi,
     * Kondotty, Malappuram, Kerala
     */

    const googleMapsUrl =
        "https://www.google.com/maps/search/?api=1&query=Baby+Kid+Airport+Road+Aikarappadi+Kondotty+Malappuram+Kerala";


    mapButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            window.open(
                googleMapsUrl,
                "_blank",
                "noopener,noreferrer"
            );

        });

    });

}


/* =========================================================
   07. IMAGE FALLBACK
   ========================================================= */

function initImageFallbacks() {

    const images =
        document.querySelectorAll("img");


    images.forEach(image => {

        image.addEventListener(
            "error",
            () => {

                image.classList.add(
                    "image-error"
                );

            },
            {
                once: true
            }
        );

    });

}


/* =========================================================
   08. SMOOTH INTERNAL LINKS
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const link =
            event.target.closest(
                'a[href^="#"]'
            );


        if (!link) {
            return;
        }


        const targetId =
            link.getAttribute("href");


        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }


        const target =
            document.querySelector(targetId);


        if (!target) {
            return;
        }


        event.preventDefault();


        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


/* =========================================================
   09. ACTIVE NAVIGATION
   ========================================================= */

function initActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            '.desktop-nav a[href^="#"]'
        );


    if (!sections.length || !navLinks.length) {
        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    const sectionId =
                        entry.target.id;


                    navLinks.forEach(link => {

                        link.classList.remove(
                            "active"
                        );


                        if (
                            link.getAttribute("href") ===
                            `#${sectionId}`
                        ) {

                            link.classList.add(
                                "active"
                            );

                        }

                    });

                });

            },
            {
                threshold: 0.25
            }
        );


    sections.forEach(section => {

        observer.observe(section);

    });

}


/* =========================================================
   10. INITIALIZE ACTIVE NAVIGATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initActiveNavigation();

    }
);


/* =========================================================
   11. ESCAPE KEY — CLOSE MOBILE MENU
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        const menuButton =
            document.querySelector(".menu-btn");

        const mobileNav =
            document.querySelector(".mobile-nav");


        if (!menuButton || !mobileNav) {
            return;
        }


        mobileNav.classList.remove("open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Open menu"
        );

        menuButton.textContent = "☰";

    }
);