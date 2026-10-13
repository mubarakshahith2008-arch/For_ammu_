"use strict";

/* ============================================================
   SETTINGS YOU CAN CHANGE
   These are the main customisation options.
   ============================================================ */

/*
   IMPORTANT:
   Replace the text below with the custom password you choose.
   Keep the quotation marks around your password.
*/
const SITE_PASSWORD = "CHANGE_ME_TO_YOUR_PASSWORD";

/*
   Each filename points to a photo inside the images folder.
   Add photos using these exact filenames, or change these paths.
*/
const PHOTO_FILES = [
    "images/photo-01.jpg",
    "images/photo-02.jpg",
    "images/photo-03.jpg",
    "images/photo-04.jpg",
    "images/photo-05.jpg",
    "images/photo-06.jpg",
    "images/photo-07.jpg",
    "images/photo-08.jpg",
    "images/photo-09.jpg",
    "images/photo-10.jpg",
    "images/photo-11.jpg",
    "images/photo-12.jpg"
];

/* ============================================================
   FIND PAGE ELEMENTS
   Store the relevant HTML elements so they can be controlled.
   ============================================================ */

/* Screens shown at different stages of the experience. */
const welcomeScreen = document.getElementById("welcomeScreen");
const passwordScreen = document.getElementById("passwordScreen");
const siteScreen = document.getElementById("siteScreen");

/* Buttons and form for the first two screens. */
const enterWelcomeButton = document.getElementById("enterWelcomeButton");
const backToWelcomeButton = document.getElementById("backToWelcomeButton");
const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const passwordMessage = document.getElementById("passwordMessage");

/* Photo gallery and decorative heart container. */
const photoGrid = document.getElementById("photoGrid");
const floatingHearts = document.getElementById("floatingHearts");

/* Music element and its control buttons. */
const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggleButton = document.getElementById("musicToggleButton");
const muteToggleButton = document.getElementById("muteToggleButton");

/* Button that creates a burst of hearts in the birthday finale. */
const heartBurstButton = document.getElementById("heartBurstButton");


/* ============================================================
   SCREEN TRANSITIONS
   These functions move the visitor from welcome to password
   and then to the main birthday page.
   ============================================================ */

/*
   Hides the current screen and reveals the next one.
   A short delay lets the fade-out animation finish.
*/
function showScreen(currentScreen, nextScreen) {

    /* Start fading out the current screen. */
    currentScreen.classList.remove("is-visible");

    /* After the fade, hide the old screen completely. */
    window.setTimeout(() => {

        currentScreen.hidden = true;

        /* Allow the new screen to display. */
        nextScreen.hidden = false;

        /* Force the browser to recognise the screen's new state. */
        void nextScreen.offsetWidth;

        /* Begin the fade-in animation. */
        window.requestAnimationFrame(() => {
            nextScreen.classList.add("is-visible");
        });

    }, 450);
}

/* Button on the welcome page opens the password screen. */
enterWelcomeButton.addEventListener("click", () => {

    showScreen(welcomeScreen, passwordScreen);

    /* Put keyboard focus in the password field after the transition. */
    window.setTimeout(() => {
        passwordInput.focus();
    }, 500);
});

/* Back button returns the visitor to the first screen. */
backToWelcomeButton.addEventListener("click", () => {

    passwordMessage.textContent = "";
    passwordInput.value = "";

    showScreen(passwordScreen, welcomeScreen);
});


/* ============================================================
   PASSWORD CHECK
   The visitor must enter the chosen password to continue.
   ============================================================ */

/* Handles the password form when the visitor presses Enter or Unlock. */
passwordForm.addEventListener("submit", (event) => {

    /* Prevents the browser from reloading the page. */
    event.preventDefault();

    /* Reads the password typed by the visitor. */
    const enteredPassword = passwordInput.value;

    /*
       Refuses to unlock when the placeholder password is unchanged.
       This prevents an accidental unlock before you customise it.
    */
    if (SITE_PASSWORD === "CHANGE_ME_TO_YOUR_PASSWORD") {

        passwordMessage.textContent =
            "Set your password in script.js before testing the site.";

        return;
    }

    /* Compare the entered text against the configured password. */
    if (enteredPassword === SITE_PASSWORD) {

        /* Clear any previous error message. */
        passwordMessage.textContent = "";

        /* Reveal the main birthday page. */
        showScreen(passwordScreen, siteScreen);

        /* Start the reveal effects after the page becomes visible. */
        window.setTimeout(() => {
            setupRevealAnimations();
            createPhotoPlaceholders();
            refreshMusicButtons();

            /* Make sure the visitor begins at the page's top. */
            siteScreen.scrollTop = 0;
        }, 500);

        /*
           Try starting the music following the user's unlock click.
           Some browsers may still require clicking the Play music button.
        */
        startMusic();

    } else {

        /* Shows a message when the password is incorrect. */
        passwordMessage.textContent =
            "That password doesn't match. Please try again. ❤️";

        /* Selects the incorrect password so it can be replaced quickly. */
        passwordInput.select();
    }
});


/* ============================================================
   CREATE THE 12 PHOTO SPACES
   Missing photos remain as clearly labelled placeholders.
   ============================================================ */

/* Builds the gallery from PHOTO_FILES. */
function createPhotoPlaceholders() {

    /* Stop if the gallery has already been generated. */
    if (photoGrid.dataset.created === "true") {
        return;
    }

    /* Mark the gallery as created so it won't duplicate spaces. */
    photoGrid.dataset.created = "true";

    /* Loop through each photo filename. */
    PHOTO_FILES.forEach((photoPath, index) => {

        /* Human-readable number for each photo. */
        const photoNumber = String(index + 1).padStart(2, "0");

        /* Create a container for the photo or placeholder. */
        const frame = document.createElement("article");
        frame.className = "photo-frame";
        frame.dataset.reveal = "";

        /* Create the image element. */
        const image = document.createElement("img");
        image.className = "photo-image";
        image.src = photoPath;
        image.alt = `Memory photo ${photoNumber}`;
        image.loading = "lazy";

        /*
           When a photo loads successfully, show it and hide
           the empty placeholder.
        */
        image.addEventListener("load", () => {
            frame.classList.add("has-photo");
        });

        /*
           If the file does not exist or cannot be loaded, keep
           the placeholder visible instead of showing a broken icon.
        */
        image.addEventListener("error", () => {
            frame.classList.remove("has-photo");
        });

        /* Create the content shown when the photo is missing. */
        const placeholder = document.createElement("div");
        placeholder.className = "photo-placeholder";

        /* Add a decorative heart. */
        const heart = document.createElement("div");
        heart.className = "photo-placeholder-icon";
        heart.textContent = "♡";
        heart.setAttribute("aria-hidden", "true");

        /* Show which numbered photo belongs in this space. */
        const title = document.createElement("p");
        title.className = "photo-placeholder-title";
        title.textContent = `Photo ${photoNumber}`;

        /* Tell you the exact filename to add. */
        const filename = document.createElement("p");
        filename.className = "photo-placeholder-filename";
        filename.textContent = photoPath;

        /* Put the placeholder elements together. */
        placeholder.append(heart, title, filename);

        /* Put the photo and fallback placeholder in the frame. */
        frame.append(image, placeholder);

        /* Add the finished frame to the gallery. */
        photoGrid.appendChild(frame);
    });

    /* Watch the newly generated photo frames for reveal animations. */
    setupRevealAnimations();
}


/* ============================================================
   REVEAL-ON-SCROLL ANIMATIONS
   Text, cards, photos, and birthday content fade into view.
   ============================================================ */

/* Keeps the observer from being created repeatedly. */
let revealObserver = null;

/* Watches elements and gives them the revealed class when visible. */
function setupRevealAnimations() {

    /* Select every element marked for animation. */
    const revealElements = document.querySelectorAll("[data-reveal]");

    /* If the browser does not support IntersectionObserver, show all content. */
    if (!("IntersectionObserver" in window)) {

        revealElements.forEach((element) => {
            element.classList.add("revealed");
        });

        return;
    }

    /* Disconnect the previous observer before creating a new one. */
    if (revealObserver) {
        revealObserver.disconnect();
    }

    /* Create an observer that detects when an element enters the viewport. */
    revealObserver = new IntersectionObserver((entries, observer) => {

        /* Handle every element that was checked. */
        entries.forEach((entry) => {

            /* Ignore elements that are not visible enough yet. */
            if (!entry.isIntersecting) {
                return;
            }

            /* Adds the class that starts the fade-and-slide animation. */
            entry.target.classList.add("revealed");

            /* Stop watching an element after its first reveal. */
            observer.unobserve(entry.target);
        });

    }, {
        root: siteScreen,
        threshold: 0.12
    });

    /* Start watching all relevant sections and cards. */
    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}


/* ============================================================
   FLOATING HEARTS
   Creates a burst of hearts when the birthday button is pressed.
   ============================================================ */

/* A selection of heart and sparkle symbols for variety. */
const HEART_SYMBOLS = ["💗", "💖", "💕", "💓", "❤️", "✨"];

/* Adds a single floating decorative heart to the screen. */
function createFloatingHeart() {

    /* Make a new heart element. */
    const heart = document.createElement("span");
    heart.className = "floating-heart";

    /* Choose a symbol from the heart list. */
    heart.textContent =
        HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];

    /* Place the heart at a random horizontal position. */
    heart.style.left = `${Math.random() * 100}%`;

    /* Give the heart a random size. */
    heart.style.setProperty(
        "--heart-size",
        `${18 + Math.random() * 22}px`
    );

    /* Give the heart a slightly different animation duration. */
    heart.style.setProperty(
        "--heart-duration",
        `${3 + Math.random() * 3}s`
    );

    /* Add the heart to the decorative heart layer. */
    floatingHearts.appendChild(heart);

    /* Remove the heart after its animation has finished. */
    window.setTimeout(() => {
        heart.remove();
    }, 6500);
}

/* Creates a full burst of floating hearts. */
function createHeartBurst() {

    /* Create 22 hearts for a larger celebratory effect. */
    for (let count = 0; count < 22; count += 1) {

        /* Stagger the hearts so they don't appear all at once. */
        window.setTimeout(() => {
            createFloatingHeart();
        }, count * 90);
    }
}

/* Create a few gentle hearts on the welcome screen. */
for (let count = 0; count < 7; count += 1) {

    window.setTimeout(() => {
        createFloatingHeart();
    }, count * 500);
}

/* The final button triggers a burst of animated hearts. */
heartBurstButton.addEventListener("click", createHeartBurst);


/* ============================================================
   OPTIONAL GIFS
   Missing GIF files are hidden instead of showing broken images.
   ============================================================ */

/* Select all of the optional sticker images. */
const stickerImages = document.querySelectorAll(".sticker");

/* Hide any sticker that fails to load. */
stickerImages.forEach((sticker) => {

    sticker.addEventListener("error", () => {
        sticker.hidden = true;
    });

    /* Add a reveal marker to each loaded sticker. */
    sticker.dataset.reveal = "";

    /* Reveal the sticker once the browser finishes loading it. */
    sticker.addEventListener("load", () => {
        setupRevealAnimations();
    });
});


/* ============================================================
   MUSIC PLAYER
   Play/pause and mute/unmute controls for the supplied song.
   ============================================================ */

/* Keep the music playing from the beginning of its loop. */
backgroundMusic.loop = true;

/* Update the Play/Pause button's text to match the music state. */
function refreshMusicButtons() {

    /* The button changes according to whether the music is playing. */
    musicToggleButton.textContent = backgroundMusic.paused
        ? "▶ Play music"
        : "⏸ Pause music";

    /* The second button describes the action it will perform. */
    muteToggleButton.textContent = backgroundMusic.muted
        ? "🔇 Unmute"
        : "🔊 Mute";
}

/* Attempts to play the music and reports playback failure gracefully. */
function startMusic() {

    /* Ignore the request if the audio element is missing. */
    if (!backgroundMusic) {
        return;
    }

    /* Ask the browser to start the audio. */
    backgroundMusic.play()
        .then(() => {

            /* Refresh the label once playback begins. */
            refreshMusicButtons();

        })
        .catch(() => {

            /*
               Browsers may block automatic playback.
               The visitor can still press Play music manually.
            */
            refreshMusicButtons();
        });
}

/* Clicking the first music button toggles play or pause. */
musicToggleButton.addEventListener("click", () => {

    /* Pause the music if it's currently playing. */
    if (!backgroundMusic.paused) {

        backgroundMusic.pause();
        refreshMusicButtons();
        return;
    }

    /* Otherwise, try to start playback. */
    startMusic();
});

/* Clicking the second music button toggles mute. */
muteToggleButton.addEventListener("click", () => {

    /* Reverse the current muted state. */
    backgroundMusic.muted = !backgroundMusic.muted;

    /* Update the button label immediately. */
    refreshMusicButtons();
});

/* Keep the controls updated if the audio changes for another reason. */
backgroundMusic.addEventListener("play", refreshMusicButtons);
backgroundMusic.addEventListener("pause", refreshMusicButtons);
backgroundMusic.addEventListener("volumechange", refreshMusicButtons);

/* Set the correct initial music button labels. */
refreshMusicButtons();
