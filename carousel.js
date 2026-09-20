/*
 * Center-focus carousel
 * — shows one image in the center, with neighbors faded on either side
 * — auto-advances on a timer, pauses on hover
 * — arrows and dots for manual control
 */

(function () {
    'use strict';

    var AUTOPLAY_MS = 2500;

    var stage = document.querySelector('.carousel-stage');
    if (!stage) return;

    var slides = Array.prototype.slice.call(stage.querySelectorAll('.carousel-slide'));
    var dots   = Array.prototype.slice.call(document.querySelectorAll('.carousel-dot'));
    var prev   = document.querySelector('.carousel-arrow.prev');
    var next   = document.querySelector('.carousel-arrow.next');

    var current = 0;
    var timer = null;
    var total = slides.length;

    function setPositions() {
        slides.forEach(function (slide, i) {
            slide.classList.remove('is-center', 'is-left', 'is-right', 'is-hidden');

            var diff = (i - current + total) % total;
            if (diff === 0) slide.classList.add('is-center');
            else if (diff === 1) slide.classList.add('is-right');
            else if (diff === total - 1) slide.classList.add('is-left');
            else slide.classList.add('is-hidden');
        });

        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === current);
        });
    }

    function go(index) {
        current = (index + total) % total;
        setPositions();
    }

    function nextSlide() { go(current + 1); }
    function prevSlide() { go(current - 1); }

    function startAutoplay() {
        stopAutoplay();
        timer = setInterval(nextSlide, AUTOPLAY_MS);
    }

    function stopAutoplay() {
        if (timer) { clearInterval(timer); timer = null; }
    }

    // Wire up controls
    if (next) next.addEventListener('click', function () { nextSlide(); startAutoplay(); });
    if (prev) prev.addEventListener('click', function () { prevSlide(); startAutoplay(); });
    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { go(i); startAutoplay(); });
    });

    // Pause on hover / resume on leave
    stage.addEventListener('mouseenter', stopAutoplay);
    stage.addEventListener('mouseleave', startAutoplay);

    // Pause when the tab is hidden (saves CPU)
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) stopAutoplay();
        else startAutoplay();
    });

    // Touch swipe
    var startX = null;
    stage.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) {
            if (dx < 0) nextSlide();
            else prevSlide();
            startAutoplay();
        }
        startX = null;
    });

    setPositions();
    startAutoplay();
})();
