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
        // Iterate over each section that might contain a slider
        const sliderSections = document.querySelectorAll('.custom-feature-section');

        sliderSections.forEach((section, sectionIndex) => {
            const sliderContainer = section.querySelector('.floating-slider-container');
            if (!sliderContainer) return;

            // Filter for actual slide items
            const slides = Array.from(sliderContainer.children).filter(child =>
                child.matches('.custom-feature__item, .custom-feature__item-2')
            );

            const prevArrow = section.querySelector('.slider-arrow-prev');
            const nextArrow = section.querySelector('.slider-arrow-next');

            // If no slides or only one slide, hide/disable nav and skip further setup
            if (slides.length <= 1) {
                const existingIndicators = section.querySelector(`.slider-indicators[data-slider-id="slider-${sectionIndex}"]`);
                if (existingIndicators) existingIndicators.remove();

                if (prevArrow) {
                    prevArrow.style.display = 'none';
                    prevArrow.disabled = true;
                }
                if (nextArrow) {
                    nextArrow.style.display = 'none';
                    nextArrow.disabled = true;
                }
                return;
            }

            // Ensure arrows are visible if they were hidden for a single slide case
            if (prevArrow) prevArrow.style.display = '';
            if (nextArrow) nextArrow.style.display = '';

            // INDICATORS SETUP
            let indicatorsContainer = section.querySelector(`.slider-indicators[data-slider-id="slider-${sectionIndex}"]`);
            if (!indicatorsContainer) {
                indicatorsContainer = document.createElement('div');
                indicatorsContainer.className = 'slider-indicators';
                indicatorsContainer.dataset.sliderId = `slider-${sectionIndex}`;
                sliderContainer.parentNode.appendChild(indicatorsContainer);

                slides.forEach((_, index) => {
                    const indicator = document.createElement('div');
                    indicator.className = 'indicator';
                    if (index === 0) indicator.classList.add('active');
                    indicatorsContainer.appendChild(indicator);
                });
            }
            const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));

            // --- Helper Functions ---
            function getScrollTargetForIndex(index) {
                if (!slides[index]) return sliderContainer.scrollLeft;
                const targetSlide = slides[index];
                // Calculate scrollLeft needed to center the targetSlide
                return targetSlide.offsetLeft + (targetSlide.offsetWidth / 2) - (sliderContainer.offsetWidth / 2);
            }

            function getCurrentSlideIndex() {
                const scrollPosition = sliderContainer.scrollLeft;
                const containerWidth = sliderContainer.offsetWidth;
                const viewportCenter = scrollPosition + containerWidth / 2;
                let activeIndex = 0;
                let minDistance = Infinity;

                slides.forEach((slide, index) => {
                    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
                    const distance = Math.abs(viewportCenter - slideCenter);
                    if (distance < minDistance) {
                        minDistance = distance;
                        activeIndex = index;
                    }
                });
                return activeIndex;
            }

            function updateUI() {
                if (!slides.length) return;
                const currentIndex = getCurrentSlideIndex();

                // Update Indicators
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentIndex);
                });

                // Update Arrow States
                if (prevArrow && nextArrow) {
                    prevArrow.disabled = currentIndex === 0;
                    nextArrow.disabled = currentIndex === slides.length - 1;
                }
            }

            // --- Event Listeners ---
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    const targetScrollLeft = getScrollTargetForIndex(index);
                    sliderContainer.scrollTo({
                        left: targetScrollLeft,
                        behavior: 'smooth'
                    });
                    // UI will update via scroll event, but can force immediate visual for indicators:
                    // indicators.forEach((ind, i) => ind.classList.toggle('active', i === index));
                });
            });

            if (prevArrow) {
                prevArrow.addEventListener('click', () => {
                    const currentIndex = getCurrentSlideIndex();
                    const targetIndex = Math.max(0, currentIndex - 1);
                     if (currentIndex === targetIndex && currentIndex === 0) return;
                    const targetScrollLeft = getScrollTargetForIndex(targetIndex);
                    sliderContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                });
            }

            if (nextArrow) {
                nextArrow.addEventListener('click', () => {
                    const currentIndex = getCurrentSlideIndex();
                    const targetIndex = Math.min(slides.length - 1, currentIndex + 1);
                    if (currentIndex === targetIndex && currentIndex === slides.length - 1) return;
                    const targetScrollLeft = getScrollTargetForIndex(targetIndex);
                    sliderContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                });
            }

            sliderContainer.addEventListener('scroll', updateUI, { passive: true });
            sliderContainer.addEventListener('touchend', () => setTimeout(updateUI, 150), { passive: true });

            // For desktop mouse dragging
            sliderContainer.addEventListener('mousedown', () => { sliderContainer.dataset.isDragging = 'true'; });
            document.addEventListener('mouseup', () => { // Listen on document to catch mouseup outside slider
                if (sliderContainer.dataset.isDragging === 'true') {
                    setTimeout(updateUI, 150);
                }
                sliderContainer.dataset.isDragging = 'false';
            }, { capture: true });
            sliderContainer.addEventListener('mouseleave', () => {
                if (sliderContainer.dataset.isDragging === 'true') { // If mouse leaves while dragging
                    setTimeout(updateUI, 150);
                }
            });

            // Initial update
            updateUI();
            window.addEventListener('load', updateUI); // Re-check after all assets load
            window.addEventListener('resize', updateUI); // Responsive adjustments
            window.addEventListener('orientationchange', () => setTimeout(updateUI, 200)); // For device rotation
        });
    }

    // Initialize all sliders
    initAllSliders();
});
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