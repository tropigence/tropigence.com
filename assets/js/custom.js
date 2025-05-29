document.addEventListener('DOMContentLoaded', function () {
    const CONTENT_AUTOPLAY_INTERVAL = 5000; // Regular sliders: 5 seconds
    const HERO_AUTOPLAY_INTERVAL = 5000;    // Hero slider: 5 seconds

    // Function to toggle theme
    function initThemeToggle() {
        // Don't add a new event listener - the one in _main.js will handle it

        // Just apply saved theme on load
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
            }, HERO_AUTOPLAY_INTERVAL); // Use hero-specific interval here
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
        // sliderContainer.addEventListener('mouseenter', stopHeroAutoplay);
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

            // Initial check for slider necessity, will also be handled by updateUI on resize/load
            const itemsFitInContainerInitial = sliderContainer.scrollWidth <= sliderContainer.offsetWidth;
            if (slides.length <= 1 || itemsFitInContainerInitial) {
                const indicatorsToHide = section.querySelector(`.slider-indicators[data-slider-id="slider-${sectionIndex}"]`);
                if (indicatorsToHide) {
                    // Instead of removing, hide it. updateUI will manage visibility.
                    // indicatorsToHide.remove();
                    indicatorsToHide.style.display = 'none';
                }
                if (prevArrow) {
                    prevArrow.style.display = 'none';
                    prevArrow.disabled = true;
                }
                if (nextArrow) {
                    nextArrow.style.display = 'none';
                    nextArrow.disabled = true;
                }
                stopContentAutoplay(); // Ensure autoplay is not running
                // Don't return yet, let updateUI handle final state,
                // especially if indicators are created then hidden by updateUI.
                // However, if no indicators are created, this early return is fine.
                // For safety, let's ensure indicators are created if needed, then updateUI handles visibility.
                // The original code would return here, preventing indicator creation.
                // If slides.length <=1, it's safe to return. If itemsFit, updateUI will handle.
                if (slides.length <= 1) return;
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
            } else {
                 // Ensure it's visible if it was hidden and now slider is active
                indicatorsContainer.style.display = '';
            }
            const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));

            function getScrollTargetForIndex(index) {
                if (!slides[index]) return sliderContainer.scrollLeft;

                // For navigation, always align items to the left edge of the container
                // This ensures clean transitions with multiple visible items

                // Simply return the offsetLeft of the target slide
                // This places the item at the left edge of the viewport
                return slides[index].offsetLeft;
            }

            // This should be the version that finds the slide closest to the current scrollLeft
            function getCurrentSlideIndex() {
                const currentScroll = sliderContainer.scrollLeft;
                let closestIndex = 0;
                let minDiff = Infinity;

                if (slides.length === 0) return 0;

                slides.forEach((slide, index) => {
                    const slideStart = slide.offsetLeft;
                    const diff = Math.abs(slideStart - currentScroll);

                    if (diff < minDiff) {
                        minDiff = diff;
                        closestIndex = index;
                    }
                    // If a slide's start is very close to currentScroll, it's a strong candidate.
                    // Note: return from forEach callback doesn't exit the outer function,
                    // but closestIndex will hold the best match.
                    if (diff < 1) { // Use a small tolerance
                        closestIndex = index;
                        // return; // This return is for the forEach callback
                    }
                });
                return closestIndex;
            }

            function updateUI() {
                if (!slides.length) return;

                const itemsFitInContainer = sliderContainer.scrollWidth <= sliderContainer.offsetWidth + 2; // 2px tolerance
                const hasMultipleSlides = slides.length > 1;

                if (!hasMultipleSlides || itemsFitInContainer) {
                    if (prevArrow) {
                        prevArrow.style.display = 'none';
                        prevArrow.disabled = true;
                    }
                    if (nextArrow) {
                        nextArrow.style.display = 'none';
                        nextArrow.disabled = true;
                    }
                    if (indicatorsContainer) indicatorsContainer.style.display = 'none';
                    stopContentAutoplay(); // Stop autoplay if items fit or only one slide
                    return;
                }

                // If we are here, slider is active, ensure controls are visible
                if (prevArrow) prevArrow.style.display = '';
                if (nextArrow) nextArrow.style.display = '';
                if (indicatorsContainer) indicatorsContainer.style.display = '';

                const currentIndex = getCurrentSlideIndex();

                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentIndex);
                });

                if (prevArrow && nextArrow) {
                    // Disable prev arrow if at the beginning
                    prevArrow.disabled = sliderContainer.scrollLeft < 2; // Small tolerance

                    // Disable next arrow if at the end
                    const maxScroll = sliderContainer.scrollWidth - sliderContainer.offsetWidth;
                    nextArrow.disabled = sliderContainer.scrollLeft >= maxScroll - 2; // Small tolerance
                }
            }

            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    const targetScrollLeft = getScrollTargetForIndex(index);
                    if (Math.abs(sliderContainer.scrollLeft - targetScrollLeft) > 1) {
                        sliderContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                        resetContentAutoplay();
                    }
                });
            });

            if (prevArrow) {
                prevArrow.addEventListener('click', () => {
                    const currentIndex = getCurrentSlideIndex();
                    const targetIndex = Math.max(0, currentIndex - 1);

                    if (currentIndex > 0 || (currentIndex === 0 && sliderContainer.scrollLeft > 1)) {
                        const targetScrollLeft = getScrollTargetForIndex(targetIndex);
                        if (Math.abs(sliderContainer.scrollLeft - targetScrollLeft) > 1) {
                            sliderContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                            resetContentAutoplay();
                        }
                    }
                });
            }

            if (nextArrow) {
                nextArrow.addEventListener('click', () => {
                    const currentIndex = getCurrentSlideIndex();
                    const maxScroll = sliderContainer.scrollWidth - sliderContainer.offsetWidth;

                    if (sliderContainer.scrollLeft < maxScroll - 2) { // If not already at the very end
                        let targetNextIndex = currentIndex + 1;
                        let targetScrollLeft;

                        if (slides[targetNextIndex]) {
                            targetScrollLeft = getScrollTargetForIndex(targetNextIndex);
                            if (targetScrollLeft > maxScroll) {
                                targetScrollLeft = maxScroll;
                            }
                        } else {
                            targetScrollLeft = maxScroll;
                        }

                        if (Math.abs(sliderContainer.scrollLeft - targetScrollLeft) > 1) {
                            sliderContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                            resetContentAutoplay();
                        }
                    }
                });
            }

            function startContentAutoplay() {
                stopContentAutoplay();
                if (slides.length <= 1) return;

                const maxScroll = sliderContainer.scrollWidth - sliderContainer.offsetWidth;
                if (maxScroll <= 2) { // If not scrollable (or barely), don't start autoplay
                    return;
                }

                contentAutoplayTimer = setInterval(() => {
                    const currentFirstIndex = getCurrentSlideIndex();
                    let targetScrollLeft;
                    const maxScroll = sliderContainer.scrollWidth - sliderContainer.offsetWidth;
                    const isEffectivelyAtEnd = sliderContainer.scrollLeft >= maxScroll - 2;

                    if (isEffectivelyAtEnd && slides.length > 1) { // If at the end, loop to beginning
                        targetScrollLeft = 0;
                    } else {
                        const nextPotentialIndex = currentFirstIndex + 1;
                        // Target the start of the next slide, or maxScroll if it's the end
                        targetScrollLeft = slides[nextPotentialIndex] ? getScrollTargetForIndex(nextPotentialIndex) : maxScroll;
                        if (targetScrollLeft > maxScroll) {
                            targetScrollLeft = maxScroll;
                        }
                    }

                    if (Math.abs(sliderContainer.scrollLeft - targetScrollLeft) > 1 || (targetScrollLeft === 0 && sliderContainer.scrollLeft !== 0) ) {
                         sliderContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                    }
                }, CONTENT_AUTOPLAY_INTERVAL);
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
