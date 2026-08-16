/* =========================
   SV CLICKS - SCRIPT.JS
========================= */


/* =========================
   SCROLL PROGRESS
========================= */

const scrollProgress = document.getElementById("scrollProgress");

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress =
        documentHeight > 0
            ? (scrollTop / documentHeight) * 100
            : 0;

    if (scrollProgress) {
        scrollProgress.style.width = `${progress}%`;
    }
}

window.addEventListener("scroll", updateScrollProgress);
window.addEventListener("load", updateScrollProgress);


/* =========================
   MOBILE MENU
========================= */

const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");

function toggleMenu() {
    if (!menuButton || !navigation) return;

    menuButton.classList.toggle("active");
    navigation.classList.toggle("active");

    const isOpen = navigation.classList.contains("active");

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
    );
}


/* Close mobile menu when clicking a nav link */

document.querySelectorAll("#navigation a").forEach(link => {

    link.addEventListener("click", () => {

        if (!navigation || !menuButton) return;

        navigation.classList.remove("active");
        menuButton.classList.remove("active");

        menuButton.setAttribute("aria-label", "Open menu");

    });

});


/* Close menu when clicking outside */

document.addEventListener("click", event => {

    if (!navigation || !menuButton) return;

    const clickedInsideMenu =
        navigation.contains(event.target) ||
        menuButton.contains(event.target);

    if (!clickedInsideMenu) {
        navigation.classList.remove("active");
        menuButton.classList.remove("active");

        menuButton.setAttribute("aria-label", "Open menu");
    }

});


/* =========================
   THEME SWITCHER
========================= */

const themes = {

    blue: {
        main: "#4F9DFF",
        dark: "#2474D8"
    },

    gold: {
        main: "#D4AF37",
        dark: "#A88718"
    },

    green: {
        main: "#20C997",
        dark: "#159A73"
    },

    purple: {
        main: "#9B59FF",
        dark: "#7435D1"
    },

    red: {
        main: "#FF4F6D",
        dark: "#D93652"
    }

};


function changeTheme(themeName) {

    const theme = themes[themeName];

    if (!theme) return;

    document.documentElement.style.setProperty(
        "--main",
        theme.main
    );

    document.documentElement.style.setProperty(
        "--main-dark",
        theme.dark
    );

    /* Save selected theme */

    localStorage.setItem(
        "svClicksTheme",
        themeName
    );

}


/* Load saved theme */

const savedTheme = localStorage.getItem("svClicksTheme");

if (savedTheme && themes[savedTheme]) {
    changeTheme(savedTheme);
}


/* =========================
   GALLERY FILTER
========================= */

const filters = document.querySelectorAll(".filter");
const galleryCards = document.querySelectorAll(".gallery-card");

filters.forEach(filter => {

    filter.addEventListener("click", () => {

        /* Active button */

        filters.forEach(btn => {
            btn.classList.remove("active");
        });

        filter.classList.add("active");

        const selectedCategory =
            filter.dataset.filter;

        galleryCards.forEach(card => {

            const cardCategory =
                card.dataset.category;

            if (
                selectedCategory === "all" ||
                cardCategory === selectedCategory
            ) {

                card.style.display = "block";

                setTimeout(() => {
                    card.style.opacity = "1";
                    card.style.transform = "scale(1)";
                }, 20);

            } else {

                card.style.opacity = "0";
                card.style.transform = "scale(.85)";

                setTimeout(() => {
                    card.style.display = "none";
                }, 300);

            }

        });

    });

});


/* =========================
   LIGHTBOX
========================= */

const galleryImages = [];

document.querySelectorAll(".gallery-card img").forEach(img => {
    galleryImages.push(img.src);
});

let currentImageIndex = 0;

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");


function openLightbox(index) {

    if (!lightbox || !lightboxImage) return;

    if (!galleryImages.length) return;

    currentImageIndex = index;

    lightboxImage.src =
        galleryImages[currentImageIndex];

    lightbox.classList.add("active");

    document.body.classList.add("lightbox-open");

}


function closeLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove("active");

    document.body.classList.remove("lightbox-open");

}


function showImage(index) {

    if (!galleryImages.length || !lightboxImage) return;

    currentImageIndex =
        (index + galleryImages.length) %
        galleryImages.length;

    lightboxImage.src =
        galleryImages[currentImageIndex];

}


function nextImage() {

    showImage(currentImageIndex + 1);

}


function previousImage() {

    showImage(currentImageIndex - 1);

}


/* Close lightbox by clicking background */

if (lightbox) {

    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

}


/* Keyboard controls */

document.addEventListener("keydown", event => {

    if (!lightbox || !lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        nextImage();
    }

    if (event.key === "ArrowLeft") {
        previousImage();
    }

});


/* =========================
   FAQ ACCORDION
========================= */

const faqItems =
    document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question =
        item.querySelector(".faq-question");

    const answer =
        item.querySelector(".faq-answer");

    if (!question || !answer) return;

    question.addEventListener("click", () => {

        const isActive =
            item.classList.contains("active");


        /* Close all other FAQs */

        faqItems.forEach(otherItem => {

            if (otherItem !== item) {

                otherItem.classList.remove("active");

                const otherAnswer =
                    otherItem.querySelector(".faq-answer");

                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }

            }

        });


        /* Toggle current FAQ */

        if (isActive) {

            item.classList.remove("active");
            answer.style.maxHeight = null;

        } else {

            item.classList.add("active");

            answer.style.maxHeight =
                answer.scrollHeight + "px";

        }

    });

});


/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
    document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    /*
                     * Remove observer after animation
                     * so it doesn't repeat.
                     */

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================
   COUNTER ANIMATION
========================= */

const counters =
    document.querySelectorAll(".counter");

let countersStarted = false;


function animateCounters() {

    if (countersStarted) return;

    countersStarted = true;

    counters.forEach(counter => {

        const target =
            Number(counter.dataset.target);

        const duration = 1800;

        const startTime = performance.now();


        function updateCounter(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(elapsed / duration, 1);


            /* Ease-out animation */

            const eased =
                1 - Math.pow(1 - progress, 3);


            const currentValue =
                Math.floor(target * eased);

            counter.textContent =
                currentValue;


            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                counter.textContent =
                    target;

            }

        }


        requestAnimationFrame(updateCounter);

    });

}


/* Observe stats section */

const statsBox =
    document.querySelector(".stats-box");


if (statsBox) {

    const statsObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        animateCounters();

                        statsObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.3
            }
        );


    statsObserver.observe(statsBox);

}


/* =========================
   MAGNETIC BUTTON EFFECT
========================= */

const magneticButtons =
    document.querySelectorAll(".magnetic");


magneticButtons.forEach(button => {

    button.addEventListener("mousemove", event => {

        const rect =
            button.getBoundingClientRect();

        const x =
            event.clientX - rect.left - rect.width / 2;

        const y =
            event.clientY - rect.top - rect.height / 2;


        button.style.transform =
            `translate(${x * 0.15}px, ${y * 0.15}px)`;

    });


    button.addEventListener("mouseleave", () => {

        button.style.transform = "";

    });

});


/* =========================
   HERO PARALLAX
========================= */

const hero =
    document.querySelector(".hero");

const heroImage =
    document.querySelector(".hero-image");


window.addEventListener("scroll", () => {

    if (!hero || !heroImage) return;

    const scrollY =
        window.scrollY;

    if (scrollY < window.innerHeight) {

        heroImage.style.transform =
            `scale(1.08) translateY(${scrollY * 0.12}px)`;

    }

});


/* =========================
   HEADER SCROLL EFFECT
========================= */

const header =
    document.querySelector("header");


window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 50) {

        header.style.background =
            "rgba(5,8,14,.92)";

        header.style.boxShadow =
            "0 10px 35px rgba(0,0,0,.25)";

    } else {

        header.style.background =
            "rgba(5,8,14,.70)";

        header.style.boxShadow =
            "none";

    }

});


/* =========================
   IMAGE LAZY LOADING
========================= */

document.querySelectorAll("img").forEach(img => {

    if (
        !img.classList.contains("hero-image") &&
        !img.hasAttribute("loading")
    ) {

        img.setAttribute(
            "loading",
            "lazy"
        );

    }

});


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        if (navigation) {

            navigation.classList.remove("active");

        }

        if (menuButton) {

            menuButton.classList.remove("active");

            menuButton.setAttribute(
                "aria-label",
                "Open menu"
            );

        }

    }

});


/* =========================
   TOUCH SWIPE FOR LIGHTBOX
========================= */

let touchStartX = 0;
let touchEndX = 0;


if (lightbox) {

    lightbox.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        { passive: true }
    );


    lightbox.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[0].screenX;

            handleSwipe();

        },
        { passive: true }
    );

}


function handleSwipe() {

    const swipeDistance =
        touchEndX - touchStartX;


    if (Math.abs(swipeDistance) < 50) {
        return;
    }


    if (swipeDistance < 0) {

        nextImage();

    } else {

        previousImage();

    }

}


/* =========================
   PREVENT BROKEN LIGHTBOX
========================= */

if (lightboxImage) {

    lightboxImage.addEventListener(
        "error",
        () => {

            console.warn(
                "SV CLICKS: Image could not be loaded."
            );

        }
    );

}


/* =========================
   PAGE READY
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateScrollProgress();

        console.log(
            "SV CLICKS website loaded successfully."
        );

    }
);