document.addEventListener('DOMContentLoaded', function() {
    // Initialize all sliders (both hero and content sliders)
    function initAllSliders() {
        // Initialize hero slider
        initHeroSlider();

        // Initialize all content sliders
        initContentSliders();
    }

    // Hero slider indicator functionality
    function initHeroSlider() {
        const sliderContainer = document.querySelector('.hero-slider-container');
        const indicators = document.querySelectorAll('.hero-slider-indicators .indicator');
        const slides = document.querySelectorAll('.feature-style-hero');

        if (!sliderContainer || !slides.length) return;

        // Create indicators if they don't exist
        if (!indicators.length) {
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'hero-slider-indicators';
            sliderContainer.parentNode.appendChild(indicatorsContainer);

            slides.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = index === 0 ? 'indicator active' : 'indicator';
                indicatorsContainer.appendChild(indicator);
            });
        }

        const allIndicators = document.querySelectorAll('.hero-slider-indicators .indicator');

        // Update active indicator based on scroll position
        function updateIndicators() {
            const scrollPosition = sliderContainer.scrollLeft;
            const slideWidth = sliderContainer.clientWidth;

            // Calculate which slide is most visible
            const slideIndex = Math.round(scrollPosition / slideWidth);

            // Update indicator classes
            allIndicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === slideIndex);
            });
        }

        // Make indicators clickable
        allIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                sliderContainer.scrollTo({
                    left: index * sliderContainer.clientWidth,
                    behavior: 'smooth'
                });

                // Update indicators immediately for better UX
                allIndicators.forEach((ind, i) => {
                    ind.classList.toggle('active', i === index);
                });
            });
        });

        // Listen for scroll events
        sliderContainer.addEventListener('scroll', updateIndicators, { passive: true });
        sliderContainer.addEventListener('touchend', () => setTimeout(updateIndicators, 100), { passive: true });

        // Initial update
        updateIndicators();
        window.addEventListener('load', updateIndicators);
        window.addEventListener('orientationchange', () => setTimeout(updateIndicators, 200));
    }

    // Content sliders indicator functionality
    function initContentSliders() {
        const sliderContainers = document.querySelectorAll('.floating-slider-container');

        sliderContainers.forEach((sliderContainer) => {
            const slides = Array.from(sliderContainer.children);
            if (!slides.length) return;

            // Create indicators container
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'slider-indicators';
            sliderContainer.parentNode.appendChild(indicatorsContainer);

            // Create indicators
            slides.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = index === 0 ? 'indicator active' : 'indicator';
                indicatorsContainer.appendChild(indicator);
            });

            const indicators = indicatorsContainer.querySelectorAll('.indicator');

            // Update active indicator based on scroll position
            function updateIndicators() {
                const scrollPosition = sliderContainer.scrollLeft;
                const slideWidth = sliderContainer.clientWidth * 0.9; // Adjusted for peek effect

                // Calculate which slide is most visible
                const slideIndex = Math.min(
                    Math.round(scrollPosition / slideWidth),
                    slides.length - 1
                );

                // Update indicator classes
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === slideIndex);
                });
            }

            // Make indicators clickable
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    const slideWidth = sliderContainer.clientWidth * 0.9; // Adjusted for peek effect
                    sliderContainer.scrollTo({
                        left: index * slideWidth,
                        behavior: 'smooth'
                    });

                    // Update indicators immediately for better UX
                    indicators.forEach((ind, i) => {
                        ind.classList.toggle('active', i === index);
                    });
                });
            });

            // Listen for scroll events
            sliderContainer.addEventListener('scroll', updateIndicators, { passive: true });
            sliderContainer.addEventListener('touchend', () => setTimeout(updateIndicators, 100), { passive: true });

            // Initial update
            updateIndicators();
            window.addEventListener('load', updateIndicators);
            window.addEventListener('resize', updateIndicators);
            window.addEventListener('orientationchange', () => setTimeout(updateIndicators, 200));
        });
    }

    // Initialize all sliders
    initAllSliders();
});