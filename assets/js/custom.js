document.addEventListener('DOMContentLoaded', function() {
    // Initialize all sliders
    function initAllSliders() {
        // Initialize hero slider (if exists)
        initHeroSlider();

        // Initialize all content sliders
        initContentSliders();
    }

    // Hero slider indicator functionality
    function initHeroSlider() {
        const sliderContainer = document.querySelector('.hero-slider-container');
        if (!sliderContainer) return;

        const slides = document.querySelectorAll('.feature-style-hero');
        if (!slides.length) return;

        // Create indicators container if it doesn't exist
        let indicatorsContainer = document.querySelector('.hero-slider-indicators');
        if (!indicatorsContainer) {
            indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'hero-slider-indicators';
            sliderContainer.parentNode.appendChild(indicatorsContainer);

            // Create indicators for each slide
            slides.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = index === 0 ? 'indicator active' : 'indicator';
                indicatorsContainer.appendChild(indicator);
            });
        }

        const indicators = indicatorsContainer.querySelectorAll('.indicator');

        // Update active indicator based on scroll position
        function updateIndicators() {
            const scrollPosition = sliderContainer.scrollLeft;
            const slideWidth = sliderContainer.clientWidth;

            // Calculate which slide is most visible
            const slideIndex = Math.round(scrollPosition / slideWidth);

            // Update indicator classes
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === slideIndex);
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
        sliderContainer.addEventListener('scroll', updateIndicators, { passive: true });
        sliderContainer.addEventListener('touchend', () => setTimeout(updateIndicators, 100), { passive: true });

        // Initial update
        updateIndicators();
        window.addEventListener('load', updateIndicators);
        window.addEventListener('resize', updateIndicators);
        window.addEventListener('orientationchange', () => setTimeout(updateIndicators, 200));
    }

    // Content sliders indicator functionality
    function initContentSliders() {
        const sliderContainers = document.querySelectorAll('.floating-slider-container');

        sliderContainers.forEach((sliderContainer, containerIndex) => {
            const slides = Array.from(sliderContainer.children);
            if (!slides.length) return;

            // Skip if this is a single item with no need for indicators
            if (slides.length <= 1) return;

            // Create indicators container
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'slider-indicators';
            // Add a unique ID to connect with the specific slider
            indicatorsContainer.dataset.sliderId = `slider-${containerIndex}`;
            sliderContainer.parentNode.appendChild(indicatorsContainer);

            // Create indicators for each slide
            slides.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = index === 0 ? 'indicator active' : 'indicator';
                indicatorsContainer.appendChild(indicator);
            });

            const indicators = indicatorsContainer.querySelectorAll('.indicator');

            // Update active indicator based on scroll position
            function updateIndicators() {
                const scrollPosition = sliderContainer.scrollLeft;
                const containerWidth = sliderContainer.offsetWidth;
                const slideWidth = containerWidth * (containerWidth < 768 ? 0.95 :
                                                    sliderContainer.classList.contains('has-2-items') ? 0.48 :
                                                    sliderContainer.classList.contains('has-3-items') && containerWidth >= 1024 ? 0.32 : 0.97);

                // Calculate which slide is most visible
                let slideIndex = Math.round(scrollPosition / slideWidth);
                // Ensure slideIndex is within bounds
                slideIndex = Math.min(Math.max(slideIndex, 0), slides.length - 1);

                // Update indicator classes
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === slideIndex);
                });
            }

            // Make indicators clickable
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    const containerWidth = sliderContainer.offsetWidth;
                    const slideWidth = containerWidth * (containerWidth < 768 ? 0.95 :
                                                        sliderContainer.classList.contains('has-2-items') ? 0.48 :
                                                        sliderContainer.classList.contains('has-3-items') && containerWidth >= 1024 ? 0.32 : 0.97);

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