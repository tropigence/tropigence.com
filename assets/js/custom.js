document.addEventListener('DOMContentLoaded', function() {
    // Hero slider indicator functionality
    function initHeroSlider() {
        const sliderContainer = document.querySelector('.hero-slider-container');
        const indicators = document.querySelectorAll('.hero-slider-indicators .indicator');

        if (!sliderContainer || !indicators.length) return;

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

        // Listen for scroll events with passive option for better performance on mobile
        sliderContainer.addEventListener('scroll', updateIndicators, { passive: true });

        // Add touchend event for iOS devices
        sliderContainer.addEventListener('touchend', function() {
            setTimeout(updateIndicators, 100); // Small delay to ensure scroll has completed
        }, { passive: true });

        // Initial update
        updateIndicators();

        // Additional update after images load
        window.addEventListener('load', updateIndicators);

        // Update on orientation change
        window.addEventListener('orientationchange', function() {
            setTimeout(updateIndicators, 200);
        });
    }

    // Initialize regular sliders
    function initAllSliders() {
        const sliderContainers = document.querySelectorAll('.floating-slider-container:not(.hero-slider-container)');

        sliderContainers.forEach(sliderContainer => {
            // Create indicators if they don't exist
            if (!sliderContainer.nextElementSibling?.classList.contains('slider-indicators')) {
                const slides = sliderContainer.children;
                if (!slides.length) return;

                // Create indicator container
                const indicatorContainer = document.createElement('div');
                indicatorContainer.className = 'slider-indicators';

                // Create indicators for each slide
                for (let i = 0; i < slides.length; i++) {
                    const indicator = document.createElement('span');
                    indicator.className = i === 0 ? 'indicator active' : 'indicator';
                    indicatorContainer.appendChild(indicator);
                }

                // Insert after slider
                sliderContainer.parentNode.insertBefore(indicatorContainer, sliderContainer.nextSibling);

                // Add click events to indicators
                const indicators = indicatorContainer.querySelectorAll('.indicator');
                indicators.forEach((indicator, index) => {
                    indicator.addEventListener('click', () => {
                        sliderContainer.scrollTo({
                            left: index * (sliderContainer.scrollWidth / slides.length),
                            behavior: 'smooth'
                        });

                        // Update indicators immediately
                        indicators.forEach((ind, i) => {
                            ind.classList.toggle('active', i === index);
                        });
                    });
                });

                // Update indicators on scroll
                function updateIndicators() {
                    const scrollPosition = sliderContainer.scrollLeft;
                    const slideWidth = sliderContainer.scrollWidth / slides.length;

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

                // Listen for scroll events
                sliderContainer.addEventListener('scroll', updateIndicators, { passive: true });

                // iOS touchend event
                sliderContainer.addEventListener('touchend', function() {
                    setTimeout(updateIndicators, 100);
                }, { passive: true });

                // Initial update
                updateIndicators();
            }
        });
    }

    // Initialize all sliders
    initHeroSlider();
    initAllSliders();

    // Add any other existing or future JavaScript functionality below
    // ...
});