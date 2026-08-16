/* =========================================================
   BABY KID
   FILE: script.js
   ========================================================= */


/* =========================================================
   1. SHOP CONFIGURATION
   ========================================================= */

const SHOP = {
    name: "Baby Kid",

    whatsapp: "919995953131",

    email: "babykid3131@gmail.com",

    address:
        "Baby Kid, Airport Road, Aikarappadi, Kondotty, Malappuram, Kerala",

    instagram:
        "https://www.instagram.com/baby_kid_official/",

    facebook: "",

    openingTime: "10:00 AM",

    closingTime: "10:00 PM",

    weeklyHoliday: "No",

    delivery: "All Kerala",

    deliveryCharge: 70
};


/* =========================================================
   2. DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initSplashScreen();

    initMobileMenu();

    initSmoothNavigation();

    initBackToTop();

    initProductSearch();

    initProductFilters();

    initCategoryLinks();

    initWhatsAppButtons();

    initContactLinks();

    initImageFallbacks();

});


/* =========================================================
   3. SPLASH SCREEN
   ========================================================= */

function initSplashScreen() {

    const splash = document.querySelector(".splash-screen");

    if (!splash) {
        return;
    }

    window.addEventListener("load", () => {

        setTimeout(() => {
            splash.classList.add("hidden");
        }, 1200);

    });

}


/* =========================================================
   4. MOBILE MENU
   ========================================================= */

function initMobileMenu() {

    const menuButton = document.querySelector(".menu-btn");

    const mobileNav = document.querySelector(".mobile-nav");

    if (!menuButton || !mobileNav) {
        return;
    }

    menuButton.addEventListener("click", () => {

        const isOpen =
            mobileNav.classList.toggle("open");

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.textContent =
            isOpen ? "✕" : "☰";

    });


    const mobileLinks =
        mobileNav.querySelectorAll("a");

    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileNav.classList.remove("open");

            document.body.classList.remove(
                "menu-open"
            );

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.textContent = "☰";

        });

    });

}


/* =========================================================
   5. SMOOTH NAVIGATION
   ========================================================= */

function initSmoothNavigation() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    links.forEach(link => {

        link.addEventListener("click", event => {

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

        });

    });

}


/* =========================================================
   6. BACK TO TOP
   ========================================================= */

function initBackToTop() {

    const topButton =
        document.querySelector(".top-btn");

    if (!topButton) {
        return;
    }

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            topButton.classList.add("show");

        } else {

            topButton.classList.remove("show");

        }

    });


    topButton.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================================
   7. PRODUCT SEARCH
   ========================================================= */

function initProductSearch() {

    const searchInput =
        document.querySelector(
            ".product-search input"
        );

    const products =
        document.querySelectorAll(
            ".product-card"
        );

    if (!searchInput || !products.length) {
        return;
    }

    searchInput.addEventListener(
        "input",
        () => {

            const search =
                searchInput.value
                    .trim()
                    .toLowerCase();

            products.forEach(product => {

                const text =
                    product.textContent
                        .toLowerCase();

                const matches =
                    text.includes(search);

                product.style.display =
                    matches ? "" : "none";

            });

        }
    );

}


/* =========================================================
   8. PRODUCT FILTERS
   ========================================================= */

function initProductFilters() {

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );

    const products =
        document.querySelectorAll(
            ".product-card"
        );

    if (!filterButtons.length) {
        return;
    }

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            const category =
                (
                    button.dataset.category ||
                    button.textContent
                )
                .trim()
                .toLowerCase();

            products.forEach(product => {

                const productCategory =
                    (
                        product.dataset.category ||
                        product.querySelector(
                            ".product-category"
                        )?.textContent ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                if (
                    category === "all" ||
                    category === "all products"
                ) {

                    product.style.display = "";

                    return;
                }


                if (
                    productCategory === category ||
                    productCategory.includes(category)
                ) {

                    product.style.display = "";

                } else {

                    product.style.display = "none";

                }

            });

        });

    });

}


/* =========================================================
   9. CATEGORY → PRODUCT FILTER
   ========================================================= */

function initCategoryLinks() {

    const categoryLinks =
        document.querySelectorAll(
            "[data-category-link]"
        );

    if (!categoryLinks.length) {
        return;
    }

    categoryLinks.forEach(link => {

        link.addEventListener("click", event => {

            const category =
                link.dataset.categoryLink;

            if (!category) {
                return;
            }

            const filter =
                document.querySelector(
                    `.filter-btn[data-category="${category}"]`
                );

            if (filter) {

                setTimeout(() => {

                    filter.click();

                }, 250);

            }

        });

    });

}


/* =========================================================
   10. WHATSAPP ORDER
   ========================================================= */

function openWhatsApp(message) {

    const text =
        encodeURIComponent(
            message ||
            `Hello Baby Kid, I would like to know more about your products.`
        );

    const url =
        `https://wa.me/${SHOP.whatsapp}?text=${text}`;

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   11. PRODUCT ORDER BUTTONS
   ========================================================= */

function initWhatsAppButtons() {

    const orderButtons =
        document.querySelectorAll(
            ".product-order-btn"
        );

    orderButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const product =
                button.closest(".product-card");

            if (!product) {
                openWhatsApp();
                return;
            }

            const name =
                product.querySelector(
                    ".product-name, h3"
                )?.textContent
                ?.trim() ||
                "a product";

            const price =
                product.querySelector(
                    ".product-price"
                )?.textContent
                ?.trim() ||
                "";


            const message =
                `Hello Baby Kid,

I am interested in this product:

Product: ${name}
${price ? `Price: ${price}` : ""}

Please provide more details and ordering information.`;

            openWhatsApp(message);

        });

    });

}


/* =========================================================
   12. GENERAL WHATSAPP LINKS
   ========================================================= */

function initContactLinks() {

    const whatsappLinks =
        document.querySelectorAll(
            '[data-contact="whatsapp"]'
        );

    whatsappLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            openWhatsApp();

        });

    });


    const emailLinks =
        document.querySelectorAll(
            '[data-contact="email"]'
        );

    emailLinks.forEach(link => {

        link.href =
            `mailto:${SHOP.email}`;

    });


    const instagramLinks =
        document.querySelectorAll(
            '[data-contact="instagram"]'
        );

    instagramLinks.forEach(link => {

        link.href = SHOP.instagram;

        link.target = "_blank";

        link.rel =
            "noopener noreferrer";

    });

}


/* =========================================================
   13. CONTACT INFORMATION AUTO-FILL
   ========================================================= */

function fillContactInformation() {

    const whatsappElements =
        document.querySelectorAll(
            "[data-shop-whatsapp]"
        );

    whatsappElements.forEach(element => {

        element.textContent =
            "99959 53131";

    });


    const emailElements =
        document.querySelectorAll(
            "[data-shop-email]"
        );

    emailElements.forEach(element => {

        element.textContent =
            SHOP.email;

    });


    const addressElements =
        document.querySelectorAll(
            "[data-shop-address]"
        );

    addressElements.forEach(element => {

        element.textContent =
            SHOP.address;

    });


    const instagramElements =
        document.querySelectorAll(
            "[data-shop-instagram]"
        );

    instagramElements.forEach(element => {

        element.href =
            SHOP.instagram;

    });

}


/* =========================================================
   14. IMAGE FALLBACKS
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

                image.style.objectFit =
                    "contain";

            },
            {
                once: true
            }
        );

    });

}


/* =========================================================
   15. PRODUCT CARD CLICK
   ========================================================= */

function initProductCards() {

    const cards =
        document.querySelectorAll(
            ".product-card"
        );

    cards.forEach(card => {

        const viewButton =
            card.querySelector(
                ".product-view-btn"
            );

        if (!viewButton) {
            return;
        }

        viewButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const productId =
                    card.dataset.productId;

                if (productId) {

                    window.location.href =
                        `product.html?id=${encodeURIComponent(productId)}`;

                    return;
                }

                const productName =
                    card.querySelector(
                        "h3"
                    )?.textContent
                    ?.trim();

                if (productName) {

                    const url =
                        `product.html?name=${encodeURIComponent(productName)}`;

                    window.location.href =
                        url;

                }

            }
        );

    });

}


/* =========================================================
   16. GALLERY IMAGE LIGHTBOX
   ========================================================= */

function initGalleryLightbox() {

    const galleryImages =
        document.querySelectorAll(
            ".gallery-item img"
        );

    if (!galleryImages.length) {
        return;
    }

    galleryImages.forEach(image => {

        image.style.cursor = "zoom-in";

        image.addEventListener(
            "click",
            () => {

                createLightbox(
                    image.src,
                    image.alt
                );

            }
        );

    });

}


function createLightbox(
    imageSrc,
    imageAlt
) {

    const existing =
        document.querySelector(
            ".image-lightbox"
        );

    if (existing) {
        existing.remove();
    }


    const lightbox =
        document.createElement("div");

    lightbox.className =
        "image-lightbox";


    lightbox.innerHTML = `
        <button
            class="lightbox-close"
            type="button"
            aria-label="Close image"
        >
            ✕
        </button>

        <img
            src="${imageSrc}"
            alt="${imageAlt || "Gallery image"}"
        >
    `;


    Object.assign(
        lightbox.style,
        {
            position: "fixed",
            inset: "0",
            zIndex: "99999",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "25px",
            background: "rgba(0,0,0,0.88)"
        }
    );


    const image =
        lightbox.querySelector("img");

    Object.assign(
        image.style,
        {
            maxWidth: "95%",
            maxHeight: "90vh",
            objectFit: "contain",
            borderRadius: "12px"
        }
    );


    const closeButton =
        lightbox.querySelector(
            ".lightbox-close"
        );

    Object.assign(
        closeButton.style,
        {
            position: "absolute",
            top: "18px",
            right: "18px",
            width: "44px",
            height: "44px",
            border: "0",
            borderRadius: "50%",
            background: "#ffffff",
            color: "#171329",
            fontSize: "20px"
        }
    );


    document.body.appendChild(lightbox);

    document.body.classList.add(
        "menu-open"
    );


    closeButton.addEventListener(
        "click",
        closeLightbox
    );


    lightbox.addEventListener(
        "click",
        event => {

            if (event.target === lightbox) {

                closeLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        handleLightboxKey
    );


    function closeLightbox() {

        lightbox.remove();

        document.body.classList.remove(
            "menu-open"
        );

        document.removeEventListener(
            "keydown",
            handleLightboxKey
        );

    }


    function handleLightboxKey(event) {

        if (event.key === "Escape") {

            closeLightbox();

        }

    }

}


/* =========================================================
   17. INSTALL APP BUTTON
   ========================================================= */

let deferredInstallPrompt = null;


window.addEventListener(
    "beforeinstallprompt",
    event => {

        event.preventDefault();

        deferredInstallPrompt = event;

        const installButtons =
            document.querySelectorAll(
                "[data-install-app]"
            );

        installButtons.forEach(button => {

            button.style.display = "inline-flex";

        });

    }
);


function initInstallButton() {

    const installButtons =
        document.querySelectorAll(
            "[data-install-app]"
        );

    if (!installButtons.length) {
        return;
    }

    installButtons.forEach(button => {

        button.style.display = "none";


        button.addEventListener(
            "click",
            async () => {

                if (!deferredInstallPrompt) {

                    alert(
                        "Install option is not available on this browser yet."
                    );

                    return;

                }


                deferredInstallPrompt.prompt();

                const result =
                    await deferredInstallPrompt.userChoice;

                if (
                    result.outcome ===
                    "accepted"
                ) {

                    button.style.display =
                        "none";

                }

                deferredInstallPrompt = null;

            }
        );

    });

}


window.addEventListener(
    "appinstalled",
    () => {

        deferredInstallPrompt = null;

        const installButtons =
            document.querySelectorAll(
                "[data-install-app]"
            );

        installButtons.forEach(button => {

            button.style.display = "none";

        });

    }
);


/* =========================================================
   18. INITIALIZE EXTRA FEATURES
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        fillContactInformation();

        initProductCards();

        initGalleryLightbox();

        initInstallButton();

    }
);


/* =========================================================
   19. GOOGLE MAP BUTTON
   ========================================================= */

function openGoogleMaps() {

    const query =
        encodeURIComponent(
            SHOP.address
        );

    const url =
        `https://www.google.com/maps/search/?api=1&query=${query}`;

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const mapButtons =
            document.querySelectorAll(
                "[data-google-map]"
            );

        mapButtons.forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    openGoogleMaps();

                }
            );

        });

    }
);


/* =========================================================
   20. CURRENT YEAR
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const yearElements =
            document.querySelectorAll(
                "[data-current-year]"
            );

        const year =
            new Date().getFullYear();

        yearElements.forEach(element => {

            element.textContent = year;

        });

    }
);


/* =========================================================
   21. ACTIVE NAVIGATION
   ========================================================= */

function initActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            '.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]'
        );

    if (
        !sections.length ||
        !navLinks.length
    ) {
        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id =
                        entry.target.id;

                    navLinks.forEach(link => {

                        link.classList.remove(
                            "active"
                        );

                        if (
                            link.getAttribute(
                                "href"
                            ) === `#${id}`
                        ) {

                            link.classList.add(
                                "active"
                            );

                        }

                    });

                });

            },
            {
                rootMargin:
                    "-25% 0px -65% 0px"
            }
        );


    sections.forEach(section => {

        observer.observe(section);

    });

}


document.addEventListener(
    "DOMContentLoaded",
    initActiveNavigation
);


/* =========================================================
   END OF FILE
   ========================================================= */