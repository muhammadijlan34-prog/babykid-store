
import { db } from "./firebase.js";
import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const galleryGrid = document.getElementById("gallery-grid");

// Firebase Gallery data
const galleryRef = ref(db, "gallery");

// Create lightbox
const lightbox = document.createElement("div");

lightbox.id = "gallery-lightbox";

lightbox.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: rgba(0,0,0,0.92);
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

lightbox.innerHTML = `
    <button
        id="gallery-lightbox-close"
        type="button"
        aria-label="Close image"
        style="
            position:absolute;
            top:18px;
            right:22px;
            color:white;
            background:none;
            border:0;
            font-size:36px;
            cursor:pointer;
        "
    >×</button>

    <img
        id="gallery-lightbox-image"
        alt="Gallery photo"
        style="
            max-width:100%;
            max-height:85vh;
            object-fit:contain;
            border-radius:10px;
        "
    >
`;

document.body.appendChild(lightbox);

const lightboxImage = document.getElementById(
    "gallery-lightbox-image"
);

function closeLightbox() {
    lightbox.style.display = "none";
    lightboxImage.src = "";
}

document.getElementById(
    "gallery-lightbox-close"
).addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeLightbox();
    }
});

// Create one gallery card
function createGalleryCard(item) {
    const card = document.createElement("article");

    card.className = "gallery-card";

    const image = document.createElement("img");

    image.className = "gallery-image";
    image.src = item.image;
    image.alt = item.title || "Baby Kid Gallery";
    image.loading = "lazy";

    image.addEventListener("click", () => {
        lightboxImage.src = item.image;
        lightbox.style.display = "flex";
    });

    card.appendChild(image);

    const hasDetails =
        item.title ||
        item.description ||
        item.rating ||
        item.event ||
        item.category;

    if (hasDetails) {
        const details = document.createElement("div");

        details.className = "gallery-info";

        if (item.title) {
            const title = document.createElement("h3");
            title.textContent = item.title;
            details.appendChild(title);
        }

        if (item.description) {
            const description = document.createElement("p");
            description.textContent = item.description;
            details.appendChild(description);
        }

        if (item.rating) {
            const rating = document.createElement("p");
            rating.className = "gallery-rating";

            const numericRating = Math.max(
                0,
                Math.min(5, Number(item.rating))
            );

            if (Number.isFinite(numericRating)) {
                rating.textContent =
                    "★".repeat(Math.round(numericRating)) +
                    "☆".repeat(5 - Math.round(numericRating));

                details.appendChild(rating);
            }
        }

        if (item.event) {
            const event = document.createElement("p");
            event.className = "gallery-event";
            event.textContent = item.event;
            details.appendChild(event);
        }

        if (item.category) {
            const category = document.createElement("span");
            category.className = "gallery-category";
            category.textContent = item.category;
            details.appendChild(category);
        }

        card.appendChild(details);
    }

    return card;
}

// Load Gallery photos from Firebase
if (galleryGrid) {
    onValue(
        galleryRef,
        (snapshot) => {
            galleryGrid.replaceChildren();

            const data = snapshot.val();

            if (!data) {
                const emptyMessage = document.createElement("div");

                emptyMessage.className = "product-loading";
                emptyMessage.textContent =
                    "Gallery photos will appear here soon.";

                galleryGrid.appendChild(emptyMessage);
                return;
            }

            const galleryItems = Object.entries(data)
                .map(([id, item]) => ({
                    id,
                    ...item
                }))
                .filter((item) => item.image)
                .sort((a, b) => {
                    return (Number(b.createdAt) || 0) -
                           (Number(a.createdAt) || 0);
                });

            if (galleryItems.length === 0) {
                const emptyMessage = document.createElement("div");

                emptyMessage.className = "product-loading";
                emptyMessage.textContent =
                    "Gallery photos will appear here soon.";

                galleryGrid.appendChild(emptyMessage);
                return;
            }

            galleryItems.forEach((item) => {
                galleryGrid.appendChild(
                    createGalleryCard(item)
                );
            });
        },
        (error) => {
            console.error("Gallery loading error:", error);

            galleryGrid.replaceChildren();

            const errorMessage = document.createElement("div");

            errorMessage.className = "product-loading";
            errorMessage.textContent =
                "Unable to load gallery photos. Please try again later.";

            galleryGrid.appendChild(errorMessage);
        }
    );
}
