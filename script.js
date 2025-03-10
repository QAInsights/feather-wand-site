document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle Functionality
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem("theme");
  if (
    savedTheme === "dark" ||
    (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
  }

  // Toggle theme on click
  themeToggle.addEventListener("click", () => {
    if (body.classList.contains("light-mode")) {
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }
  });

  // Typing Effect for Tagline
  const words = ["Cursor", "Windsurf", "Copilot"];
  const typingText = document.getElementById("typing-text");
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isWaiting = false;

  function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      // Remove a character
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add a character
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    // If word is complete, wait and then delete
    if (!isDeleting && charIndex === currentWord.length) {
      isWaiting = true;
      setTimeout(() => {
        isDeleting = true;
        isWaiting = false;
      }, 1500); // Wait 1.5s before deleting
    }

    // If deletion is complete, move to next word
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }

    // Set typing speed
    let typeSpeed = isDeleting ? 50 : 100; // Faster when deleting

    // If waiting, don't schedule next frame
    if (!isWaiting) {
      setTimeout(typeEffect, typeSpeed);
    } else {
      setTimeout(typeEffect, 1500); // Continue after wait
    }
  }

  // Start the typing effect
  setTimeout(typeEffect, 1000); // Start after 1s

  // Screenshot Carousel - Only initialize if elements exist
  const carousel = document.querySelector(".screenshot-carousel");
  if (carousel) {
    const screenshots = document.querySelectorAll(".screenshot");
    const indicators = document.querySelectorAll(".indicator");
    const prevBtn = document.getElementById("prev-screenshot");
    const nextBtn = document.getElementById("next-screenshot");
    let currentIndex = 0;
    let isTransitioning = false;
    let autoplayInterval;

    function updateCarousel(direction = "next") {
      if (isTransitioning) return;
      isTransitioning = true;

      const currentSlide = screenshots[currentIndex];
      let nextIndex;

      if (direction === "next") {
        nextIndex = (currentIndex + 1) % screenshots.length;
      } else {
        nextIndex =
          (currentIndex - 1 + screenshots.length) % screenshots.length;
      }

      const nextSlide = screenshots[nextIndex];

      // Update slide visibility and ARIA states
      currentSlide.classList.remove("active");
      currentSlide.setAttribute("aria-hidden", "true");
      nextSlide.classList.add("active");
      nextSlide.setAttribute("aria-hidden", "false");

      // Update current index
      currentIndex = nextIndex;

      // Update indicators and their ARIA states
      indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
          indicator.classList.add("active");
          indicator.setAttribute("aria-selected", "true");
          indicator.setAttribute("tabindex", "0");
        } else {
          indicator.classList.remove("active");
          indicator.setAttribute("aria-selected", "false");
          indicator.setAttribute("tabindex", "-1");
        }
      });

      // Reset transition lock after animation
      setTimeout(() => {
        isTransitioning = false;
      }, 500);

      // Reset autoplay timer
      resetAutoplay();
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % screenshots.length;
        updateCarousel("next");
      }, 5000);
    }

    // Event listeners for carousel controls
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        if (isTransitioning) return;
        currentIndex =
          (currentIndex - 1 + screenshots.length) % screenshots.length;
        updateCarousel("prev");
      });

      nextBtn.addEventListener("click", () => {
        if (isTransitioning) return;
        currentIndex = (currentIndex + 1) % screenshots.length;
        updateCarousel("next");
      });
    }

    // Allow clicking on indicators
    if (indicators.length > 0) {
      indicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
          if (isTransitioning || currentIndex === index) return;
          currentIndex = index;
          updateCarousel();
        });
      });
    }

    // Initialize carousel
    if (screenshots.length > 0) {
      screenshots.forEach((slide, index) => {
        if (index === currentIndex) {
          slide.classList.add("active");
          slide.setAttribute("aria-hidden", "false");
        } else {
          slide.setAttribute("aria-hidden", "true");
        }
      });
    }

    if (indicators.length > 0) {
      indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
          indicator.classList.add("active");
          indicator.setAttribute("aria-selected", "true");
          indicator.setAttribute("tabindex", "0");
        } else {
          indicator.setAttribute("aria-selected", "false");
          indicator.setAttribute("tabindex", "-1");
        }
      });
    }

    // Add keyboard navigation
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (!isTransitioning) {
          currentIndex =
            (currentIndex - 1 + screenshots.length) % screenshots.length;
          updateCarousel("prev");
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (!isTransitioning) {
          currentIndex = (currentIndex + 1) % screenshots.length;
          updateCarousel("next");
        }
      }
    });

    resetAutoplay();

    // Pause autoplay on hover
    carousel.addEventListener("mouseenter", () => {
      clearInterval(autoplayInterval);
    });

    carousel.addEventListener("mouseleave", () => {
      resetAutoplay();
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");

  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      const toggle = item.querySelector(".faq-toggle");

      if (question && toggle) {
        // Add event listeners to both the question and toggle elements
        [question, toggle].forEach((element) => {
          element.addEventListener("click", (e) => {
            // Prevent event from bubbling up
            e.stopPropagation();

            // Toggle active class on clicked item
            item.classList.toggle("active");

            // Update the icon
            const icon = item.querySelector(".faq-toggle i");
            if (icon) {
              if (item.classList.contains("active")) {
                icon.classList.remove("fa-plus");
                icon.classList.add("fa-minus");
              } else {
                icon.classList.remove("fa-minus");
                icon.classList.add("fa-plus");
              }
            }

            // Close other items (optional, for accordion effect)
            faqItems.forEach((otherItem) => {
              if (otherItem !== item) {
                otherItem.classList.remove("active");
                // Reset other icons
                const otherIcon = otherItem.querySelector(".faq-toggle i");
                if (otherIcon) {
                  otherIcon.classList.remove("fa-minus");
                  otherIcon.classList.add("fa-plus");
                }
              }
            });
          });
        });
      }
    });
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for fixed header
          behavior: "smooth",
        });
      }
    });
  });

  // Add animation on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".feature-card, .testimonial-card, .pricing-card"
    );

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight;

      if (elementPosition < screenPosition - 100) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  };

  // Set initial state for animated elements
  document
    .querySelectorAll(".feature-card, .testimonial-card, .pricing-card")
    .forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });

  // Run animation check on load and scroll
  window.addEventListener("load", animateOnScroll);
  window.addEventListener("scroll", animateOnScroll);

  // Create placeholder images directory
  console.log("Feather Wand landing page loaded successfully!");

  // Set current year in footer
  document.getElementById("current-year").textContent =
    new Date().getFullYear();
});
