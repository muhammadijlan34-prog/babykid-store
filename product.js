/* =========================================================
   BABY KID
   FILE: product.js
   Product Details + WhatsApp Ordering
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const WHATSAPP_NUMBER = "919995953131";

    const productImage = document.getElementById("product-image");
    const productName = document.getElementById("product-name");
    const productCategory = document.getElementById("product-category");
    const productDescription = document.getElementById("product-description");
    const productPrice = document.getElementById("product-price");
    const productOldPrice = document.getElementById("product-old-price");
    const productBadge = document.getElementById("product-badge");

    const sizeButtons = document.querySelectorAll(".size-btn");
    const quantityInput = document.getElementById("product-quantity");

    const orderForm = document.getElementById("product-order-form");
    const customerName = document.getElementById("customer-name");
    const customerPhone = document.getElementById("customer-phone");
    const customerAddress = document.getElementById("customer-address");

    let selectedSize = "";


    /* =====================================================
       GET PRODUCT DATA
    ===================================================== */

    const params = new URLSearchParams(window.location.search);

    const productData = {
        id: params.get("id") || "",
        name: params.get("name") || "",
        category: params.get("category") || "",
        price: params.get("price") || "",
        oldPrice: params.get("oldPrice") || "",
        image: params.get("image") || "",
        description: params.get("description") || "",
        badge: params.get("badge") || ""
    };


    /* =====================================================
       HELPER — SAFE TEXT
    ===================================================== */

    function decodeValue(value) {

        try {
            return decodeURIComponent(value);
        } catch {
            return value;
        }

    }


    productData.name = decodeValue(productData.name);
    productData.category = decodeValue(productData.category);
    productData.description = decodeValue(productData.description);
    productData.image = decodeValue(productData.image);
    productData.badge = decodeValue(productData.badge);


    /* =====================================================
       DISPLAY PRODUCT
    ===================================================== */

    if (productName) {
        productName.textContent =
            productData.name || "Baby Kid Product";
    }

    if (productCategory) {
        productCategory.textContent =
            productData.category || "Kidswear";
    }

    if (productDescription) {
        productDescription.textContent =
            productData.description ||
            "Beautiful and comfortable kidswear from Baby Kid.";
    }

    if (productPrice) {

        if (productData.price) {
            productPrice.textContent =
                "₹" + productData.price;
        } else {
            productPrice.textContent = "Contact for price";
        }

    }

    if (productOldPrice) {

        if (productData.oldPrice) {
            productOldPrice.textContent =
                "₹" + productData.oldPrice;

            productOldPrice.style.display = "inline";
        } else {
            productOldPrice.style.display = "none";
        }

    }

    if (productImage && productData.image) {

        productImage.src = productData.image;

        productImage.alt =
            productData.name || "Baby Kid Product";

    }

    if (productBadge) {

        if (productData.badge) {
            productBadge.textContent = productData.badge;
            productBadge.style.display = "block";
        } else {
            productBadge.style.display = "none";
        }

    }


    /* =====================================================
       SIZE SELECTION
    ===================================================== */

    sizeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            sizeButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            selectedSize =
                button.dataset.size ||
                button.textContent.trim();

        });

    });


    /* =====================================================
       QUANTITY
    ===================================================== */

    if (quantityInput) {

        quantityInput.addEventListener("input", () => {

            let value =
                parseInt(quantityInput.value, 10);

            if (Number.isNaN(value) || value < 1) {
                value = 1;
            }

            if (value > 20) {
                value = 20;
            }

            quantityInput.value = value;

        });

    }


    /* =====================================================
       WHATSAPP ORDER
    ===================================================== */

    if (orderForm) {

        orderForm.addEventListener("submit", (event) => {

            event.preventDefault();


            const name =
                customerName ?
                customerName.value.trim() :
                "";

            const phone =
                customerPhone ?
                customerPhone.value.trim() :
                "";

            const address =
                customerAddress ?
                customerAddress.value.trim() :
                "";

            const quantity =
                quantityInput ?
                quantityInput.value :
                "1";


            /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

            if (!productData.name) {

                alert(
                    "Product information is missing."
                );

                return;

            }


            if (!selectedSize) {

                alert(
                    "Please select a size."
                );

                return;

            }


            if (!name) {

                alert(
                    "Please enter your name."
                );

                customerName?.focus();

                return;

            }


            if (!phone) {

                alert(
                    "Please enter your phone number."
                );

                customerPhone?.focus();

                return;

            }


            if (!address) {

                alert(
                    "Please enter your delivery address."
                );

                customerAddress?.focus();

                return;

            }


            /* ---------------------------------------------
               PHONE CLEANUP
            --------------------------------------------- */

            const cleanPhone =
                phone.replace(/\D/g, "");


            if (cleanPhone.length < 10) {

                alert(
                    "Please enter a valid phone number."
                );

                customerPhone?.focus();

                return;

            }


            /* ---------------------------------------------
               CREATE MESSAGE
            --------------------------------------------- */

            let message =
`Hello Baby Kid 👋

I would like to order this product.

👗 Product: ${productData.name}
📂 Category: ${productData.category || "Kidswear"}
📏 Size: ${selectedSize}
🔢 Quantity: ${quantity}
💰 Price: ${productData.price ? "₹" + productData.price : "Please confirm"}

👤 Customer Name: ${name}
📞 Phone: ${phone}
📍 Delivery Address:
${address}

Please confirm availability and delivery details.

Thank you ❤️`;


            /* ---------------------------------------------
               OPEN WHATSAPP
            --------------------------------------------- */

            const whatsappURL =
                `https://wa.me/${WHATSAPP_NUMBER}?text=` +
                encodeURIComponent(message);


            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );

        });

    }


    /* =====================================================
       BACK BUTTON
    ===================================================== */

    const backButtons =
        document.querySelectorAll(
            "[data-product-back]"
        );

    backButtons.forEach((button) => {

        button.addEventListener("click", () => {

            if (document.referrer) {
                history.back();
            } else {
                window.location.href = "index.html#products";
            }

        });

    });


    /* =====================================================
       IMAGE ERROR HANDLING
    ===================================================== */

    if (productImage) {

        productImage.addEventListener(
            "error",
            () => {

                productImage.alt =
                    "Baby Kid Product Image";

                productImage.style.objectFit =
                    "contain";

            }
        );

    }


});