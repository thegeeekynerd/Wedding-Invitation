// Run after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    setupScrollReveal();
    setupScrollTopButton();
    startPetals();
});

/* ---------------------------------------------
    SCROLL REVEAL (for sections with .reveal)
--------------------------------------------- */
function setupScrollReveal() {
    const revealEls = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        // Fallback: show everything if browser doesn't support it
        revealEls.forEach(el => el.classList.add("active"));
        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    // Stop observing the element once it has been revealed
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            // Trigger the animation when 20% of the element is visible
            threshold: 0.2
        }
    );

    revealEls.forEach(el => observer.observe(el));
}

/* ---------------------------------------------
    SCROLL-TO-TOP BUTTON
--------------------------------------------- */
function setupScrollTopButton() {
    const btn = document.getElementById("scrollTopBtn");
    if (!btn) return;

    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
        // Show button if scrolled past 350 pixels
        if (window.scrollY > 350) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    });

    // Smooth scroll to top when clicked
    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ---------------------------------------------
    PETALS BACKGROUND ANIMATION
    (Soft falling petals using JS, no extra CSS)
--------------------------------------------- */
function startPetals() {
    const container = document.querySelector(".petals");
    if (!container) return;

    function createPetal() {
        const petal = document.createElement("span");

        const size = 8 + Math.random() * 10; // 8–18px size
        const startLeft = Math.random() * 100; // Starting position (0-100vw)
        const duration = 8000 + Math.random() * 6000; // 8–14s fall duration

        // Initial petal styling (fixed position, size, and color)
        petal.style.position = "fixed";
        petal.style.top = "-10px"; // Start just above the viewport
        petal.style.left = startLeft + "vw";
        petal.style.width = size + "px";
        petal.style.height = size * 1.4 + "px";
        petal.style.borderRadius = "50%";
        petal.style.background = "rgba(255, 182, 193, 0.9)"; // light pink color
        petal.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
        petal.style.pointerEvents = "none";
        petal.style.zIndex = "-1";
        petal.style.opacity = "0.1"; // Start with low opacity to prevent flash

        container.appendChild(petal);

        const startTime = performance.now();
        const drift = (Math.random() * 2 - 1) * 40; // Max left/right sway (e.g., -40px to +40px)

        // Animation loop using requestAnimationFrame for smooth movement
        function fall(now) {
            const elapsed = now - startTime;
            const progress = elapsed / duration;

            if (progress >= 1) {
                // Remove the petal once it's finished falling
                petal.remove();
                return;
            }

            // Calculate vertical movement (110vh ensures it falls completely off-screen)
            const translateY = progress * 110; 
            
            // Calculate horizontal sway using a sine wave for smooth, natural movement
            const translateX = Math.sin(progress * 4 * Math.PI) * drift;
            
            // Calculate continuous rotation
            const rotate = progress * 360;

            // Apply transforms
            petal.style.transform = `translate(${translateX}px, ${translateY}vh) rotate(${rotate}deg)`;
            
            // Opacity: Fades in quickly (first 10%), then fades out slowly near the bottom (last 20%)
            petal.style.opacity = progress < 0.1 ? progress * 10 : 1 - Math.max(0, progress - 0.8) * 5;

            // Continue the animation loop
            requestAnimationFrame(fall);
        }

        requestAnimationFrame(fall);
    }

    // Create a new petal approximately every 900 milliseconds
    setInterval(createPetal, 900);
}