document.addEventListener('DOMContentLoaded', function() {
    // Hero slider indicator functionality
    function initHeroSlider() {
        const sliderContainer = document.querySelector('.hero-slider-container');
        const indicators = document.querySelectorAll('.hero-slider-indicators .indicator');
        const slides = document.querySelectorAll('.feature-style-hero');

        if (!sliderContainer || !indicators.length || !slides.length) return;

        // Update active indicator based on scroll position
        function updateIndicators() {
            const scrollPosition = sliderContainer.scrollLeft;
            const slideWidth = sliderContainer.clientWidth;

            // Calculate which slide is most visible
            const slideIndex = Math.round(scrollPosition / slideWidth);

            // Update indicator classes
            indicators.forEach((indicator, index) => {
                if (index === slideIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        // Make indicators clickable
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                sliderContainer.scrollTo({
                    left: index * sliderContainer.clientWidth,
                    behavior: 'smooth'
                });

                // Update indicators immediately for better UX
                indicators.forEach((ind, i) => {
                    ind.classList.toggle('active', i === index);
                });
            });
        });

        // Listen for scroll events
        sliderContainer.addEventListener('scroll', updateIndicators);

        // Initial update
        updateIndicators();
    }

    // Initialize the hero slider
    initHeroSlider();

    // Add any other existing or future JavaScript functionality below
    // ...
});