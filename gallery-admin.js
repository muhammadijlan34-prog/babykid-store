
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    ref,
    push,
    set,
    update,
    remove,
    onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ==========================================
// CLOUDINARY SETTINGS
// ==========================================

const CLOUDINARY_CLOUD_NAME = "yfid2on4";
const CLOUDINARY_UPLOAD_PRESET = "babykid";

const CLOUDINARY_UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


// ==========================================
// HTML ELEMENTS
// ==========================================

const form =
    document.getElementById("gallery-upload-form");

const imageInput =
    document.getElementById("gallery-image");

const titleInput =
    document.getElementById("gallery-title");

const descriptionInput =
    document.getElementById("gallery-description");

const ratingInput =
    document.getElementById("gallery-rating");

const dateInput =
    document.getElementById("gallery-date");

const categoryInput =
    document.getElementById("gallery-category");

const previewImage =
    document.getElementById("gallery-image-preview");

const submitButton =
    document.getElementById("gallery-submit-btn");

const cancelButton =
    document.getElementById("gallery-cancel-btn");

const statusBox =
    document.getElementById("gallery-status");

const galleryList =
    document.getElementById("gallery-admin-list");

const formHeading =
    document.getElementById("gallery-form-heading");


// ==========================================
// VARIABLES
// ==========================================

let currentUser = null;
let editingGalleryId = null;
let existingImageUrl = "";
let galleryData = {};


// ==========================================
// STATUS MESSAGE
// ==========================================

function showStatus(message) {

    if (!statusBox) return;

    statusBox.textContent = message;
    statusBox.classList.add("visible");

}


function hideStatus() {

    if (!statusBox) return;

    statusBox.textContent = "";
    statusBox.classList.remove("visible");

}


// ==========================================
// IMAGE PREVIEW
// ==========================================

imageInput?.addEventListener("change", () => {

    const file = imageInput.files?.[0];

    if (!file) {

        previewImage?.classList.remove("visible");

        if (previewImage) {
            previewImage.src = "";
        }

        return;
    }

    if (!file.type.startsWith("image/")) {

        alert("Please select a valid image.");

        imageInput.value = "";

        return;
    }

    if (file.size > 10 * 1024 * 1024) {

        alert("Image size must be 10MB or smaller.");

        imageInput.value = "";

        return;
    }

    if (previewImage) {

        const objectUrl = URL.createObjectURL(file);

        previewImage.src = objectUrl;
        previewImage.classList.add("visible");

    }

});


// ==========================================
// CLOUDINARY UPLOAD
// ==========================================

async function uploadImageToCloudinary(file) {

    if (!file || !file.type.startsWith("image/")) {
        throw new Error("Please select a valid image.");
    }

    if (file.size > 10 * 1024 * 1024) {
        throw new Error("Image must be 10MB or smaller.");
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
    );

    const response = await fetch(
        CLOUDINARY_UPLOAD_URL,
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();

    if (!response.ok || !data.secure_url) {

        throw new Error(
            data.error?.message || "Image upload failed."
        );

    }

    return data.secure_url;

}


// ==========================================
// OPTIONAL FIELD HELPERS
// ==========================================

function getOptionalValue(value) {

    const cleanedValue = String(value || "").trim();

    return cleanedValue ? cleanedValue : null;

}


// ==========================================
// RESET FORM
// ==========================================

function resetGalleryForm() {

    form?.reset();

    editingGalleryId = null;

    existingImageUrl = "";

    if (previewImage) {

        previewImage.src = "";

        previewImage.classList.remove("visible");

    }

    if (formHeading) {
        formHeading.textContent = "Upload New Photo";
    }

    if (submitButton) {
        submitButton.textContent = "Upload to Gallery";
        submitButton.disabled = false;
    }

    cancelButton?.classList.remove("visible");

    if (imageInput) {
        imageInput.required = true;
    }

    hideStatus();

}


cancelButton?.addEventListener(
    "click",
    resetGalleryForm
);


// ==========================================
// LOAD GALLERY PHOTOS
// ==========================================

function loadGalleryPhotos() {

    const galleryRef = ref(db, "gallery");

    onValue(
        galleryRef,

        (snapshot) => {

            galleryData = snapshot.val() || {};

            renderGalleryList(galleryData);

        },

        (error) => {

            console.error(
                "Gallery loading error:",
                error
            );

            if (galleryList) {

                galleryList.textContent =
                    "Unable to load gallery photos.";

            }

        }

    );

}


// ==========================================
// RENDER GALLERY LIST
// ==========================================

function renderGalleryList(data) {

    if (!galleryList) return;

    galleryList.replaceChildren();

    const entries = Object.entries(data || {});

    entries.sort((a, b) => {
        return (Number(b[1]?.createdAt) || 0) -
               (Number(a[1]?.createdAt) || 0);
    });

    if (entries.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "gallery-empty";

        emptyMessage.textContent =
            "No gallery photos uploaded yet.";

        galleryList.appendChild(emptyMessage);

        return;
    }

    entries.forEach(([id, photo]) => {

        if (!photo || !photo.image) return;

        const card = document.createElement("article");

        card.className = "gallery-admin-item";


        const image = document.createElement("img");

        image.src = photo.image;

        image.alt = photo.title || "Baby Kid Gallery Photo";

        image.loading = "lazy";


        const content = document.createElement("div");

        content.className = "gallery-admin-item-content";


        const heading = document.createElement("h4");

        heading.textContent =
            photo.title || "Untitled Photo";


        const description = document.createElement("p");

        const details = [];

        if (photo.description) {
            details.push(photo.description);
        }

        if (photo.category) {
            details.push("Category: " + photo.category);
        }

        if (photo.event) {
            details.push("Event: " + photo.event);
        }

        if (photo.rating) {
            details.push("Rating: " + photo.rating + "/5");
        }

        description.textContent =
            details.length
                ? details.join(" • ")
                : "Photo only";


        const actions = document.createElement("div");

        actions.className = "gallery-admin-item-actions";


        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.className = "gallery-edit-btn";

        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {

            editGalleryPhoto(id, photo);

        });


        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className = "gallery-delete-btn";

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {

            deleteGalleryPhoto(id, deleteButton);

        });


        actions.append(
            editButton,
            deleteButton
        );

        content.append(
            heading,
            description,
            actions
        );

        card.append(
            image,
            content
        );

        galleryList.appendChild(card);

    });

}


// ==========================================
// EDIT GALLERY PHOTO
// ==========================================

function editGalleryPhoto(id, photo) {

    editingGalleryId = id;

    existingImageUrl = photo.image || "";


    if (titleInput) {
        titleInput.value = photo.title || "";
    }

    if (descriptionInput) {
        descriptionInput.value = photo.description || "";
    }

    if (ratingInput) {
        ratingInput.value = photo.rating || "";
    }

    if (dateInput) {
        dateInput.value = photo.event || "";
    }

    if (categoryInput) {
        categoryInput.value = photo.category || "";
    }

    if (imageInput) {
        imageInput.value = "";
        imageInput.required = false;
    }

    if (previewImage && existingImageUrl) {

        previewImage.src = existingImageUrl;

        previewImage.classList.add("visible");

    }

    if (formHeading) {
        formHeading.textContent = "Edit Gallery Photo";
    }

    if (submitButton) {
        submitButton.textContent = "Update Gallery Photo";
    }

    cancelButton?.classList.add("visible");

    hideStatus();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// DELETE GALLERY PHOTO
// ==========================================

async function deleteGalleryPhoto(id, button) {

    const confirmed = confirm(
        "Are you sure you want to delete this gallery photo?"
    );

    if (!confirmed) return;

    if (!currentUser) {

        alert("Please login first.");

        return;

    }

    button.disabled = true;

    button.textContent = "Deleting...";

    try {

        await remove(
            ref(db, `gallery/${id}`)
        );

        showStatus("Gallery photo deleted successfully.");

    } catch (error) {

        console.error(
            "Gallery delete error:",
            error
        );

        alert(
            "Unable to delete photo: " + error.message
        );

        button.disabled = false;

        button.textContent = "Delete";

    }

}


// ==========================================
// AUTHENTICATION
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    currentUser = user;

    loadGalleryPhotos();

});


// ==========================================
// UPLOAD / UPDATE FORM
// ==========================================

form?.addEventListener("submit", async (event) => {

    event.preventDefault();

    hideStatus();

    if (!currentUser) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }


    const selectedFile =
        imageInput?.files?.[0] || null;


    // Photo is required only for a new upload.
    if (!editingGalleryId && !selectedFile) {

        alert("Please choose a photo.");

        return;

    }


    if (selectedFile) {

        if (!selectedFile.type.startsWith("image/")) {

            alert("Please select a valid image.");

            return;

        }

        if (selectedFile.size > 10 * 1024 * 1024) {

            alert("Image size must be 10MB or smaller.");

            return;

        }

    }


    submitButton.disabled = true;

    submitButton.textContent = selectedFile
        ? "Uploading..."
        : "Saving...";


    try {

        let imageUrl = existingImageUrl;


        // Upload a new image if selected.
        if (selectedFile) {

            showStatus("Uploading image to Cloudinary...");

            imageUrl =
                await uploadImageToCloudinary(selectedFile);

        }


        if (!imageUrl) {

            throw new Error("Please select a photo.");

        }


        // All details except the image are optional.
        const photoData = {

            image: imageUrl,

            title: getOptionalValue(titleInput?.value),

            description: getOptionalValue(
                descriptionInput?.value
            ),

            rating: ratingInput?.value
                ? Number(ratingInput.value)
                : null,

            event: getOptionalValue(dateInput?.value),

            category: getOptionalValue(
                categoryInput?.value
            ),

            updatedAt: Date.now()

        };


        if (editingGalleryId) {

            // Preserve original creation date.
            photoData.createdAt =
                galleryData[editingGalleryId]?.createdAt ||
                Date.now();

            await update(
                ref(db, `gallery/${editingGalleryId}`),
                photoData
            );

            showStatus(
                "Gallery photo updated successfully."
            );

        } else {

            photoData.createdAt = Date.now();

            const newPhotoRef = push(
                ref(db, "gallery")
            );

            await set(
                newPhotoRef,
                photoData
            );

            showStatus(
                "Gallery photo uploaded successfully."
            );

        }


        resetGalleryForm();

        showStatus(
            editingGalleryId
                ? "Gallery photo saved successfully."
                : "Gallery photo uploaded successfully."
        );

    } catch (error) {

        console.error(
            "Gallery save error:",
            error
        );

        alert(
            "Unable to save gallery photo.\n\n" +
            error.message
        );

    } finally {

        submitButton.disabled = false;

        if (editingGalleryId) {

            submitButton.textContent =
                "Update Gallery Photo";

        } else {

            submitButton.textContent =
                "Upload to Gallery";

        }

    }

});
