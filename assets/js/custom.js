document.addEventListener('DOMContentLoaded', function () {
    const AUTOPLAY_INTERVAL = 5000; // Autoplay scrolls every 5 seconds

    // Function to toggle theme
    function initThemeToggle() {
        const themeToggleButton = document.getElementById('theme-toggle');
        if (themeToggleButton) {
            themeToggleButton.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (currentTheme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'light');
                    localStorage.setItem('theme', 'light');
                } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                }
            });
        }

        // Apply saved theme on load
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const hrefAttribute = this.getAttribute('href');
                if (hrefAttribute && hrefAttribute !== '#' && hrefAttribute !== '#0') {
                    const targetElement = document.querySelector(hrefAttribute);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Mobile menu toggle
    function initMenuToggle() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function () {
                navMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }
    }

    // Hero slider indicator functionality
    function initHeroSlider() {
        const sliderContainer = document.querySelector('.hero-slider-container');
        if (!sliderContainer) return;

        let heroAutoplayTimer = null;
        const slides = Array.from(sliderContainer.children).filter(child => child.matches('.feature-style-hero'));
        if (slides.length <= 1) return; // No indicators needed for 0 or 1 slide

        let indicatorsContainer = document.querySelector('.hero-slider-indicators');
        if (!indicatorsContainer) {
            indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'hero-slider-indicators';
            // Insert after the slider container, typically within the hero-image-container
            if (sliderContainer.parentNode) {
                sliderContainer.parentNode.appendChild(indicatorsContainer);
            }
        } else {
            indicatorsContainer.innerHTML = ''; // Clear existing indicators if any
        }


        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                sliderContainer.scrollTo({
                    left: slides[index].offsetLeft,
                    behavior: 'smooth'
                });
                resetHeroAutoplay(); // Reset autoplay on manual interaction
            });
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = indicatorsContainer.querySelectorAll('.indicator');

        function updateHeroIndicators() {
            const scrollLeft = sliderContainer.scrollLeft;
            const containerWidth = sliderContainer.offsetWidth;
            let activeIndex = 0;
            let minDistance = Infinity;

            slides.forEach((slide, index) => {
                const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
                const viewCenter = scrollLeft + containerWidth / 2;
                const distance = Math.abs(slideCenter - viewCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    activeIndex = index;
                }
            });

            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === activeIndex);
            });
        }

        function startHeroAutoplay() {
            stopHeroAutoplay(); // Clear existing timer before starting a new one
            if (slides.length <= 1) return; // No autoplay for single or no slides
            heroAutoplayTimer = setInterval(() => {
                const currentIndex = getCurrentHeroSlideIndex();
                const nextIndex = (currentIndex + 1) % slides.length;
                sliderContainer.scrollTo({
                    left: slides[nextIndex].offsetLeft,
                    behavior: 'smooth'
                });
            }, AUTOPLAY_INTERVAL);
        }

        function stopHeroAutoplay() {
            if (heroAutoplayTimer) {
                clearInterval(heroAutoplayTimer);
                heroAutoplayTimer = null;
            }
        }

        function resetHeroAutoplay() {
            stopHeroAutoplay();
            startHeroAutoplay();
        }

        function getCurrentHeroSlideIndex() { // Helper to get current slide index for autoplay
            const scrollLeft = sliderContainer.scrollLeft;
            const slideWidth = slides[0] ? slides[0].offsetWidth : sliderContainer.offsetWidth;
            if (slideWidth === 0) return 0;
            return Math.round(scrollLeft / slideWidth);
        }

        sliderContainer.addEventListener('scroll', updateHeroIndicators, { passive: true });
        sliderContainer.addEventListener('touchend', () => { setTimeout(updateHeroIndicators, 150); resetHeroAutoplay(); }, { passive: true });
        sliderContainer.addEventListener('mouseup', () => { setTimeout(updateHeroIndicators, 150); resetHeroAutoplay(); });
        sliderContainer.addEventListener('mouseenter', stopHeroAutoplay);
        sliderContainer.addEventListener('mouseleave', startHeroAutoplay);


        updateHeroIndicators(); // Initial call
        window.addEventListener('resize', updateHeroIndicators);
        window.addEventListener('orientationchange', () => setTimeout(updateHeroIndicators, 200));
        startHeroAutoplay(); // Start autoplay
    }


    // Content sliders (custom-feature-section sliders)
    function initContentSliders() {
        const sliderSections = document.querySelectorAll('.custom-feature-section');

        sliderSections.forEach((section, sectionIndex) => {
            const sliderContainer = section.querySelector('.floating-slider-container');
            if (!sliderContainer) return;

            let contentAutoplayTimer = null;
            const slides = Array.from(sliderContainer.children).filter(child =>
                child.matches('.custom-feature__item, .custom-feature__item-2')
            );

            const prevArrow = section.querySelector('.slider-arrow-prev');
            const nextArrow = section.querySelector('.slider-arrow-next');

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

            if (prevArrow) prevArrow.style.display = '';
            if (nextArrow) nextArrow.style.display = '';

            let indicatorsContainer = section.querySelector(`.slider-indicators[data-slider-id="slider-${sectionIndex}"]`);
            if (!indicatorsContainer) {
                indicatorsContainer = document.createElement('div');
                indicatorsContainer.className = 'slider-indicators';
                indicatorsContainer.dataset.sliderId = `slider-${sectionIndex}`;
                // Append indicators container relative to the slider container's parent (the section)
                sliderContainer.parentNode.appendChild(indicatorsContainer);

                slides.forEach((_, index) => {
                    const indicator = document.createElement('div');
                    indicator.className = 'indicator';
                    if (index === 0) indicator.classList.add('active');
                    indicatorsContainer.appendChild(indicator);
                });
            }
            const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));

            function getScrollTargetForIndex(index) {
                if (!slides[index]) return sliderContainer.scrollLeft;

                // For autoplay and arrow navigation - we want to move just one item at a time
                const currentIndex = getCurrentSlideIndex();

                // If we're moving forward by one position (typical for autoplay and next button)
                if (index === (currentIndex + 1) % slides.length) {
                    // Calculate the width of a single slide (including its share of the gap)
                    const slideWidth = slides[0].offsetWidth;
                    const gap = parseInt(getComputedStyle(sliderContainer).gap) || 0;

                    // Move exactly one slide forward (width + gap)
                    return sliderContainer.scrollLeft + slideWidth + gap;
                }
                // If we're moving backward by one position (typical for prev button)
                else if (index === (currentIndex - 1 + slides.length) % slides.length) {
                    // Calculate the width of a single slide (including its share of the gap)
                    const slideWidth = slides[0].offsetWidth;
                    const gap = parseInt(getComputedStyle(sliderContainer).gap) || 0;

                    // Move exactly one slide backward (width + gap)
                    return sliderContainer.scrollLeft - (slideWidth + gap);
                }

                // For direct jumps via indicators, use the exact slide position
                return slides[index].offsetLeft;
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

                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentIndex);
                });

                if (prevArrow && nextArrow) {
                    prevArrow.disabled = currentIndex === 0;
                    nextArrow.disabled = currentIndex === slides.length - 1;
                }
            }

            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    const targetScrollLeft = getScrollTargetForIndex(index);
                    sliderContainer.scrollTo({
                        left: targetScrollLeft,
                        behavior: 'smooth'
                    });
                    resetContentAutoplay();
                });
            });

            if (prevArrow) {
                prevArrow.addEventListener('click', () => {
                    const currentIndex = getCurrentSlideIndex();
                    const targetIndex = Math.max(0, currentIndex - 1);
                    if (currentIndex === targetIndex && currentIndex === 0) return;
                    const targetScrollLeft = getScrollTargetForIndex(targetIndex);
                    sliderContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                    resetContentAutoplay();
                });
            }

            if (nextArrow) {
                nextArrow.addEventListener('click', () => {
                    const currentIndex = getCurrentSlideIndex();
                    const targetIndex = Math.min(slides.length - 1, currentIndex + 1);
                    if (currentIndex === targetIndex && currentIndex === slides.length - 1) return;
                    const targetScrollLeft = getScrollTargetForIndex(targetIndex);
                    sliderContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                    resetContentAutoplay();
                });
            }

            function startContentAutoplay() {
                stopContentAutoplay();
                if (slides.length <= 1) return;
                contentAutoplayTimer = setInterval(() => {
                    const currentIndex = getCurrentSlideIndex();
                    const nextIndex = (currentIndex + 1) % slides.length;
                    const targetScrollLeft = getScrollTargetForIndex(nextIndex);
                    sliderContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                }, AUTOPLAY_INTERVAL);
            }

            function stopContentAutoplay() {
                if (contentAutoplayTimer) {
                    clearInterval(contentAutoplayTimer);
                    contentAutoplayTimer = null;
                }
            }

            function resetContentAutoplay() {
                stopContentAutoplay();
                startContentAutoplay();
            }

            // Event listeners for interaction
            sliderContainer.addEventListener('scroll', updateUI, { passive: true });
            sliderContainer.addEventListener('touchend', () => { setTimeout(updateUI, 150); resetContentAutoplay(); }, { passive: true });

            let isDragging = false;
            sliderContainer.addEventListener('mousedown', () => { isDragging = true; });
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    setTimeout(updateUI, 150);
                    resetContentAutoplay(); // Reset autoplay after drag
                }
                isDragging = false;
            }, { capture: true }); // Use capture to catch mouseup even if outside slider

            sliderContainer.addEventListener('mouseenter', stopContentAutoplay);
            sliderContainer.addEventListener('mouseleave', startContentAutoplay);


            updateUI();
            window.addEventListener('load', updateUI);
            window.addEventListener('resize', updateUI);
            window.addEventListener('orientationchange', () => setTimeout(updateUI, 200));
            startContentAutoplay(); // Start autoplay for this content slider
        });
    }

    function initAllSliders() {
        initHeroSlider();
        initContentSliders();
    }

    // Initialize all functionalities
    initThemeToggle();
    initSmoothScroll();
    initMenuToggle();
    initAllSliders();
});
